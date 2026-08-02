import React, { useEffect, useState } from 'react'
import { useLangStore } from '../assets/store/langStore';
import { langText, toArabicNumbers } from '../assets/constants/lang';
import { useQuery } from '@tanstack/react-query';
import { GetReviews } from '../assets/apis/review/ReviewApi';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GetAllProducts } from '../assets/apis/product/PeoductApi';
import { useCartStore } from '../assets/store/cartStore';
import { onlineOrderToast } from '../assets/Helpers/onlineOrderToast';
import useAuthStore from '../assets/store/authStore';

function Reviews() {
  const { lang } = useLangStore();
  const user = useAuthStore((state) => state.user);

  const [reviewsToShow, setReviewsToShow] = useState(5);
  const [reviewIdShow, setReviewIdShow] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const { setCart } = useCartStore();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: GetReviews,
    select: (data) =>
      [...data].sort(
        (a, b) => new Date(b.orderReviewDate) - new Date(a.orderReviewDate)
      ),
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: GetAllProducts,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 5,

  })
  useEffect(() => {
    if (items) {
      console.log("items", items);
      // Example: items = [{ mainGroup: [...] }, { mainGroup: [...] }, ...]
      const allFoodItems = (items ?? []).flatMap(grand =>
        (grand.mainGroup ?? []).flatMap(group => group.itemDatas ?? [])
      );

      setAllProducts(allFoodItems);
      console.log("allFoodItems", allFoodItems);

    }
  }, [items])

  useEffect(() => {
    console.log("reviewsData", reviewsData);

  }, [reviewsData]);

  function handleRate(rate) {
    if (lang == "EN") {

      if (rate === 5) {
        return "😁 Amazing";
      } else if (rate >= 4) {
        return "😊 Good";
      } else if (rate >= 3) {
        return "😐 Ok";
      } else if (rate >= 2) {
        return "😒 Bad";
      } else if (rate >= 1) {
        return "😡 Terrible";
      } else {
        return "😁 Amazing";
      }
    }
    else {
      if (rate === 5) {
        return "😁 جيد جدا";
      } else if (rate >= 4) {
        return "😊 جيد";
      } else if (rate >= 3) {
        return "😐 متوسط";
      } else if (rate >= 2) {
        return "😒 سيئ";
      } else if (rate >= 1) {
        return "😡 سيئ جدا";
      } else {
        return "😁 جيد جدا";
      }
    }
  }

  function formatDate(date) {
    if (!date) return "";

    const d = date instanceof Date ? date : new Date(date);

    return d.toLocaleDateString(
      lang === "AR" ? "ar-EG" : "en-GB",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  function handleOrderAgain(details) {
    console.log("details", details);

    const newOrder = details.map((detail) => {
      const product = allProducts.find(
        p => p.FoodMenuItemId === detail.orderDetailsItemId
      );

      if (!product) return null;

      return {
        ...product,
        quantity: detail.orderDetailsQty,
        cartItemId: detail.orderDetailsId || `${product.FoodMenuItemId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        FoodMenuItemAdds: detail?.orderDetailsAddons?.map(addon => ({
          FoodMenuItemMultyAddsAddId: addon.foodMenuItemAddsId,
          FoodMenuItemAddsName: addon.foodMenuItemAddsName,
          FoodMenuItemAddsPriceEgp: addon.foodMenuItemAddsPriceEgp,
        })) || []
      };
    }).filter(Boolean);

    setCart(newOrder);
    navigate("/cart");
  }

  return (
    <div className='lg:pe-2'>
      <p className='mb-2 text-lg text-[#262626] font-semibold'>{langText.reviews[lang]}</p>
      <div className="flex flex-col gap-2 mt-2">
        {
          reviewsData?.slice(0, reviewsToShow)?.map((review, index) => (

            <div className='bg-[#f5f5f5] p-4 border-[#00000020] border rounded-xs'>
              <div className="flex items-center justify-between text-[#6b6b6b] grid gap-5 grid-cols-[100px_1fr_auto] ">
                {/* <div className="flex items-center gap-20 text-sm"> */}
                <p>{handleRate(review?.orderReviewNumber)}</p>
                <p>{review?.orderReviewUserFirstName}</p>
                {/* </div> */}
                <p className='text-xs'>{formatDate(review?.orderReviewDate)}</p>
              </div>
              <div className="flex items-center gap-5 mt-2">

                <p className="lg:mt-4 mt-3 text-[#262626] text-sm flex-1">{review?.orderReviewText}</p>
                <div onClick={() => {
                  console.log("hi");
                  console.log("reviewIdShow", reviewIdShow);


                  if (reviewIdShow == review?.orderReviewId) {
                    setReviewIdShow(null)
                  } else {
                    setReviewIdShow(review?.orderReviewId)
                  }
                }} className="cursor-pointer">

                  {review?._FoodDataOrderDetailReview?.length > 0 && <FaChevronDown className={`text-[#49494A] transition  text-lg ${reviewIdShow == review?.orderReviewId ? "rotate-180" : ""}`} />}
                </div>
              </div>
              <div className={`${reviewIdShow == review?.orderReviewId ? "h-auto" : "h-0"} overflow-hidden transition-all duration-700`}>
                <div className="h-0.5 my-5 bg-primary w-full"></div>
                <div className="">


                  {review?._FoodDataOrderDetailReview?.length > 0 && review?._FoodDataOrderDetailReview?.map((item, index) => (
                    <div
                      key={item.orderDetailsId}
                      className="py-4 grid grid-cols-[64px_1fr] md:grid-cols-[64px_1fr] gap-4 md:items-center"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item?.orderDetailsItemImg || "/img/food/food.png"}
                          alt={item.orderDetailsName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-semibold text-gray-800">
                            {lang == "EN" ? item.orderDetailsName : item.orderDetailsNameAr ? item.orderDetailsNameAr : item.orderDetailsName}
                          </h4>
                          <span className="text-xs px-2 py-0.5 bg-[#f5f5f5] rounded-full text-gray-600">
                            x{lang == "EN" ? item.orderDetailsQty : toArabicNumbers(item.orderDetailsQty)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{/* space for description if any */}</p>


                        {item?.orderDetailsAddons?.length > 0 && (

                          <div className="mt-2 md:flex hidden items-center gap-3">
                            <span className="text-xs text-gray-500 text-nowrap">{langText.addOns[lang]}</span>
                            <span className="text-sm font-medium">{item?.orderDetailsAddons?.map((addon) => `${lang == "EN" ? addon?.foodMenuItemAddsName : addon?.foodMenuItemAddsNameAr ? addon?.foodMenuItemAddsNameAr : addon?.foodMenuItemAddsName_Ar}`).join(" + ")}</span>
                          </div>
                        )}

                      </div>
                      {item?.orderDetailsAddons?.length > 0 && (

                        <div className="col-span-2 md:hidden flex items-center gap-3">
                          {/* <span className="text-xs text-gray-500 text-nowrap">{langText.addOns[lang]}</span> */}
                          <span className="text-xs font-medium"><span className="text-xs text-gray-500 text-nowrap">{langText.addOns[lang]}</span>{item?.orderDetailsAddons?.map((addon) => addon?.foodMenuItemAddsName).join(" , ")}</span>

                        </div>
                      )}



                    </div>
                  ))}


                </div>
                <div className="w-full flex items-center justify-end mt-5">

                  <button className='cursor-pointer mt-4 px-4 py-2 rounded-full border border-primary text-primary text-sm bg-white hover:bg-primary hover:text-white transition' onClick={() => {
                    if (!user) {
                      onlineOrderToast.error(langText.pleaseLoginFirst[lang]);
                      navigate("/login");
                      return;
                    }
                    handleOrderAgain(review?._FoodDataOrderDetailReview)
                  }}> {langText.orderTheSame[lang]}</button>
                </div>
              </div>
            </div>
          ))
        }
        {reviewsToShow < reviewsData?.length && reviewsData?.length > 5 &&
          <button onClick={() => { setReviewsToShow((prev) => prev + 5) }} className='cursor-pointer bg-[#f5f5f5] p-4 border-[#00000020] border rounded-xs'>
            <p className='text-primary text-sm' >{langText.readMore[lang]}</p>
          </button>
        }
      </div>
    </div>
  )
}

export default Reviews
