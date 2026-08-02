import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  GetNotificationItems,
  MarkNotificationAsRead,
} from "../Api/Notifications/Notifications";
import useMenuStore from "../Zustand/MenuIems/MenuItems";

function UseNotificationItems() {
  const levelThreeActive = useMenuStore((state) => state.levelThreeActive);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notificationItems"],
    queryFn: () => GetNotificationItems(levelThreeActive),
    enabled: !!levelThreeActive,
  });

  const readNotificationMutation = useMutation({
    mutationKey: ["readNotification"],
    mutationFn: (itemId) => MarkNotificationAsRead(levelThreeActive, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(["notificationItems"]);
    },
    
  });

  return {
    notificationItems: data,
    isLoading,
    readMutation: readNotificationMutation,
  };
}

export default UseNotificationItems;
