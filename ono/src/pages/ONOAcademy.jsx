import Back from '@/assets/Back.svg'
import Lesson1 from '@/assets/Lesson1.svg'
import Lesson2 from '@/assets/Lesson2.svg'
import Lesson3 from '@/assets/Lesson3.svg'
import Lesson4 from '@/assets/Lesson4.svg'
import Lesson5 from '@/assets/Lesson5.svg'

import { useNavigate } from 'react-router-dom'

const lessons = [
  {
    image: Lesson1,
    module: 'Module 1',
    chapter: 'Chapter 1',
    title: 'Concept of ONO',
  },
  {
    image: Lesson2,
    module: 'Module 1',
    chapter: 'Chapter 2',
    title: 'What is an Event?',
  },
  {
    image: Lesson3,
    module: 'Module 1',
    chapter: 'Chapter 3',
    title: 'Exit and Cancel Feature',
  },
  {
    image: Lesson4,
    module: 'Module 1',
    chapter: 'Chapter 4',
    title: 'Categories, Topics and Portfolio',
  },
  {
    image: Lesson5,
    module: 'Module 1',
    chapter: 'Chapter 5',
    title: 'Why choose ONO?',
  },
  //   {
  //     tag: 'ONO Journey',
  //     module: 'Module 2',
  //     chapter: 'Chapter 1',
  //     title: 'Start your ONO Journey',
  //   },
  //   {
  //     tag: 'Event',
  //     module: 'Module 2',
  //     chapter: 'Chapter 2',
  //     title: 'Dissecting an Event',
  //   },
  //   {
  //     tag: 'Research',
  //     module: 'Module 2',
  //     chapter: 'Chapter 3',
  //     title: 'How to Research Properly',
  //   },
  //   {
  //     tag: 'Portfolio',
  //     module: 'Module 2',
  //     chapter: 'Chapter 4',
  //     title: 'Diversify your Portfolio',
  //   },
  //   {
  //     tag: 'Exit Strategies',
  //     module: 'Module 2',
  //     chapter: 'Chapter 5',
  //     title: 'Learn about Exit Feature',
  //   },
  //   {
  //     tag: 'ONO Player',
  //     module: 'Module 2',
  //     chapter: 'Chapter 6',
  //     title: 'DO’s and Don’ts of ONO',
  //   },
  //   {
  //     tag: 'ONO',
  //     module: 'Module 2',
  //     chapter: 'Chapter 7',
  //     title: 'Evolution fo a ONO Player',
  //   },
]
const ONOAcademy = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col select-none">
      <div className="h-12 sticky top-0 select-none w-full p-4 border-b flex items-center gap-[13px] border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
        <div className="flex items-center gap-3">
          <img
            src={Back}
            alt=""
            className="cursor-pointer h-4 w-4"
            onClick={() => {
              navigate(-1)
            }}
          />
        </div>
        <div>
          <p className="text-xl text-[#2C2D32] font-medium leading-normal">
            ONO Academy
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {lessons?.map((lesson) => (
          <div className="flex items-center gap-4 bg-white">
            <div>
              <img src={lesson.image} alt="" />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-normal leading-normal text-[#5F5F5F] flex items-center gap-1.5">
                <span>{lesson.module}</span>
                <span>|</span>
                <span>{lesson.chapter}</span>
              </p>
              <p className="text-base leading-normal font-medium text-[#2C2D32]">
                {lesson.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ONOAcademy
