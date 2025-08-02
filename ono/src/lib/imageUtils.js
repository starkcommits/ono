export function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
  })
}
