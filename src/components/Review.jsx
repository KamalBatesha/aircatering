import React, { useState, useEffect } from "react";
import { useLangStore } from "../assets/store/langStore";
import { langText, toArabicNumbers } from "../assets/constants/lang";
import useReviewMutation from "../assets/apis/review/ReviewMutation";
import { onlineOrderToast } from "../assets/Helpers/onlineOrderToast";
import { GetAllProducts } from "../assets/apis/product/PeoductApi";
import { useQuery } from "@tanstack/react-query";

/* Review modal — React + Tailwind
   Fixes:
   - Applies CSS vars on the overlay so all children can read them.
   - Replaces fragile Tailwind arbitrary color utilities with inline style usage
     for color-sensitive properties (text color, border color, background color).
   - Adds max-height + overflow for the modal to avoid layout overflow on small screens.
   - Keeps original functionality (show items, star rating, comment, submit).
*/

function Star({ filled, index, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      type="button"
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-transform transform hover:scale-110 focus:outline-none"
      aria-label={`Rate ${index} star`}
      onClick={() => onClick(index)}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={onMouseLeave}
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill={filled ? "#B88E52" : "none"}
        stroke={filled ? "#B88E52" : "#6b6b6b"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </button>
  );
}

export default function Review({
  order,
  onSubmit,
  onClose, // optional: close handler (recommended for modal)
}) {
  console.log("order", order);
  const { lang } = useLangStore();

  const items = order?.details
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const maxChars = 300;
  const remaining = maxChars - comment.length;
  const [submitting, setSubmitting] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const MAX_VISIBLE_ITEMS = 2;

  // close on ESC if onClose provided
  useEffect(() => {

    function onKey(e) {
      if (e.key === "Escape" && onClose) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleStarClick(value) {
    setRating(value);
  }
  function handleStarEnter(value) {
    setHover(value);
  }
  function handleStarLeave() {
    setHover(0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (comment.length > maxChars) return;
    setSubmitting(true);
    const payload = {
      orderReviewId: 0,
      orderReviewDate: new Date().toISOString(),
      orderReviewText: comment,
      orderReviewHeaderId: order?.header?.orderHeaderId,
      orderReviewNumber: rating
    };
    console.log("payload", payload);

    try {
      ReviewMutation.mutate(payload, {
        onSuccess: () => {
          onlineOrderToast.success(langText.ReviewAddedSuccessfully[lang]);
          ReviewedMutation.mutate(order?.header?.orderHeaderId);

          setSubmitting(false);
          onClose();
        },
        onError: () => {
          onlineOrderToast.error(langText.SomethingWentWrongPleaseTryAgainLater[lang]);
          setSubmitting(false);
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  const { ReviewMutation, ReviewedMutation } = useReviewMutation();

  // CSS variable values applied at the overlay root so inline styles and SVG can read them.
  //   const colorVars = {
  //     "--color-primary": "#B88E52",
  //     "--color-secondary": "#49494A",
  //     "--color-gray": "#6b6b6b",
  //     "--color-light-gray": "#E5E5E5",
  //   };
  function formatArrival(date) {
    if (!date) return "";

    const d = date instanceof Date ? date : new Date(date);

    return d.toLocaleDateString(
      lang === "AR" ? "ar-EG" : "en-GB",
      {
        month: "short",
        day: "numeric",
      }
    );
  }
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    }
  }, [])


  const [allProducts, setAllProducts] = useState([]);

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: GetAllProducts,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 5,

  })
  useEffect(() => {
    if (itemsData) {
      console.log("itemsData", itemsData);
      // Example: itemsData = [{ mainGroup: [...] }, { mainGroup: [...] }, ...]
      const allFoodItems = (itemsData ?? []).flatMap(grand =>
        (grand.mainGroup ?? []).flatMap(group => group.itemDatas ?? [])
      );

      setAllProducts(allFoodItems);
      console.log("allFoodItems", allFoodItems);

    }
  }, [itemsData])

  function handleOrderAgain(details) {
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
    // overlay: variables applied here
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        // close on backdrop click if onClose provided
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-3xl"
        style={{ maxHeight: "90vh", overflow: "auto" }}
      >
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Items list */}
          <div>
            <div className="text-sm font-medium mb-2 text-secondary">
              {langText.orderItems[lang]} ({items.length})
            </div>

            <div className="space-y-2">
              {(showAllItems ? items : items.slice(0, MAX_VISIBLE_ITEMS)).map((it) => (
                <div
                  key={it?.orderDetailsItemId}
                  className="flex items-center gap-3 p-2 rounded-xl border text-light-gray"

                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-light-gray">
                    <img src={it?.orderDetailsItemImg || "/img/food/food.png"} alt={it?.orderDetailsName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate text-secondary">
                      {lang === "EN" ? it?.orderDetailsName : it?.orderDetailsNameAr ? it?.orderDetailsNameAr : it?.orderDetailsName}
                    </div>
                    <div className="text-xs truncate text-gray">
                      {lang === "EN" ? it?.orderDetailsDescription : it?.orderDetailsDescriptionAr ? it?.orderDetailsDescriptionAr : it?.orderDetailsDescription}
                    </div>
                    <div className="text-xs truncate text-primary">
                      {it?.orderDetailsAddons?.map((addon) => lang == "EN" ? addon?.foodMenuItemAddsName : addon?.foodMenuItemAddsName_Ar ? addon?.foodMenuItemAddsName_Ar : addon?.foodMenuItemAddsName).join(" + ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length > MAX_VISIBLE_ITEMS && (
              <button
                type="button"
                onClick={() => setShowAllItems((v) => !v)}
                className="mt-2 text-sm font-medium text-primary"
              >
                {showAllItems ? "Show fewer items" : `Show ${items.length - MAX_VISIBLE_ITEMS} more item${items.length - MAX_VISIBLE_ITEMS > 1 ? "s" : ""}`}
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t bg-light-gray" />

          {/* Review header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold text-secondary">
                {langText?.howWasYourOrder[lang]}
              </div>
              <div className="text-sm mt-1 text-gray">
                {lang == "EN" ?
                  items.length
                  :
                  toArabicNumbers(items.length)
                }
                {langText?.items[lang]} • {langText?.pleaseRateYourOverallExperience[lang]}
              </div>
            </div>

            <div className="text-xs text-gray" >
              {langText?.order[lang]} #{lang == "EN" ? order?.header?.orderHeaderId : toArabicNumbers(order?.header?.orderHeaderId)} • {formatArrival(order?.header?.orderHeaderDeliveryDateTime)}
            </div>
          </div>

          {/* Rating row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center rounded-lg px-3 py-2 bg-light-gray" >
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    index={i}
                    filled={i <= (hover || rating)}
                    onClick={handleStarClick}
                    onMouseEnter={handleStarEnter}
                    onMouseLeave={handleStarLeave}
                  />
                ))}
              </div>
              <div className="ml-3 text-sm font-medium text-secondary">
                {lang == "EN" ? `${rating}.0` : toArabicNumbers(`${rating}.0`)}
              </div>
            </div>

            <div className="text-sm text-gray text-nowrap">
              {langText?.tapAStarToRate[lang]}
            </div>
          </div>

          {/* Comment box */}
          <div>
            <label htmlFor="comment" className="sr-only">{langText?.writeAComment[lang]}</label>
            <textarea
              id="comment"
              maxLength={maxChars}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={langText?.shareYourExperienceTasteTemperatureDeliveryPackaging[lang]}
              className="w-full min-h-24 border-light-gray border text-secondary resize-none rounded-xl p-3 text-sm focus:outline-none"
            />

            <div className="mt-2 flex md:items-center md:justify-between flex-col md:flex-row gap-3">
              <div className="text-xs text-gray" >{lang == "EN" ? remaining : toArabicNumbers(remaining)} {langText?.charactersLeft[lang]}</div>
              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setComment(""); setRating(5); }}
                  className="text-sm px-3 py-1 rounded-lg border bg-light-gray text-secondary"

                >
                  {langText?.reset[lang]}
                </button>

                <button
                  type="button"
                  onClick={() => { onClose(order?.header?.orderHeaderId) }}
                  className="text-sm px-3 py-1 rounded-lg border bg-light-gray text-secondary"

                >
                  {langText?.close[lang]}
                </button>

                <button
                  type="submit"
                  disabled={submitting || comment.trim().length === 0}
                  className="inline-flex bg-primary items-center gap-2 disabled:opacity-50 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium"
                >
                  {submitting ? langText?.sending[lang] : langText?.sendReview[lang]}
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
