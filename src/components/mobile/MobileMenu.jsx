// MobileMenu.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { langText, toArabicNumbers } from "../../assets/constants/lang";
import useAuthStore from "../../assets/store/authStore";
import { useCartStore } from "../../assets/store/cartStore";
import { useLangStore } from "../../assets/store/langStore";
import useDraggableScroll from "../../hooks/useDraggableScroll";

function MobileMenu({ data, registerItemRef }) {
  const { lang } = useLangStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedAddsItem, setselectedAddsItem] = React.useState(null);

  return (
    <div className="py-5 px-5">
      {data?.map((grandGroup, idx) => (
        <div
          key={grandGroup?.FoodMenuGrandGroupId ?? idx}
          ref={(el) => registerItemRef(el, idx)} // مهم
          className="mt-5"
        >
          <h2 className="text-2xl font-semibold">
            {lang == "EN" ? grandGroup?.FoodMenuGrandGroupName : grandGroup?.FoodMenuGrandGroupNameAr || grandGroup?.FoodMenuGrandGroupName}
          </h2>
          {/* <p className='text-gray text-md mt-1'>{langText.trendingItemsWeThinkYoullLove[lang]}</p> */}

          <div className="grid grid-cols-2 gap-5 mt-4">
            {grandGroup?.mainGroup?.map((mainGroup, mIdx) =>
              mainGroup?.itemDatas?.map((item) => (
                <div id={`menu-item-${item.FoodMenuItemId}`} key={item.FoodMenuItemId}>
                  <div className="w-full h-35 rounded-3xl relative overflow-hidden">
                    <img
                      src={item?.FoodMenuItemImg || "/img/food/food.png"}
                      alt="food1"
                      className="w-full h-full object-cover "
                    />
                    <div
                      className={`absolute end-2 bottom-2 rounded-full bg-white w-11 h-11 border border-primary flex items-center justify-center text-primary cursor-pointer ${lang == "AR" && "rotate-180"} `}
                    >
                      {(item?.FoodMenuItemAddsCount > 0 || (item?.FoodMenuSubItems && item.FoodMenuSubItems.length > 0)) ? (
                        <IoIosArrowForward
                          className=" text-xl"
                          onClick={() => {
                            if (!user) {
                              onlineOrderToast.error(langText.pleaseLoginFirst[lang]);
                              navigate("/login");
                              return;
                            }

                            if (item?.FoodMenuItemAddsCount > 0 || (item?.FoodMenuSubItems && item.FoodMenuSubItems.length > 0)) {
                              setselectedAddsItem(item);
                              console.log("itemmmm", item);

                              return;
                            }
                            addToCart({ ...item, quantity: 1 });
                          }}
                        />
                      ) : (
                        <FaPlus
                          className=" text-xl"
                          onClick={() => {
                            if (!user) {
                              onlineOrderToast.error(langText.pleaseLoginFirst[lang]);
                              navigate("/login");
                              return;
                            }

                            if (item?.FoodMenuItemAddsCount > 0 || (item?.FoodMenuSubItems && item.FoodMenuSubItems.length > 0)) {
                              setselectedAddsItem(item);
                              console.log("itemmmm", item);

                              return;
                            }
                            addToCart({ ...item, quantity: 1 });
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg leading-5 font-semibold mt-2">
                    {lang === "EN"
                      ? item?.FoodMenuItemName
                      : item?.FoodMenuItemNameAr
                        ? item?.FoodMenuItemNameAr
                        : item?.FoodMenuItemName}
                  </h3>
                  <p className="text-gray text-lg font-semibold mt-1">
                    {lang == "EN"
                      ? item?.FoodMenuItemPrice
                      : toArabicNumbers(item?.FoodMenuItemPrice)}{" "}
                    {langText.EGP[lang]}
                  </p>
                </div>
              )),
            )}
          </div>
        </div>
      ))}
      {selectedAddsItem && (
        <AddsPoupMobile
          item={selectedAddsItem}
          setselectedAddsItem={setselectedAddsItem}
        />
      )}
    </div>
  );
}

export default MobileMenu;

export function AddsPoupMobile({
  item,
  setselectedAddsItem,
  edit = false,
  editedItem,
}) {
  const { lang } = useLangStore();
  const { addToCart, cart, setCart } = useCartStore();

  const maxSubItems = item?.FoodMenuItemAvailableSubItem;
  const subItems = item?.FoodMenuSubItems && item.FoodMenuSubItems.length > 0 ? item.FoodMenuSubItems : null;

  const [addedItem, setAddedItem] = useState(
    edit
      ? editedItem
      : {
        ...item,
        quantity: 1,
        FoodMenuItemAdds: [],
        selectedSubItems: [],
      },
  );

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const tabsRef = useRef(null);
  useDraggableScroll(tabsRef);

  const groupedAdds = useMemo(() => {
    if (!item?.FoodMenuItemAdds) return [];
    const groups = {};
    item.FoodMenuItemAdds.forEach((add) => {
      const gName =
        lang === "EN"
          ? add?.FoodMenuItemAddsGroupName
          : add?.FoodMenuItemAddsGroupNameAr || add?.FoodMenuItemAddsGroupName;
      const groupName = gName || (lang === "EN" ? "Add-ons" : "إضافات");

      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(add);
    });
    return Object.entries(groups).map(([name, adds]) => ({ name, adds }));
  }, [item?.FoodMenuItemAdds, lang]);

  function handelAdds(id, checked) {
    const currentAdds = addedItem?.FoodMenuItemAdds
      ? [...addedItem.FoodMenuItemAdds]
      : [];

    if (checked) {
      const exists = currentAdds.find(
        (a) => a.FoodMenuItemMultyAddsAddId === id,
      );
      if (!exists) {
        const addToPush = item.FoodMenuItemAdds.find(
          (a) => a.FoodMenuItemMultyAddsAddId === id,
        );
        if (addToPush) currentAdds.push(addToPush);
      }
    } else {
      // إزالة الإضافة
      const filtered = currentAdds.filter(
        (a) => a.FoodMenuItemMultyAddsAddId !== id,
      );
      currentAdds.length = 0;
      currentAdds.push(...filtered);
    }

    setAddedItem((prev) => ({ ...prev, FoodMenuItemAdds: currentAdds }));
    // لا تعتمد على console.log(addedItem) هنا لعرض النتيجة فوراً؛ استخدم useEffect لمراقبة التغيُّر إن احتجت
  }

  function handleSubItems(subItemId, checked) {
    const currentSubs = addedItem?.selectedSubItems
      ? [...addedItem.selectedSubItems]
      : [];

    if (checked) {
      if (currentSubs.length >= maxSubItems) {
        onlineOrderToast.error(langText.maxSubItemsReached[lang]);
        return;
      }
      const exists = currentSubs.find((s) => s.FoodMenuItemId === subItemId);
      if (!exists) {
        const subToPush = subItems.find((s) => s.FoodMenuItemId === subItemId);
        if (subToPush) currentSubs.push(subToPush);
      }
    } else {
      const filtered = currentSubs.filter((s) => s.FoodMenuItemId !== subItemId);
      currentSubs.length = 0;
      currentSubs.push(...filtered);
    }

    setAddedItem((prev) => ({ ...prev, selectedSubItems: currentSubs }));
  }

  function handleAddToCart() {
    const finalItem = { ...addedItem };
    if (finalItem.selectedSubItems?.length > 0) {
      finalItem.selectedSubItems = finalItem.selectedSubItems.map((subItem) => ({
        ...subItem,
        quantity: finalItem.quantity,
      }));
    }
    addToCart(finalItem);
    setselectedAddsItem(null);
  }

  function handleEdit() {
    // حافظ على cartItemId إن كانت موجودة في editedItem
    const merged = { ...editedItem, ...addedItem };
    if (merged.selectedSubItems?.length > 0) {
      merged.selectedSubItems = merged.selectedSubItems.map((subItem) => ({
        ...subItem,
        quantity: merged.quantity,
      }));
    }
    const updatedCart = cart.map((cartItem) =>
      cartItem.cartItemId === editedItem.cartItemId ? merged : cartItem,
    );
    setCart(updatedCart);
    setselectedAddsItem(null);
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (edit && editedItem) {
      setAddedItem({
        ...editedItem,
        FoodMenuItemAdds: editedItem.FoodMenuItemAdds
          ? [...editedItem.FoodMenuItemAdds]
          : [],
        selectedSubItems: editedItem.selectedSubItems
          ? [...editedItem.selectedSubItems]
          : [],
      });
    } else if (item) {
      setAddedItem({
        ...item,
        quantity: 1,
        FoodMenuItemAdds: [],
        selectedSubItems: [],
      });
    }
  }, [edit, editedItem, item]);

  // Calculate total price including adds + sub items
  const totalUnitPrice =
    (addedItem?.FoodMenuItemPrice || 0) +
    (addedItem?.FoodMenuItemAdds?.reduce(
      (total, add) => total + (add?.FoodMenuItemAddsPriceEgp || 0),
      0,
    ) || 0) +
    (addedItem?.selectedSubItems?.reduce(
      (total, sub) => total + (sub?.FoodMenuItemPrice || 0),
      0,
    ) || 0);

  return (
    <div className="fixed h-screen w-screen z-50 bg-[rgba(0,0,0,0.5)] flex justify-center items-center left-0 bottom-0 right-0">
      <div className="bg-white max-w-full max-h-[90vh] rounded-t-2xl absolute bottom-0 left-0 right-0 w-full flex flex-col overflow-hidden">
        <div
          onClick={() => setselectedAddsItem(null)}
          className="absolute top-3 right-3 rounded-full bg-white p-2 aspect-square flex justify-center items-center text-black z-10 shadow-md"
        >
          <IoMdClose className="text-xl cursor-pointer" />
        </div>
        <div className="overflow-y-auto scrollbar-hide w-full flex-1 rounded-t-2xl bg-white">
          <div className="w-full h-60 overflow-hidden shrink-0 bg-gray-100">
            <img
              src={item?.FoodMenuItemImg || "/img/food/food.png"}
              alt={item?.FoodMenuItemName}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="p-3">
            <div className="flex justify-between gap-2 items-center text-xl font-semibold my-3">
              <h2 className="">
                {lang === "EN"
                  ? item?.FoodMenuItemName
                  : item?.FoodMenuItemNameAr
                    ? item?.FoodMenuItemNameAr
                    : item?.FoodMenuItemName}
              </h2>
              <p className="text-gray text-[16px]">
                (
                {lang == "EN"
                  ? addedItem?.FoodMenuItemPrice
                  : toArabicNumbers(addedItem?.FoodMenuItemPrice)}{" "}
                {langText?.EGP[lang]})
              </p>
            </div>
            <p className="text-gray mb-3">
              {lang === "EN"
                ? item?.FoodMenuItemDescription
                : item?.FoodMenuItemDescriptionAr
                  ? item?.FoodMenuItemDescriptionAr
                  : item?.FoodMenuItemDescription}
            </p>

            {/* Sub Items Section */}
            {subItems && (
              <div className="ps-3 pb-4">
                <p className="mb-2 font-semibold">
                  {langText.chooseSubItems[lang]} (
                  {lang === "EN"
                    ? addedItem?.selectedSubItems?.length || 0
                    : toArabicNumbers(addedItem?.selectedSubItems?.length || 0)}
                  /
                  {lang === "EN" ? maxSubItems : toArabicNumbers(maxSubItems)})
                </p>
                <div className="mt-2 flex gap-4 w-full overflow-x-auto scrollbar-hide pb-2">
                  {subItems.map((sub) => {
                    const isSelected = Boolean(
                      addedItem?.selectedSubItems?.find(
                        (s) => s.FoodMenuItemId === sub.FoodMenuItemId,
                      ),
                    );
                    const isDisabled = !isSelected && (addedItem?.selectedSubItems?.length || 0) >= maxSubItems;
                    return (
                      <label
                        key={`sub-mob-${sub.FoodMenuItemId}`}
                        className={`relative min-w-[140px] max-w-[140px] border rounded-lg p-2 flex flex-col gap-2 cursor-pointer ${isSelected ? 'border-primary' : 'border-light-gray'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        htmlFor={`sub-mob-${sub.FoodMenuItemId}`}
                      >
                        <img src={sub?.FoodMenuItemImg || "/img/food/food.png"} alt="" className="w-full h-24 object-cover rounded-md" />
                        <div className="flex-1">
                          <p className="font-semibold text-black truncate text-sm">
                            {lang === "EN"
                              ? sub?.FoodMenuItemName
                              : sub?.FoodMenuItemNameAr || sub?.FoodMenuItemName}
                          </p>
                          <p className="text-gray text-[10px] line-clamp-2 mt-1 min-h-[30px] leading-tight">
                            {lang === "EN"
                              ? sub?.FoodMenuItemDescription
                              : sub?.FoodMenuItemDescriptionAr || sub?.FoodMenuItemDescription}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-primary font-semibold text-[11px]">
                            (+{" "}
                            {lang == "EN"
                              ? (sub?.FoodMenuItemPrice || 0)?.toFixed(2)
                              : toArabicNumbers(
                                (sub?.FoodMenuItemPrice || 0)?.toFixed(2),
                              )}{" "}
                            {langText.EGP[lang]})
                          </span>
                          <input
                            className="w-4 h-4 accent-primary flex-shrink-0"
                            type="checkbox"
                            id={`sub-mob-${sub.FoodMenuItemId}`}
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={(e) => {
                              handleSubItems(
                                sub.FoodMenuItemId,
                                e.target.checked,
                              );
                            }}
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {groupedAdds?.length > 0 && (
              <div className="ps-3 pb-4">
                {groupedAdds?.length > 1 && (
                  <p className="mb-4">{langText.availableAddOns[lang]}</p>
                )}

                <div
                  ref={tabsRef}
                  className="w-full overflow-x-auto whitespace-nowrap border-b border-light-gray mb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
                >
                  <div className="flex gap-6">
                    {groupedAdds.map((group, idx) => (
                      <button
                        key={group.name}
                        onClick={() => setActiveGroupIndex(idx)}
                        className={`pb-2 text-sm font-semibold transition-all relative ${activeGroupIndex === idx
                          ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                          : "text-gray"
                          }`}
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                </div>

                <ul className="mt-2 text-gray flex flex-col gap-4 w-full max-h-52 overflow-y-auto text-[12px]">
                  {groupedAdds[activeGroupIndex]?.adds?.map((add, i) => (
                    <li key={`food-{${add?.FoodMenuItemMultyAddsAddId}`}>
                      <label
                        className="w-full grid items-center grid-cols-10 "
                        htmlFor={`food-{${add?.FoodMenuItemMultyAddsAddId}`}
                      >
                        <p className=" col-span-6">
                          {lang === "EN"
                            ? add?.FoodMenuItemAddsName
                            : add?.FoodMenuItemAddsNameAr
                              ? add?.FoodMenuItemAddsNameAr
                              : add?.FoodMenuItemAddsName}
                        </p>
                        <span className="col-span-3">
                          (+{" "}
                          {lang == "EN"
                            ? add?.FoodMenuItemAddsPriceEgp?.toFixed(2)
                            : toArabicNumbers(
                              add?.FoodMenuItemAddsPriceEgp?.toFixed(2),
                            )}{" "}
                          {langText.EGP[lang]})
                        </span>
                        <input
                          className="col-span-1 w-4 h-4"
                          type="checkbox"
                          id={`food-${add?.FoodMenuItemMultyAddsAddId}`}
                          checked={Boolean(
                            addedItem?.FoodMenuItemAdds?.find(
                              (a) =>
                                a?.FoodMenuItemMultyAddsAddId ===
                                add?.FoodMenuItemMultyAddsAddId,
                            ),
                          )}
                          onChange={(e) => {
                            handelAdds(
                              add?.FoodMenuItemMultyAddsAddId,
                              e.target.checked,
                            );
                          }}
                        />{" "}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
        <div className="flex items-center gap-5 shrink-0 bg-white p-3 border-t border-light-gray z-10 w-full mb-0 pb-safe">
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                if (addedItem?.quantity > 1)
                  setAddedItem((prev) => ({
                    ...prev,
                    quantity: prev?.quantity - 1,
                  }));
              }}
              className="w-6 h-6 flex cursor-pointer items-center justify-center bg-primary rounded-full"
            >
              <FaMinus className="text-white text-md" />
            </div>
            <span className="text-secondary font-semibold">
              {lang == "EN"
                ? addedItem?.quantity
                : toArabicNumbers(addedItem?.quantity)}
            </span>
            <div
              onClick={() =>
                setAddedItem((prev) => ({
                  ...prev,
                  quantity: prev?.quantity + 1,
                }))
              }
              className="w-6 h-6 flex cursor-pointer items-center justify-center bg-primary rounded-full"
            >
              <FaPlus className="text-white text-md" />
            </div>
          </div>
          {/* <button onClick={edit?handleEdit:handleAddToCart} type='buttom' className="rounded-full border border-primary bg-primary hover:bg-white hover:text-primary transition w-full py-2 text-lg text-center text-white cursor-pointer">{langText.addEGP[lang]} {(addedItem?.FoodMenuItemPrice )*addedItem?.quantity}</button> */}
          <button
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              edit ? handleEdit() : handleAddToCart();
            }}
            onClick={(e) => {
              e.preventDefault();
              edit ? handleEdit() : handleAddToCart();
            }}
            style={{
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
            type="buttom"
            className="rounded-full border border-primary bg-primary hover:bg-white hover:text-primary transition w-full py-2 text-lg text-center text-white cursor-pointer"
          >
            {addedItem?.quantity === 0
              ? langText.remove[lang]
              : edit
                ? langText.edit[lang]
                : langText.add[lang]}

            {addedItem?.quantity > 0 &&
              (lang === "EN"
                ? ` ${totalUnitPrice * addedItem?.quantity}  ${langText.EGP[lang]}`
                : ` ${toArabicNumbers(totalUnitPrice * addedItem?.quantity)} ${langText.EGP[lang]}`)}
          </button>
        </div>
        <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
      </div>
    </div>
  );
}
