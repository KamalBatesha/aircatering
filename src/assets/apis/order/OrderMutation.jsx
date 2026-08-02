import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CancelOrder, CheckOut, finalConfirmation, SaveIndividualOrder, SaveIndividualOrderItems, SubmitClientDecision } from "./OrderApi";
// import { onlineOrderToast } from "../onlineOrderToast";
import useAuthStore from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";
import { onlineOrderToast } from "../../Helpers/onlineOrderToast";
import { useLangStore } from "../../store/langStore";
import { langText } from "../../constants/lang";

function orderMutation({ onClose }) {
  const { setQuatationData } = useAuthStore();
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { lang } = useLangStore();
  const CreateIndividualMutation = useMutation({
    mutatuionKey: ["IndividualHeader"],
    mutationFn: (data) => SaveIndividualOrder(data),
    onSuccess: (response) => {

      setQuatationData(response);
      console.log("response", response);
      const mainitemPayload = cart.map((item) => ({
        orderDetailsId: 0,
        orderDetailsHeaderId: response?.at(0)?.header?.orderHeaderId || 0,
        orderDetailsItemId: item.FoodMenuItemId,
        orderDetailsName: item.FoodMenuItemName,
        orderDetailsPcking: "Standard Packing",
        orderDetailsQty: item.quantity,
        orderDetailsPackingId: 1,
        orderDetailsCurrencyPrice: item.FoodMenuItemPrice,
        OrderDetailsUnitName: item?.FoodMenuItemUnitName,
        OrderDetailsUnitId: item?.FoodMenuItemUnitId,
        orderDetailsMigerment: item?.FoodMenuItemMigerment,
        _itemsAdds: item?.FoodMenuItemAdds?.map((add) => ({
          foodMenuItemAddsId: add?.FoodMenuItemMultyAddsAddId,
          foodMenuItemAddsName: add?.FoodMenuItemAddsName,
          foodMenuItemAddsPriceEgp: add?.FoodMenuItemAddsPriceEgp,
        }))

      })
      )

      const allSubItemsraw = cart?.flatMap((item) => item?.selectedSubItems?.map((subItem) => {
        return {
          orderDetailsId: 0,
          orderDetailsHeaderId: response?.at(0)?.header?.orderHeaderId || 0,
          orderDetailsItemId: subItem.FoodMenuItemId,
          orderDetailsName: subItem.FoodMenuItemName,
          orderDetailsPcking: "Standard Packing",
          orderDetailsQty: subItem.quantity,
          orderDetailsPackingId: 1,
          orderDetailsCurrencyPrice: subItem.FoodMenuItemPrice,
          OrderDetailsUnitName: subItem?.FoodMenuItemUnitName,
          OrderDetailsUnitId: subItem?.FoodMenuItemUnitId,
          orderDetailsMigerment: subItem?.FoodMenuItemMigerment,
        }
      }) || []).filter(Boolean) || []

      const allSubItems = Object.values(allSubItemsraw.reduce((acc, current) => {
        if (!acc[current.orderDetailsItemId]) {
          acc[current.orderDetailsItemId] = { ...current };
        } else {
          acc[current.orderDetailsItemId].orderDetailsQty += current.orderDetailsQty;
        }
        return acc;
      }, {}));

      console.log("payload", [...mainitemPayload, ...allSubItems]);

      // const subItemsPayload=  cart?.filter((item)=>item?.selectedSubItems?.length>0)?.map((item) => ({
      //   orderDetailsId: 0,
      //     orderDetailsHeaderId: response?.at(0)?.header?.orderHeaderId || 0,
      //     orderDetailsItemId: item.FoodMenuItemId,
      //     orderDetailsName: item.FoodMenuItemName,
      //     orderDetailsPcking: "Standard Packing",
      //     orderDetailsQty: item.quantity,
      //     orderDetailsPackingId: 1,
      //     orderDetailsCurrencyPrice: item.FoodMenuItemPrice,
      //     OrderDetailsUnitName: item?.FoodMenuItemUnitName,
      //     OrderDetailsUnitId: item?.FoodMenuItemUnitId,
      //     orderDetailsMigerment: item?.FoodMenuItemMigerment,
      // }))

      SaveIndividuaItemslMutation.mutate([...mainitemPayload, ...allSubItems]);
    },
    onMutate: () => {
      onlineOrderToast.loading(langText.creatingOrder[lang]);
    },
    onError: () => {
      onlineOrderToast.error(langText.failedToCreateOrder[lang]);
      onClose()
    },
  });

  const SaveIndividuaItemslMutation = useMutation({
    mutatuionKey: ["IndividualHeader"],
    mutationFn: (data) => SaveIndividualOrderItems(data),
    onSuccess: (response) => {
      onlineOrderToast.success(langText.orderCreatedSuccessfully[lang]);
      queryClient.invalidateQueries(["myOrders"]);
      clearCart();
      onClose();
      navigate("/home")
    },
    onMutate: () => {
      onlineOrderToast.loading(langText.creatingOrder[lang]);
    },
    onError: () => {
      onlineOrderToast.error(langText.failedToCreateOrder[lang]);
      onClose()
    },
  });

  const CancelOrderMutation = useMutation({
    mutatuionKey: ["CancelOrder"],
    mutationFn: (id) => CancelOrder(id),
    onSuccess: (response) => {
      onlineOrderToast.success(langText.orderCancelledSuccessfully[lang]);
      queryClient.invalidateQueries(["myOrders"]);
      clearCart();
      onClose();
      navigate("/home")

    },
    onMutate: () => {
      onlineOrderToast.loading(langText.cancelingOrder[lang]);
    },
    onError: () => {
      onlineOrderToast.error(langText.failedToCancelOrder[lang]);
      onClose()
    },
  });

  const CheckOutMutation = useMutation({
    mutatuionKey: ["CheckOut"],
    mutationFn: (id) => CheckOut(id),
    onSuccess: (response) => {
      onlineOrderToast.success(langText.orderEndedSucessfully[lang]);
      queryClient.invalidateQueries(["myOrders"]);
      clearCart();
      // onClose();

    },
    onMutate: () => {
      onlineOrderToast.loading(langText.endingOrder[lang]);
    },
    onError: () => {
      onlineOrderToast.error(langText.orderEndedFailed[lang]);
      onClose()
    },
  });

  const finalConfirmationMutation = useMutation({
    mutatuionKey: ["finalConfirmation"],
    mutationFn: (id) => finalConfirmation(id),
    onSuccess: (response) => {
      onlineOrderToast.success(langText.orderConfirmedSucessfully[lang]);
      queryClient.invalidateQueries(["myOrders"]);
      clearCart();
      // onClose();

    },
    onMutate: () => {
      onlineOrderToast.loading(langText.confirmingOrder[lang]);
    },
    onError: () => {
      onlineOrderToast.error(langText.orderConfirmedFailed[lang]);
      onClose()
    },
  });

  const submitClientDecisionMutation = useMutation({
    mutationKey: ["submitClientDecision"],
    mutationFn: (data) => SubmitClientDecision(data),
    onSuccess: () => {
      onlineOrderToast.success(lang === "EN" ? "Decision submitted successfully" : "تم إرسال قراركم بنجاح");
      queryClient.invalidateQueries(["orderInfo"]);
      queryClient.invalidateQueries(["orderDetails"]);
      queryClient.invalidateQueries(["myOrders"]);
    },
    onMutate: () => {
      onlineOrderToast.loading(lang === "EN" ? "Submitting decision..." : "جارٍ إرسال القرار...");
    },
    onError: () => {
      onlineOrderToast.error(lang === "EN" ? "Failed to submit decision" : "فشل إرسال القرار");
    },
  });

  return { CreateIndividualMutation, SaveIndividuaItemslMutation, CancelOrderMutation, CheckOutMutation, finalConfirmationMutation, submitClientDecisionMutation };
}
export default orderMutation;