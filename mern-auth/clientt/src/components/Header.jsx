import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center'>
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6'/>
      <h1 
      
      className=' flex items-center gap-2text-xl sm:text-3xl font-medium mb-2'>Hello my future Hr. <img className='w-8a aspect-square' src={assets.hand_wave} alt="" />
      </h1>


      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to my JWT Authentication System web app!</h2>

      <p className='mb-8 sm:text-2xl flex justify-center text-center"'>This project is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that demonstrates a secure user authentication flow using JWT (JSON Web Tokens). It includes a modern React frontend styled with Tailwind CSS and handles routing using React Router DOM. On the backend, I’ve used Express and Node.js to build APIs, with MongoDB Atlas for storing user data. The app includes features like user registration, login, protected routes, persistent sessions using cookies, and role-based access. I’ve also implemented environment-based security practices and error handling. This project highlights my understanding of full-stack architecture, secure authentication, and responsive frontend design. It’s a great showcase of my current skills as I work towards becoming a professional MERN stack developer.</p>

      <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'> Get Started</button>

    </div>
  )
}

export default Header
