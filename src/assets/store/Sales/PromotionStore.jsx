import { create } from "zustand";

const usePromotionStore = create((set) => ({
  draftPromotion: {
    orderPromotionId: 0,
    orderPromotionAgendId: 0,
    orderPromotionOperatorId: 0,
    orderPromotionCustomerId: 0,
    orderPromotionDiscountValue: 0,
    orderPromotionCount: 0,
    _OrderPromotionItems: [],
  },

  setDraftPromotion: (data) =>
    set((state) => ({
      draftPromotion: { ...state.draftPromotion, ...data },
    })),

  updatePromotionItem: (item) =>
    set((state) => {
      const existingItemIndex = state.draftPromotion._OrderPromotionItems.findIndex(
        (i) => i.orderPromotionItemsFoodItemId === item.orderPromotionItemsFoodItemId
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...state.draftPromotion._OrderPromotionItems];
        newItems[existingItemIndex] = { ...newItems[existingItemIndex], ...item };
      } else {
        newItems = [...state.draftPromotion._OrderPromotionItems, item];
      }

      return {
        draftPromotion: {
          ...state.draftPromotion,
          _OrderPromotionItems: newItems,
        },
      };
    }),

  removePromotionItem: (itemId) =>
    set((state) => ({
      draftPromotion: {
        ...state.draftPromotion,
        _OrderPromotionItems: state.draftPromotion._OrderPromotionItems.filter(
          (i) => i.orderPromotionItemsFoodItemId !== itemId
        ),
      },
    })),

  clearDraftPromotion: () =>
    set({
      draftPromotion: {
        orderPromotionId: 0,
        orderPromotionAgendId: 0,
        orderPromotionOperatorId: 0,
        orderPromotionCustomerId: 0,
        orderPromotionDiscountValue: 0,
        orderPromotionCount: 0,
        _OrderPromotionItems: [],
      },
    }),
}));

export default usePromotionStore;
