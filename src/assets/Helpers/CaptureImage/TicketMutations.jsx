import { useMutation } from "@tanstack/react-query";
import { onlineOrderToast } from "../onlineOrderToast";

import { AddNewTicket } from "../../Api/Layout/LayoutAPI";

export default function TicketMutations(onClose) {
  const newTicketMutation = useMutation({
    mutationKey: ["newTicket"],
    mutationFn: ({ data, token }) => AddNewTicket(data, token),
    onSuccess: () => {
			onlineOrderToast.success("Ticket Submitted Successfully");
			onClose();
    },
    onMutate: () => {
      onlineOrderToast.loading("Submitting Ticket...");
    },

    onError: () => {
      onlineOrderToast.error("Failed to Submit Ticket");
    },
  });

  return { newTicketMutation };
}
