import React from 'react'
import { FaPlus, FaMinus } from "react-icons/fa";
import PriceFormatter, { langText, toArabicNumbers } from '../../assets/constants/lang';
import { useLangStore } from '../../assets/store/langStore';
import { FaRegTrashAlt } from "react-icons/fa";

import { RiEdit2Line } from "react-icons/ri";
import { IoClose } from 'react-icons/io5';
import { useProductStore } from '../../assets/store/productStore';
function CartItem({ item, addOne, minusOne, setCart, cart, lang, setselectedAddsItem, setEditedItem, editedItem, selectedAddsItem, removeFromCart }) {
  const { product } = useProductStore();
  return (
    <div className="py-4 border-0 border-b border-b-light-gray">

      <div className=" flex gap-3">
        <div className="flex flex-col gap-2 flex-1 justify-between">
          <div>
            <h3 className="font-medium text-lg">
              {lang === "EN"
                ? item?.FoodMenuItemName
                : item?.FoodMenuItemNameAr
                  ? item?.FoodMenuItemNameAr
                  : item?.FoodMenuItemName}
            </h3>
            <div className="flex items-center justify-between py-3">
              <FaRegTrashAlt onClick={() => removeFromCart(item?.cartItemId)} className="text-red-400 cursor-pointer" />


              <RiEdit2Line
                className="text-primary cursor-pointer"
                onClick={() => {
                  if (!product?.length) return;
                  setEditedItem(item);
                  setselectedAddsItem(
                    product.find(productItem => productItem.FoodMenuItemId === item.FoodMenuItemId)
                  );
                }}

              />
            </div>
          </div>

          <p className="text-gray-800 font-semibold">
            {lang == "EN" ? PriceFormatter(item?.quantity * (item?.FoodMenuItemPrice + (item?.FoodMenuItemAdds?.reduce((acc, curr) => acc + curr?.FoodMenuItemAddsPriceEgp, 0) || 0) + (item?.selectedSubItems?.reduce((acc, curr) => acc + curr?.FoodMenuItemPrice, 0) || 0))) : PriceFormatter(toArabicNumbers(item?.quantity * (item?.FoodMenuItemPrice + (item?.FoodMenuItemAdds?.reduce((acc, curr) => acc + curr?.FoodMenuItemAddsPriceEgp, 0) || 0) + (item?.selectedSubItems?.reduce((acc, curr) => acc + curr?.FoodMenuItemPrice, 0) || 0))))} {langText.EGP[lang]}
          </p>
          {/* <p className="text-gray-800 font-semibold">{langText.EGP[lang]} {item?.quantity*(item?.FoodMenuItemPrice+item?.FoodMenuItemAdds?.reduce((acc,curr)=>acc+curr?.FoodMenuItemAddsPriceEgp,0))}</p> */}
        </div>

        <div className="w-2/5 aspect-square rounded-xl overflow-hidden shrink-0 relative">
          <img
            src={item?.FoodMenuItemImg || "/img/food/food.png"}
            className="w-full h-full object-cover object-center"
            alt=""
          />
          <div className="w-4/5 p-2 bg-white rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center justify-between">
            <div className="w-5 h-5 flex cursor-pointer items-center justify-center bg-primary rounded-full">
              <FaMinus onClick={minusOne} className="text-white text-sm" />
            </div>
            <span className="text-secondary font-semibold">{lang == "EN" ? item?.quantity : toArabicNumbers(item?.quantity)}</span>
            <div className="w-5 h-5 flex cursor-pointer items-center justify-center bg-primary rounded-full">
              <FaPlus onClick={addOne} className="text-white text-sm" />
            </div>
          </div>
        </div>
      </div>
      {item?.FoodMenuItemAdds?.length > 0 && (

        <div className="flex justify-end gap-2 mt-4 flex-wrap">
          {item?.FoodMenuItemAdds?.map((add) => (

            <div className="bg-light-gray rounded-full px-2 py-1 flex items-center justify-center">
              <span className="text-sm">
                {lang === "EN"
                  ? add?.FoodMenuItemAddsName
                  : add?.FoodMenuItemAddsNameAr
                    ? add?.FoodMenuItemAddsNameAr
                    : add?.FoodMenuItemAddsName}
                {" +  "}
                {lang == "EN" ? add?.FoodMenuItemAddsPriceEgp : toArabicNumbers(add?.FoodMenuItemAddsPriceEgp)} {langText.EGP[lang]} {item?.quantity > 1 && ` x ${lang == "EN" ? item?.quantity : toArabicNumbers(item?.quantity)}`}
              </span>
              <IoClose onClick={() => {
                const updatedAdds = item?.FoodMenuItemAdds?.filter(a => a.FoodMenuItemMultyAddsAddId !== add.FoodMenuItemMultyAddsAddId);
                const updatedItem = { ...item, FoodMenuItemAdds: updatedAdds };
                const updatedCart = cart.map(cartItem => cartItem.cartItemId === item.cartItemId ? updatedItem : cartItem);
                setCart(updatedCart);
              }} className="ms-2 cursor-pointer text-sm text-red-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CartItem
