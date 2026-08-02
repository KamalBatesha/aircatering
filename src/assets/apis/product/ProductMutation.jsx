import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { onlineOrderToast } from "../onlineOrderToast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { langText } from "../../constants/lang";
import { useLangStore } from "../../store/langStore";
import useGreetingStore from "../../store/greetingStore";
import { onlineOrderToast } from "../../Helpers/onlineOrderToast";
import { createOrderByClient, UpdateOrderDetails, UpdateOrderHeaderAirCatering } from "./PeoductApi";

function useProductMutation({ onClose, onRegisterSuccess } = {}) {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { clearCart } = useCartStore();
    const { lang } = useLangStore();
    const queryClient = useQueryClient();



    const createOrderByClientMutation = useMutation({
        mutationKey: ["createOrderByClient"],
        mutationFn: (data) => createOrderByClient(data),

    });
    const UpdataDetailsMutation = useMutation({
        mutationKey: ["OrderDetails"],
        mutationFn: (data) => UpdateOrderDetails(data),
        onSuccess: () => {
            onlineOrderToast.success("Items Updated Successfully", { id: "1" });
            queryClient.resetQueries({
                queryKey: ["quatationList"],
            });
        },
        onMutate: () => {
            onlineOrderToast.loading("Updating Items", { id: "1" });
        },
        onError: (error) => {
            onlineOrderToast.error(error?.response?.data || "Failed to Update Items", {
                id: "1",
            });
        },
    });

    const UpdateOrderHeaderMutation = useMutation({
        mutationKey: ["UpdateOrderHeaderAirCatering"],
        mutationFn: ({ orderId, data }) => UpdateOrderHeaderAirCatering(orderId, data),
    });


    return {
        createOrderByClientMutation,
        UpdataDetailsMutation,
        UpdateOrderHeaderMutation
    }
}
export default useProductMutation
