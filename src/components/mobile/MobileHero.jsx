import React, { useEffect, useState } from 'react'
import { langText, toArabicNumbers } from '../../assets/constants/lang'
import { useLangStore } from '../../assets/store/langStore';
import { IoIosArrowForward } from "react-icons/io";
import { TbClockHour3 } from "react-icons/tb";
import { FaMotorcycle } from "react-icons/fa6";
import { IoStar } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetReviews } from '../../assets/apis/review/ReviewApi';


function MobileHero() {
    const { lang } = useLangStore();
    const navigate = useNavigate();
    const [totlaReviewsScore, setTotalReviewsScore] = useState(0);
    const { data: reviewsData, isLoadin } = useQuery({
        queryKey: ["reviews"],
        queryFn: GetReviews,
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    useEffect(() => {
        if (reviewsData && reviewsData.length > 0) {
            setTotalReviewsScore((reviewsData.reduce((total, review) => total + review.orderReviewNumber, 0) / reviewsData.length)?.toFixed(1) ?? 0);
        }
    }, [reviewsData])

    return (
        <div className='h-65 relative'>
            <div className="h-5/8 bg-[url('/images/food.jpg')]  bg-cover bg-top relative after:absolute after:w-full after:h-full after:bg-[rgba(0,0,0,0.5)]"></div>
            <div className="h-3/8 bg-white"></div>
            <div className="absolute p-4 top-5/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg border border-light-gray rounded-xl w-4/5  bg-white">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-24">
                                <img src="images/logo.png" alt="skyculinaire logo" className='w-full' />
                            </div>
                            <div className={window?.location?.href?.toLowerCase()?.includes("stella") ? "h-8 w-px bg-gray-300" : "hidden"}></div>
                            <div className="w-9 ">

                                <img src="/images/REMCOLogo.png" className={`w-32 md:w-40 invert  ${window?.location?.href?.toLowerCase()?.includes("stella") ? "" : "hidden"}`} alt="logo" />
                            </div>
                        </div>
                        {/* <div className="flex flex-col gap-0.5">
                <h1 className='text-md'>{langText.SkyCulinaire[lang]}</h1>
                <p className="text-gray text-xs">{langText.skyAddresses[lang]}</p>
                <p className="text-gray text-xs">{langText.kindOfFood[lang]}</p>

            </div> */}
                    </div>

                    <button onClick={() => { navigate("/info") }} className={`cursor-pointer text-primary `}>
                        <IoIosArrowForward className='text-2xl' />
                    </button>


                </div>
                <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-1.5 text-sm">
                        <span><TbClockHour3 /></span>
                        <p>{langText.mins35502[lang]}</p>
                    </div>
                    {/* <div className="flex items-center gap-1.5 text-sm">
            <span><FaMotorcycle/></span>
            <p>{langText.EGP80[lang]}</p>
        </div> */}
                    <div className="flex items-center gap-1.5 text-sm">
                        <span className='text-yellow-500'><IoStar /></span>
                        <p>{lang == "EN" ? totlaReviewsScore : toArabicNumbers(totlaReviewsScore)} <span className="text-gray text-xs">({lang == "EN" ? (reviewsData?.length || 0) : toArabicNumbers((reviewsData?.length || 0))}+)</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileHero
