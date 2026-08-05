import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaTimes, FaLock, FaHeart } from "react-icons/fa";
import { onlineOrderToast } from "../assets/Helpers/onlineOrderToast";
import { langText } from "../assets/constants/lang";

function ProductDetailsModal({
  onClose,
  item,
  priceInfo,
  user,
  lang,
  addToCart,
  navigate,
  selectedOrder,
  queryClient,
  UpdataDetailsMutation,
  orderDetails,
  isDeparture,
  isArrival,
  addFavouriteMutation,
  removeFavouriteMutation,
  favouritedItems,
  onToggleFavourite,
}) {
  console.log("priceInfo", priceInfo);

  const [quantity, setQuantity] = useState(1);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const totalPrice = priceInfo.price * quantity;

  const handleAddToCart = () => {
    if (!user) {
      onlineOrderToast.error(langText.pleaseLoginFirst?.[lang]);
      navigate("/login");
      onClose();
      return;
    }
    if (!selectedOrder) {
      onlineOrderToast.error(langText.pleaseSelectOrderOrCreateANewOne?.[lang]);
      onClose();
      return;
    }

    const addedQty = +quantity || 1;
    const existingDetails = orderDetails?.[0]?.details || [];
    const itemId = item?.ItemID || item?.itemID;

    // Search for an existing item with the same itemId AND same arrival/departure flags
    const existingItem = existingDetails.find(
      (d) =>
        d.orderDetailsItemId === itemId &&
        d.orderDetailsIsArrival === isArrival &&
        d.orderDetailsIsDepartur === isDeparture
    );

    let data;

    if (existingItem) {
      // Item found: update qty in-place, keep all other properties intact
      const newQty = existingItem.orderDetailsQty + addedQty;
      data = existingDetails.map((d) => {
        if (
          d.orderDetailsItemId === itemId &&
          d.orderDetailsIsArrival === isArrival &&
          d.orderDetailsIsDepartur === isDeparture
        ) {
          return {
            ...d,
            OrderDetailsHeaderId: selectedOrder?.orderHeaderId,
            orderDetailsQty: newQty,
            orderDetailsPrintedQty: newQty,
          };
        }
        return {
          ...d,
          OrderDetailsHeaderId: selectedOrder?.orderHeaderId,
        };
      });
    } else {
      // Item not found: map existing items then append new one
      const items = existingDetails.map((d) => ({
        ...d,
        OrderDetailsHeaderId: selectedOrder?.orderHeaderId,
      }));

      data = [
        ...items,
        {
          orderDetailsId: 0,
          OrderDetailsHeaderId: selectedOrder?.orderHeaderId,
          orderDetailsName: item?.ItemName || item?.itemName,
          orderDetailsItemId: itemId,
          orderDetailsPackingId: 1,
          orderDetailsReplaceItem: false,
          orderDetailsSalesComment: "",
          orderDetailsQty: addedQty,
          orderDetailsPrintedQty: addedQty,
          orderDetailsKitchineReply: "",
          OrderDetailsPcking: "Standard Packing",
          orderDetailsIsArrival: isArrival,
          orderDetailsIsDepartur: isDeparture,
          orderDetailsDescription: item?.itemDescription,
          OrderDetailsCurrencyPrice: Number(item?.itemPriceUSD),
          OrderDetailsUnitName: item?.ItemMegurment || item?.itemMegurment,
        },
      ];
    }

    console.log("data", data);

    UpdataDetailsMutation.mutate(data, {
      onSuccess: () => {
        onlineOrderToast.success(langText.itemAddedSuccessfully?.[lang], { id: "1" });
        queryClient.invalidateQueries({
          queryKey: ["order-details", selectedOrder?.orderHeaderId],
        });
        queryClient.invalidateQueries({
          queryKey: ['myOrders'],
        });
        queryClient.invalidateQueries({
          queryKey: ['orderDetails', selectedOrder?.orderHeaderId],
        });
      },
      onError: (error) => {
        console.log("error", error);
        onlineOrderToast.error(langText.failedToAddItem?.[lang], {
          id: "1",
        });
      },
      onMutate: () => {
        onlineOrderToast.loading(langText.addingItem?.[lang], { id: "1" });
      }
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-gray-800 hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer"
          aria-label="Close details"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Favourite button — only for logged-in users */}
        {user && (
          <button
            onClick={(e) => onToggleFavourite(e, item)}
            className={`absolute top-4 right-16 z-20 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer ${
              favouritedItems?.[item?.itemID || item?.ItemID]
                ? "bg-red-50 text-red-500 border border-red-200"
                : "bg-white/85 text-gray-400 hover:bg-red-50 hover:text-red-400 hover:border hover:border-red-200"
            }`}
            aria-label="Add to favourites"
            title={lang === "EN" ? "Add to favourites" : "أضف إلى المفضلة"}
          >
            <FaHeart className="text-base" />
          </button>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Details */}
          <div className="px-6 pt-10 pb-6 flex flex-col gap-4">
            <div className="pr-12">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                {item?.itemName}
              </h2>
              {item?.itemMegurment && (
                <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md mt-2">
                  {item?.itemMegurment}
                </span>
              )}
            </div>

            {/* Price Tag Info */}
            <div className="flex items-center justify-between border-y border-gray-100 py-3 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  {lang === "EN" ? "Price / Station" : "السعر / المحطة"}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {priceInfo.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-800">
                  ${user ? priceInfo.price.toFixed(2) : <FaLock className="text-base sm:text-lg inline ml-2" />}
                </span>

              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                {lang === "EN" ? "Description" : "الوصف"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                {item?.itemDescription || (lang === "EN" ? "No description available." : "لا يوجد وصف متاح.")}
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-white/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/50">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 hover:shadow-sm active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
              aria-label="Decrease quantity"
            >
              <FaMinus className="text-xs" />
            </button>
            <span className="text-base font-semibold text-slate-800 w-6 text-center select-none">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
              aria-label="Increase quantity"
            >
              <FaPlus className="text-xs" />
            </button>
          </div>

          {/* Total & Add to Cart button */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {user && <div className="text-right sm:block">
              <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">
                {lang === "EN" ? "Total Price" : "السعر الإجمالي"}
              </span>
              <span className="text-xl font-bold text-slate-800">
                ${user ? totalPrice.toFixed(2) : <FaLock className="text-base sm:text-lg inline ml-2" />}
              </span>
            </div>}

            <button
              onClick={handleAddToCart}
              className="bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-opacity-95 active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer min-w-[140px]"
            >
              <span className="text-sm">
                {lang === "EN" ? "Add To Order" : "أضف إلى الطلب"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export default ProductDetailsModal;



// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { motion } from "framer-motion";
// import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
// import { onlineOrderToast } from "../assets/Helpers/onlineOrderToast";
// import { langText } from "../assets/constants/lang";

// function ProductDetailsModal({
//   onClose,
//   item,
//   priceInfo,
//   user,
//   lang,
//   addToCart,
//   navigate,
// }) {
//   const [quantity, setQuantity] = useState(1);

//   // ESC key to close
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [onClose]);

//   // Lock body scroll when open
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   const handleDecrease = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//     }
//   };

//   const handleIncrease = () => {
//     setQuantity((prev) => prev + 1);
//   };

//   const totalPrice = priceInfo.price * quantity;

//   const handleAddToCart = () => {
//     if (!user) {
//       onlineOrderToast.error(langText.pleaseLoginFirst?.[lang]);
//       navigate("/login");
//       onClose();
//       return;
//     }
//     addToCart({ ...item, quantity, FoodMenuItemPrice: priceInfo.price });
//     onClose();
//   };

//   return createPortal(
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop overlay */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.2 }}
//         onClick={onClose}
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//       />

//       {/* Modal card */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
//         className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-10"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-gray-800 hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer"
//           aria-label="Close details"
//         >
//           <FaTimes className="text-lg" />
//         </button>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto">
//           {/* Food Image */}
//           <div className="relative w-full h-64 bg-gray-100">
//             <img
//               src="/images/food.jpg"
//               alt={item?.ItemName}
//               className="w-full h-full object-cover object-center"
//             />
//             <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
//           </div>

//           {/* Details */}
//           <div className="px-6 pb-6 -mt-6 relative z-10 flex flex-col gap-4">
//             <div>
//               <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
//                 {item?.ItemName}
//               </h2>
//               {item?.ItemMegurment && (
//                 <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md mt-2">
//                   {item?.ItemMegurment}
//                 </span>
//               )}
//             </div>

//             {/* Price Tag Info */}
//             <div className="flex items-center justify-between border-y border-gray-100 py-3 mt-2">
//               <div className="flex flex-col">
//                 <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
//                   {lang === "EN" ? "Price / Station" : "السعر / المحطة"}
//                 </span>
//                 <span className="text-sm font-semibold text-slate-700">
//                   {priceInfo.label}
//                 </span>
//               </div>
//               <div className="text-right">
//                 <span className="text-2xl font-bold text-slate-800">
//                   ${priceInfo.price.toFixed(2)}
//                 </span>
//                 <span className="text-[10px] text-gray-400 font-medium block">
//                   USD
//                 </span>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="flex flex-col gap-2">
//               <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
//                 {lang === "EN" ? "Description" : "الوصف"}
//               </h3>
//               <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
//                 {item?.itemDescription || (lang === "EN" ? "No description available." : "لا يوجد وصف متاح.")}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Sticky Footer */}
//         <div className="border-t border-gray-100 px-6 py-4 bg-white/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
//           {/* Quantity Selector */}
//           <div className="flex items-center gap-4 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/50">
//             <button
//               onClick={handleDecrease}
//               disabled={quantity <= 1}
//               className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 hover:shadow-sm active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
//               aria-label="Decrease quantity"
//             >
//               <FaMinus className="text-xs" />
//             </button>
//             <span className="text-base font-semibold text-slate-800 w-6 text-center select-none">
//               {quantity}
//             </span>
//             <button
//               onClick={handleIncrease}
//               className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
//               aria-label="Increase quantity"
//             >
//               <FaPlus className="text-xs" />
//             </button>
//           </div>

//           {/* Total & Add to Cart button */}
//           <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
//             <div className="text-right sm:block">
//               <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">
//                 {lang === "EN" ? "Total Price" : "السعر الإجمالي"}
//               </span>
//               <span className="text-xl font-bold text-slate-800">
//                 ${totalPrice.toFixed(2)}
//               </span>
//             </div>

//             <button
//               onClick={handleAddToCart}
//               className="bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-opacity-95 active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer min-w-[140px]"
//             >
//               <span className="text-sm">
//                 {lang === "EN" ? "Add To Cart" : "أضف إلى السلة"}
//               </span>
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>,
//     document.body
//   );
// }

// export default ProductDetailsModal;
