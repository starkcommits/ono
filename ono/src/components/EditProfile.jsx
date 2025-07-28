import React, { useCallback, useEffect, useRef, useState } from 'react'
import Back from '@/assets/Back.svg'
import NoProfilePic from '@/assets/NoProfilePic.svg'
import Gallery from '@/assets/Gallery.svg'
import Camera from '@/assets/Camera.svg'
import Right from '@/assets/Right.svg'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import {
  useFrappeAuth,
  useFrappeFileUpload,
  useFrappeGetDoc,
  useFrappeUpdateDoc,
  useSWRConfig,
} from 'frappe-react-sdk'
import { useNavigate, useParams } from 'react-router-dom'
import EditPencil from '@/assets/EditPencil.svg'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/cropImage'
import readFile from '@/lib/readFile'

const formSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(2, { error: 'Name must be at least 2 characters' })
    .max(50, { error: 'Name cannot exceed 50 characters' })
    .regex(/^[a-zA-Z\s]+$/, {
      error: 'Name can only contain letters and spaces',
    }),

  username: z
    .string({ error: 'Username is required' })
    .min(3, { error: 'Username must be at least 3 characters' })
    .max(30, { error: 'Username cannot exceed 30 characters' })
    .regex(/^[a-z_][a-z0-9_]*$/, {
      error:
        'Username must start with a letter or underscore, followed by lowercase letters, numbers, or underscores',
    }),

  mobile_number: z.string().optional(),

  email: z
    .string({ error: 'Email is required' })
    .email({ error: 'Please enter a valid email address' }),

  bio: z
    .string()
    .max(160, { error: 'Bio cannot exceed 160 characters' })
    .optional(),
})

