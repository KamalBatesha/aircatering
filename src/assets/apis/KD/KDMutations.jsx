import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onlineOrderToast } from "../../Helpers/onlineOrderToast";
import { DoneItem, HoldItem, ItemDocumentsUpload, RemoveItemDocumentsUpload } from "./KDAPI";

function KDMutations(depId, orderId, activeKey) {
  const queryClient = useQueryClient();
  const markItemAsHold = useMutation({
    mutationKey: ["markItemAsHold"],
    mutationFn: ({ itemId }) => HoldItem(depId, itemId),
    onSuccess: () => {
      onlineOrderToast.success("Item held successfully");
      queryClient.invalidateQueries({
        queryKey: ["runningOrderDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["runningOrders", depId, activeKey],
      });
      queryClient.invalidateQueries({
        queryKey: ["quotationDetails", orderId],
      });
    },
    onError: () => {
      onlineOrderToast.error("Failed to hold item");
    },
    onMutate: () => {
      onlineOrderToast.loading("Holding item...");
    },
  });

  const markItemDone = useMutation({
    mutationKey: ["markItemAsDone"],
    mutationFn: async ({ itemId }) => {
      return await DoneItem(depId, itemId);
    },
    onSuccess: () => {
      onlineOrderToast.success("Item marked as done");
      queryClient.invalidateQueries({
        queryKey: ["runningOrderDetailsForReview"],
      });
      queryClient.invalidateQueries({
        queryKey: ["runningOrderDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["runningOrders", depId, activeKey],
      });
      queryClient.invalidateQueries({
        queryKey: ["quotationDetails", orderId],
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data ||
        error?.message ||
        "An unexpected error occurred";

      onlineOrderToast.error(errorMessage);
      console.error("Mark item error:", error);
    },
    onMutate: () => {
      onlineOrderToast.loading("Marking item as done...");
    },
  });

  const itemDocumentsUpload = useMutation({
    mutationKey: ["itemDocumentsUpload"],
    mutationFn: async ({ detailID, pictPath }) => {
      return await ItemDocumentsUpload(detailID, pictPath);
    },
    onSuccess: () => {
      onlineOrderToast.success("Upload Image Successfully...");
      queryClient.invalidateQueries({
        queryKey: ["quotationDetails", orderId],
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data ||
        error?.message ||
        "An unexpected error occurred";

      onlineOrderToast.error(errorMessage);
      console.error("Failed Upload Image...", error);
    },
    onMutate: () => {
      onlineOrderToast.loading("Uploading Image...");
    },
  });
  const removeItemDocumentsUpload = useMutation({
    mutationKey: ["itemDocumentsUpload"],
    mutationFn: async ({ pictID }) => {
      return await RemoveItemDocumentsUpload(pictID);
    },
    onSuccess: () => {
      onlineOrderToast.success("Remove Image Successfully...");
      queryClient.invalidateQueries({
        queryKey: ["quotationDetails", orderId],
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data ||
        error?.message ||
        "An unexpected error occurred";

      onlineOrderToast.error(errorMessage);
      console.error("Failed Remove Image...", error);
    },
    onMutate: () => {
      onlineOrderToast.loading("Removing Image...");
    },
  });

  return { markItemAsHold, markItemDone, itemDocumentsUpload, removeItemDocumentsUpload };
}

export default KDMutations;
