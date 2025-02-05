import React from 'react'
import { construction } from '../../assets/constant'
const UndeProcessing = () => {
  return (
    <>
    <div className='custom-container flex justify-center flex-col items-center'>
     <div>
     <img src={construction} alt="" />
     </div>
      <div>
      <h1 className='text-[#E28B44] md:text-5xl text-xl font-bold text-center leading-5'>We Are Under Maintenance...</h1>
      <h1 className='md:text-3xl font-semibold text-center my-5 text-lg leading-3 text-[#5CC3CD]'>We Will be Soon</h1>
      </div>
    </div>
    </>
  )
}
export default UndeProcessing