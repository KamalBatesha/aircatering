import React, { useState } from 'react'
import Reviews from '../../../components/Reviews';
import { IoIosChatbubbles } from 'react-icons/io';
import { FaInfoCircle } from 'react-icons/fa';
import { langText } from '../../../assets/constants/lang';
import { useLangStore } from '../../../assets/store/langStore';
import Info from '../../../components/Info';
import { useNavigate } from 'react-router-dom';

function SkyInfo() {
          const [selectedBar, setSelectedBar] =useState(0);
          const {lang}=useLangStore();
          const navigate =useNavigate();
    
  return (
    <div className='container mx-auto px-8 py-3 flex flex-col justify-between h-full'>
        <div className="mb-24">

            <div className="w-full lg:pe-40 mt-0 border-0 border-[#E5E5E5] border-b mb-5">
                <div className="flex w-full items-end">
                    <button onClick={()=>{setSelectedBar(0)}} className={`flex-1 pb-3 relative flex items-center justify-center gap-2 cursor-pointer after:w-full after:z-10 after:h-1 after:rounded-full after:absolute after:-bottom-1 after:bg-primary after:transition  ${selectedBar===0?'after:opacity-100':'after:opacity-0'}`}>
                        <IoIosChatbubbles className='md:text-3xl text-xl text-primary' />
                        <p>{langText.reviews[lang]}</p>
                    </button>
                    <button onClick={()=>{setSelectedBar(1)}} className={`flex-1 pb-3 relative flex items-center justify-center gap-2 cursor-pointer after:w-full after:z-10 after:h-1 after:rounded-full after:absolute after:-bottom-1 after:bg-primary after:transition  ${selectedBar===1?'after:opacity-100':'after:opacity-0'}`}>
                        <FaInfoCircle className='md:text-3xl text-xl text-primary' />
                        <p>{langText.info[lang]}</p>
                    </button>
                </div>
            </div>
            {selectedBar === 0 && <Reviews />}
          {selectedBar === 1 && <Info />}
        </div>
        <div className="fixed bottom-0 w-full px-9 py-6 left-0 right-0 z-20 shadow-lg bg-white">
            <button onClick={()=>{navigate(-1)}} className='rounded-full border bg-primary text-white text-center w-full py-3'>{langText.goBack[lang]}</button>
        </div>
      
    </div>
  )
}

export default SkyInfo
