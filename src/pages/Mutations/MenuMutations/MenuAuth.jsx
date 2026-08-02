import { useQuery } from "@tanstack/react-query";

import {
  GetMenuActions,
  GetUserMenuItemActionsAuth,
} from "../../../assets/apis/ERP/Layout/LayoutAPI";
import useMenuStore from "../../../assets/store/MenuIems/MenuItems";

function useMenuAuth() {
  const levelTwoActive = useMenuStore((state) => state.levelTwoActive);
  const levelThreeActive = useMenuStore((state) => state.levelThreeActive);
  const { data: menuItemActions2 } = useQuery({
    queryKey: ["menuItemActions", levelTwoActive],
    queryFn: () => {
      if (levelTwoActive) return GetMenuActions(levelTwoActive);
      else return [];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: menuItemActions3 } = useQuery({
    queryKey: ["menuItemActions", levelThreeActive],
    queryFn: () => {
      // console.log("levelThreeActive",levelThreeActive);

      if (levelThreeActive) return GetMenuActions(levelThreeActive);
      else return [];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: menuItemActions2auth } = useQuery({
    queryKey: ["menuItemActionsAuth", levelTwoActive],
    queryFn: () => {
      if (levelTwoActive) return GetUserMenuItemActionsAuth(levelTwoActive);
      else return [];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: menuItemActions3auth } = useQuery({
    queryKey: ["menuItemActionsAuth", levelThreeActive],
    queryFn: () => {
      if (levelThreeActive) return GetUserMenuItemActionsAuth(levelThreeActive);
      else return [];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return {
    menuItemActions2,
    menuItemActions3,
    menuItemActions3auth,
    menuItemActions2auth,
  };
}

export default useMenuAuth;
