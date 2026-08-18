// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// const makeCartItemId = (item) =>
//   item.cartItemId || `${item.FoodMenuItemId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// // normalize adds => string key for deterministic comparison
// const normalizeAddsKey = (adds) => {
//   if (!adds || !Array.isArray(adds) || adds.length === 0) return '';
//   // افترض أن كل add له معرف فريد مثل FoodMenuItemMultyAddsAddId
//   const ids = adds.map(a => a.FoodMenuItemMultyAddsAddId ?? a.FoodMenuItemAddsName ?? JSON.stringify(a));
//   ids.sort();
//   return ids.join('|');
// };

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       cart: [],
//       deliveryFee: 0,
//       serviceFee: 0,
//       setCart: (cart) => set({ cart }),
//       // helper: find index by FoodMenuItemId AND adds equality
//       findCartIndexByItem: (item) => {
//         const key = normalizeAddsKey(item?.FoodMenuItemAdds);
//         return get().cart.findIndex(ci =>
//           ci.FoodMenuItemId === item.FoodMenuItemId &&
//           normalizeAddsKey(ci.FoodMenuItemAdds) === key
//         );
//       },
//       addToCart: (item) => {
//         // treat empty adds same as no-adds
//         const itemToAdd = { ...item, quantity: item.quantity ?? 1, cartItemId: makeCartItemId(item) };
//         const idx = get().findCartIndexByItem(itemToAdd);
//         if (idx !== -1) {
//           const updated = [...get().cart];
//           updated[idx] = { ...updated[idx], quantity: (updated[idx].quantity || 0) + (itemToAdd.quantity || 1) };
//           set({ cart: updated });
//         } else {
//           set({ cart: [...get().cart, itemToAdd] });
//         }
//       },
//       addToCartWithAdds: (item) => {
//         // same logic as addToCart but kept separate if you need special handling
//         const itemToAdd = { ...item, quantity: item.quantity ?? 1, cartItemId: makeCartItemId(item) };
//         const idx = get().findCartIndexByItem(itemToAdd);
//         if (idx !== -1) {
//           const updated = [...get().cart];
//           updated[idx] = { ...updated[idx], quantity: (updated[idx].quantity || 0) + (itemToAdd.quantity || 1) };
//           set({ cart: updated });
//         } else {
//           set({ cart: [...get().cart, itemToAdd] });
//         }
//       },
//       // remove by cartItemId (NOT FoodMenuItemId)
//       removeFromCart: (cartItemId) => {
//         set({ cart: get().cart.filter(item => item.cartItemId !== cartItemId) });
//       },
//       // update quantity by cartItemId
//       updateQuantity: (cartItemId, quantity) => {
//         if (quantity === 0) {
//           set({ cart: get().cart.filter(item => item.cartItemId !== cartItemId) });
//           return;
//         }
//         set({
//           cart: get().cart.map(item =>
//             item.cartItemId === cartItemId ? { ...item, quantity } : item
//           )
//         });
//       },
//       // remove a specific add from a specific cart item (and try to merge if identical item exists)
//       removeAddFromCartItem: (cartItemId, addMultyId) => {
//   const cart = [...get().cart];

//   // إيجاد العنصر المطلوب تعديله
//   const itemIndex = cart.findIndex(
//     item => item.cartItemId === cartItemId
//   );

//   if (itemIndex === -1) return;

//   const item = cart[itemIndex];

//   // حذف الإضافة المطلوبة فقط
//   const updatedAdds = item.FoodMenuItemAdds?.filter(
//     add => add.FoodMenuItemMultyAddsAddId !== addMultyId
//   ) || [];

//   const updatedItem = {
//     ...item,
//     FoodMenuItemAdds: updatedAdds,
//   };