const EditProfile = () => {
  const { currentUser } = useFrappeAuth()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { mutate } = useSWRConfig()

  const navigate = useNavigate()

  const { updateDoc, loading: updatingProfile } = useFrappeUpdateDoc()

  const { upload, progress, loading } = useFrappeFileUpload()

  const { data: userData } = useFrappeGetDoc(
    'User',
    currentUser,
    currentUser ? ['get_user_data'] : null
  )

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraUploadClick = () => {
    cameraInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return toast.error('No file selected.')

    // Accept all common image formats
    const supportedFormats = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff',
      'image/svg+xml',
    ]

    if (
      !file.type.startsWith('image/') ||
      !supportedFormats.includes(file.type)
    ) {
      return toast.error(
        'Please select a valid image file (PNG, JPEG, GIF, WebP, BMP, TIFF, SVG).'
      )
    }

    if (file.size > 10 * 1024 * 1024) return toast.error('Max size 10MB.')

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const minSize = 300
        if (img.width < minSize || img.height < minSize) {
          return toast.error(
            `Image too small for high quality processing. Minimum: ${minSize}x${minSize}px.`
          )
        }

        processOptimizedImage(img, file)
      }
      img.onerror = () => toast.error('Invalid image file.')
    }
    reader.readAsDataURL(file)
  }

  const processOptimizedImage = (img, originalFile) => {
    toast.loading('Processing...', { id: 'upload' })

    try {
      // Determine optimal output size based on device and usage
      const dpr = window.devicePixelRatio || 1
      const baseSize = 150 // Increased from 73px for better quality
      const finalSize = Math.min(baseSize * Math.max(dpr, 1.5), 300) // Cap at 300px

      // Light super-sampling for quality (2x instead of 20x)
      const workingSize = finalSize * 2

      // Create working canvas
      const workingCanvas = document.createElement('canvas')
      workingCanvas.width = workingSize
      workingCanvas.height = workingSize
      const workingCtx = workingCanvas.getContext('2d')

      // Enable high quality rendering
      workingCtx.imageSmoothingEnabled = true
      workingCtx.imageSmoothingQuality = 'high'

      // Create circular clipping path
      workingCtx.beginPath()
      workingCtx.arc(
        workingSize / 2,
        workingSize / 2,
        workingSize / 2,
        0,
        Math.PI * 2
      )
      workingCtx.clip()

      // Calculate center crop maintaining aspect ratio
      const aspect = img.width / img.height
      let sx, sy, sWidth, sHeight

      if (aspect > 1) {
        // Landscape: crop to square from center
        sHeight = img.height
        sWidth = img.height
        sx = (img.width - sWidth) / 2
        sy = 0
      } else {
        // Portrait: crop to square from center
        sWidth = img.width
        sHeight = img.width
        sx = 0
        sy = (img.height - sHeight) / 2
      }

      // Draw image at 2x resolution
      workingCtx.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        workingSize,
        workingSize
      )

      // Optional: Light sharpening filter (much simpler than original)
      const imageData = workingCtx.getImageData(0, 0, workingSize, workingSize)
      const sharpened = applyLightSharpening(
        imageData.data,
        workingSize,
        workingSize
      )
      const sharpenedImageData = new ImageData(
        sharpened,
        workingSize,
        workingSize
      )
      workingCtx.putImageData(sharpenedImageData, 0, 0)

      // Create final output canvas
      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = finalSize
      outputCanvas.height = finalSize

      const outputCtx = outputCanvas.getContext('2d')
      outputCtx.imageSmoothingEnabled = true
      outputCtx.imageSmoothingQuality = 'high'

      // Create circular clipping for final output
      outputCtx.beginPath()
      outputCtx.arc(finalSize / 2, finalSize / 2, finalSize / 2, 0, Math.PI * 2)
      outputCtx.clip()

      // Downsample to final size with high quality
      outputCtx.drawImage(
        workingCanvas,
        0,
        0,
        workingSize,
        workingSize,
        0,
        0,
        finalSize,
        finalSize
      )

      // Export with high quality
      outputCanvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error('Image Processing failed.', { id: 'upload' })
            setIsDrawerOpen(false)
            return
          }

          const circularFile = new File([blob], originalFile.name + '.png', {
            type: 'image/png',
          })

          // Upload the processed image
          upload(circularFile, {
            isPrivate: true,
            doctype: 'User',
            docname: currentUser,
            fieldname: 'image',
          })
            .then((res) =>
              updateDoc('User', currentUser, {
                user_image: res.file_url,
              })
            )
            .then(() => {
              toast.success('Profile picture updated successfully!', {
                id: 'upload',
              })
              setIsDrawerOpen(false)
              mutate((key) => Array.isArray(key) && key[0] === 'get_user_data')
            })
            .catch((error) => {
              toast.error('Upload failed. Please try again.', { id: 'upload' })
              setIsDrawerOpen(false)
            })
        },
        'image/png',
        0.95 // High quality but not maximum to reduce file size
      )
    } catch (error) {
      toast.error('Image processing failed. Please try again.', {
        id: 'upload',
      })
      setIsDrawerOpen(false)
    }
  }

  // Simplified light sharpening filter
  const applyLightSharpening = (data, width, height) => {
    const output = new Uint8ClampedArray(data.length)

    // Simple unsharp mask kernel (much lighter than original)
    const kernel = [0, -0.1, 0, -0.1, 1.4, -0.1, 0, -0.1, 0]

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0

          // Apply 3x3 kernel
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c
              const kernelValue = kernel[(ky + 1) * 3 + (kx + 1)]
              sum += data[pixelIndex] * kernelValue
            }
          }

          const outputIndex = (y * width + x) * 4 + c
          output[outputIndex] = Math.max(0, Math.min(255, sum))
        }

        // Copy alpha
        const alphaIndex = (y * width + x) * 4 + 3
        output[alphaIndex] = data[alphaIndex]
      }
    }

    // Copy edges without processing
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4
      const x = pixelIndex % width
      const y = Math.floor(pixelIndex / width)

      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        output[i] = data[i]
        output[i + 1] = data[i + 1]
        output[i + 2] = data[i + 2]
        output[i + 3] = data[i + 3]
      }
    }

    return output
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      mobile_number: '',
      bio: '',
    },
  })

  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.first_name,
        username: userData.username,
        email: userData.email,
        mobile_number: userData.email.split('@')[0],
        bio: userData.bio,
      })
    }
  }, [userData])

  async function onSubmit(data) {
    const { email, mobile_number, ...updatedData } = data

    try {
      toast.loading('Submitting...', {
        id: 'profile_update',
      })
      await updateDoc('User', currentUser, {
        first_name: updatedData.name,
        username: updatedData.username,
        last_name: '',
        bio: updatedData.bio,
      })
      toast.success('Profile Successfully Updated', {
        id: 'profile_update',
      })
    } catch (error) {
      toast.error(
        'Error occured in updating the profile. Please try again after some time',
        {
          id: 'profile_update',
        }
      )
    }
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen select-none w-full">
      <div className="sticky top-0 select-none w-full flex flex-col max-w-md mx-auto">
        <div className="flex justify-between items-center gap-3 px-4 py-4 bg-white border-b border-[#8D8D8D80]/50">
          <div className="flex items-center gap-2">
            <div>
              <img
                src={Back}
                alt=""
                className="cursor-pointer h-4 w-4"
                onClick={() => {
                  navigate(-1)
                }}
              />
            </div>
            <p className="font-[500] text-xl leading-[100%] text-[#2C2D32]">
              Edit Profile
            </p>
          </div>
        </div>
      </div>
      <div className="py-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Drawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            className=""
          >
            <DrawerTrigger>
              <div className="flex flex-col gap-2 cursor-pointer mx-auto">
                <div className="flex items-center justify-center">
                  {userData?.user_image ? (
                    <img
                      src={userData?.user_image}
                      width={73}
                      height={73}
                      alt=""
                    />
                  ) : (
                    <img width={73} height={73} src={NoProfilePic} alt="" />
                  )}
                </div>
                <div className="flex justify-center items-center gap-2">
                  <p className="font-semibold text-sm text-[#2C2D32]">Change</p>
                  <div>
                    <img src={EditPencil} alt="" />
                  </div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
              <div className="font-semibold text-[16px] leading-[22px] px-4 pt-2 pb-4">
                <p>Change Profile Image</p>
              </div>
              <div className="flex flex-col pb-12 last:border-b-0 text-[#2C2D32] text-sm leading-[22px] font-normal">
                <div
                  className="relative flex items-center justify-between px-4 cursor-pointer py-4 border-b"
                  onClick={handleCameraUploadClick}
                >
                  <div className="flex items-center gap-4">
                    <img src={Camera} alt="" />
                    <p>Take a Picture</p>
                  </div>
                  <div className="inline-block cursor-pointer">
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment" // back camera
                      onChange={handleFileChange}
                      className="hidden"
                      aria-label="Capture image"
                    />
                    <img
                      src={Right}
                      className="transition-all duration-200 text-gray-600"
                    />
                  </div>
                </div>

                <div
                  className="relative flex items-center justify-between px-4 cursor-pointer pt-4"
                  onClick={handleFileUploadClick}
                >
                  <div className="flex items-center gap-4 last:border-b-0">
                    <img src={Gallery} alt="" />
                    <p>Choose from Gallery</p>
                  </div>
                  <div className="inline-block cursor-pointer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-label="Upload file"
                    />
                    <img
                      src={Right}
                      className="transition-all duration-200 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="space-y-4 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" flex items-center gap-1 text-[#2C2D32] font-medium ">
                      <span className="text-xs">Name</span>
                      <span className="text-sm">*</span>
                    </FormLabel>
                    <p className="font-medium text-[10px] text-[#5F5F5F]">
                      It will be used for your tax documents.
                    </p>
                    <FormControl>
                      <Input
                        className="bg-white text-[10px] text-[#2C2D32]"
                        {...field}
                        placeholder="Enter Your Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" flex items-center gap-1 text-[#2C2D32] font-medium ">
                      <span className="text-xs">Username</span>
                      <span className="text-sm">*</span>
                    </FormLabel>
                    <p className="font-medium text-[10px] text-[#5F5F5F]">
                      It will help your friends find you.
                    </p>
                    <FormControl>
                      <Input
                        className="bg-white text-[#2C2D32] text-sm"
                        placeholder="Enter Your Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" flex items-center gap-1 text-[#2C2D32] font-medium ">
                      <span className="text-xs">Mobile Number</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#E3E3E3] placeholder:text-[#5F5F5F] text-[#5F5F5F] placeholder:text-sm cursor-none focus:cursor-none placeholder:font-inter"
                        {...field}
                        placeholder="Enter Your Mobile Number"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" flex items-center gap-1 text-[#2C2D32] font-medium ">
                      <span className="text-xs">Email</span>
                      <span className="text-sm">*</span>
                    </FormLabel>
                    <p className="font-medium text-[10px] text-[#5F5F5F]">
                      It will help your friends find you.
                    </p>
                    <FormControl>
                      <Input
                        className="bg-white text-sm placeholder:text-[#5F5F5F] text-[#5F5F5F] font-normal"
                        placeholder="Enter Email Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" flex items-center gap-1 text-[#2C2D32] font-medium ">
                      <span className="text-xs">Bio</span>
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        className="resize-none bg-white min-h-[80px] placeholder:text-[#5F5F5F] text-[#5F5F5F] text-sm leading-[15px]"
                        placeholder="Enter Bio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                className="bg-[#2C2D32] text-white w-full px-4 py-[18px] rounded-[5px] disabled:cursor-not-allowed disabled:bg-gray-600"
                disabled={updatingProfile}
              >
                {updatingProfile ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