//   /**
//    * بعد حذف الإضافة:
//    * قد يصبح هذا العنصر مطابقًا لعنصر آخر (نفس المنتج ونفس الإضافات)
//    * لذلك نحاول الدمج
//    */
//   const normalizedAdds = (adds = []) =>
//     adds
//       .map(a => a.FoodMenuItemMultyAddsAddId)
//       .sort()
//       .join('|');

//   const sameItemIndex = cart.findIndex(
//     (cartItem, idx) =>
//       idx !== itemIndex &&
//       cartItem.FoodMenuItemId === updatedItem.FoodMenuItemId &&
//       normalizedAdds(cartItem.FoodMenuItemAdds) ===
//         normalizedAdds(updatedItem.FoodMenuItemAdds)
//   );

//   if (sameItemIndex !== -1) {
//     // دمج الكميات
//     cart[sameItemIndex].quantity += updatedItem.quantity;
//     cart.splice(itemIndex, 1); // حذف العنصر الحالي
//   } else {
//     // استبدال العنصر فقط
//     cart[itemIndex] = updatedItem;
//   }

//   set({ cart });
// },
//       clearCart: () => set({ cart: [] }),
//       getTotalPrice: () =>
//         get().cart.reduce((total, item) => {
//           const addsTotal = (item?.FoodMenuItemAdds || []).reduce(
//             (sum, add) => sum + (add.FoodMenuItemAddsPriceEgp || 0),
//             0
//           );
//           const price = (item.FoodMenuItemPrice || 0) + addsTotal;
//           return total + price * (item.quantity || 0);
//         }, 0),
//       getTotalItems: () => get().cart.reduce((total, item) => total + (item.quantity || 0), 0),
//       setDeliveryFee: (deliveryFee) => set({ deliveryFee }),
//     }),
//     { name: 'cart-storage' }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      deliveryFee: 0,
      serviceFee: 0,
      selectedOrder: null,
      setSelectedOrder: (order) => set({ selectedOrder: order }),
      setCart: (cart) => set({ cart }),
      addToCart: (item) => {
        const customId =
          item.cartItemId ||
          `${item.orderDetailsItemId || item.itemID}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        item.cartItemId = customId;

        // Find if item already exists in local cart with same ID and arrival/departure flags
        const itemIndex = get().cart.findIndex(
          (cartItem) =>
            cartItem.orderDetailsItemId === item.orderDetailsItemId &&
            cartItem.orderDetailsIsArrival === item.orderDetailsIsArrival &&
            cartItem.orderDetailsIsDepartur === item.orderDetailsIsDepartur,
        );

        if (itemIndex !== -1) {
          const updatedCart = [...get().cart];
          updatedCart[itemIndex].orderDetailsQty += item.orderDetailsQty || 1;
          updatedCart[itemIndex].orderDetailsLineTotalUsd =
            updatedCart[itemIndex].orderDetailsQty *
            updatedCart[itemIndex].orderDetailsPriceUsd;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: (cartItemId) =>
        set({
          cart: get().cart.filter((item) => item.cartItemId !== cartItemId),
        }),
      clearCart: () => set({ cart: [] }),
      updateQuantity: (cartItemId, quantity) =>
        set({
          cart:
            quantity === 0
              ? get().cart.filter((item) => item.cartItemId !== cartItemId)
              : get().cart.map((item) => {
                  if (item.cartItemId === cartItemId) {
                    const newItem = { ...item, orderDetailsQty: quantity };
                    newItem.orderDetailsLineTotalUsd =
                      quantity * newItem.orderDetailsPriceUsd;
                    return newItem;
                  }
                  return item;
                }),
        }),
      getTotalPrice: () =>
        get().cart.reduce((total, item) => {
          return total + (item.orderDetailsLineTotalUsd || 0);
        }, 0),
      getTotalItems: () =>
        get().cart.reduce(
          (total, item) => total + (item.orderDetailsQty || 1),
          0,
        ),
      setDeliveryFee: (deliveryFee) => set({ deliveryFee }),
    }),
    { name: "cart-storage" },
  ),
);
