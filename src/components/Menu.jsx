import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { onlineOrderToast } from "../assets/Helpers/onlineOrderToast";
import {
  FaPlus,
  FaLock,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
} from "react-icons/fa"; import { IoIosSearch, IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { langText } from "../assets/constants/lang";
import useAuthStore from "../assets/store/authStore";
import { useCartStore } from "../assets/store/cartStore";
import { useLangStore } from "../assets/store/langStore";
import { useProductStore } from "../assets/store/productStore";
import { useStationStore } from "../assets/store/stationStore";
import Loading from "../pages/loading/Loading";
import Accordion from "./Accordion";
import AccordionItem from "./AccordionItem";
import { AnimatePresence } from "framer-motion";
import ProductDetailsModal from "./ProductDetailsModal";
import useProductMutation from "../assets/apis/product/ProductMutation";
import { getOrderDetails } from "../assets/apis/order/OrderApi";
import axiosInstance from "../assets/apis/axios";
import { BiLoaderAlt } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { AddFavoriteItem, GetClientFavoriteItems, RemoveFromFavoriteItems } from "../assets/apis/product/PeoductApi";
// import { onlineOrderToast } from "../assets/Helpers/onlineOrderToast";

const DUMMY_GROUPS_AND_SUBGROUPS = [
  {
    MainGroupID: 1,
    MainGroupName: "Appetizers",
    SubGroups: [
      { SubGroupID: 101, SubGroupName: "Cold Appetizers" },
      { SubGroupID: 102, SubGroupName: "Hot Appetizers" }
    ]
  },
  {
    MainGroupID: 2,
    MainGroupName: "Main Courses",
    SubGroups: [
      { SubGroupID: 201, SubGroupName: "Poultry" },
      { SubGroupID: 202, SubGroupName: "Beef & Lamb" },
      { SubGroupID: 203, SubGroupName: "Seafood" }
    ]
  },
  {
    MainGroupID: 3,
    MainGroupName: "Desserts",
    SubGroups: [
      { SubGroupID: 301, SubGroupName: "Cakes & Pastries" },
      { SubGroupID: 302, SubGroupName: "Traditional Arabic" }
    ]
  }
];

const DUMMY_ITEMS = {
  101: [
    { ItemID: "itm-101-1", ItemName: "Hummus", ItemDescription: "Creamy chickpeas puree with tahini, olive oil, lemon.", ItemMegurment: "Plate", itemPriceUSD: 8.50, ItemPrices: [] },
    { ItemID: "itm-101-2", ItemName: "Mutabbal", ItemDescription: "Smoked eggplant dip with tahini and pomegranate seeds.", ItemMegurment: "Plate", itemPriceUSD: 9.00, ItemPrices: [] },
    { ItemID: "itm-101-3", ItemName: "Tabbouleh", ItemDescription: "Finely chopped parsley, mint, tomatoes, onion, bulgur, lemon dress.", ItemMegurment: "Portion", itemPriceUSD: 8.00, ItemPrices: [] }
  ],
  102: [
    { ItemID: "itm-102-1", ItemName: "Kibbeh", ItemDescription: "Fried cracked wheat shells stuffed with minced meat, onions, pine nuts.", ItemMegurment: "4 Pcs", itemPriceUSD: 11.00, ItemPrices: [] },
    { ItemID: "itm-102-2", ItemName: "Cheese Sambousek", ItemDescription: "Crispy pastry pockets filled with mixed cheeses and fresh herbs.", ItemMegurment: "4 Pcs", itemPriceUSD: 9.50, ItemPrices: [] }
  ],
  201: [
    { ItemID: "itm-201-1", ItemName: "Grilled Chicken Breast", ItemDescription: "Tender chicken breast served with steamed vegetables and garlic sauce.", ItemMegurment: "Portion", itemPriceUSD: 22.00, ItemPrices: [] },
    { ItemID: "itm-201-2", ItemName: "Chicken Biryani", ItemDescription: "Aromatic basmati rice cooked with chicken, spices, saffron, fried onions.", ItemMegurment: "Portion", itemPriceUSD: 24.50, ItemPrices: [] }
  ],
  202: [
    { ItemID: "itm-202-1", ItemName: "Beef Tenderloin", ItemDescription: "Grilled prime beef tenderloin served with mashed potatoes and pepper sauce.", ItemMegurment: "Portion", itemPriceUSD: 34.00, ItemPrices: [] },
    { ItemID: "itm-202-2", ItemName: "Lamb Chops", ItemDescription: "Marinated grilled lamb chops with rosemary roasted potatoes.", ItemMegurment: "Portion", itemPriceUSD: 32.50, ItemPrices: [] }
  ],
  203: [
    { ItemID: "itm-203-1", ItemName: "Grilled Salmon", ItemDescription: "Salmon fillet with asparagus, dill cream sauce, and lemon zest.", ItemMegurment: "Portion", itemPriceUSD: 28.00, ItemPrices: [] }
  ],
  301: [
    { ItemID: "itm-301-1", ItemName: "Chocolate Fondant", ItemDescription: "Warm chocolate cake with a molten center, served with vanilla ice cream.", ItemMegurment: "Piece", itemPriceUSD: 10.00, ItemPrices: [] },
    { ItemID: "itm-301-2", ItemName: "New York Cheesecake", ItemDescription: "Classic rich cheesecake with strawberry compote.", ItemMegurment: "Piece", itemPriceUSD: 9.50, ItemPrices: [] }
  ],
  302: [
    { ItemID: "itm-302-1", ItemName: "Kunafa", ItemDescription: "Warm cheese pastry soaked in sweet syrup, topped with pistachios.", ItemMegurment: "Piece", itemPriceUSD: 11.00, ItemPrices: [] }
  ]
};

function getDummySearchResults(query) {
  const q = query.toLowerCase();
  const results = [];
  DUMMY_GROUPS_AND_SUBGROUPS.forEach(mg => {
    const matchedSubgroups = [];
    mg.subGroups.forEach(sg => {
      const items = DUMMY_ITEMS[sg.subGroupID] || [];
      const matchedItems = items.filter(item =>
        item.ItemName.toLowerCase().includes(q) ||
        item.ItemDescription.toLowerCase().includes(q)
      );
      if (matchedItems.length > 0) {
        matchedSubgroups.push({
          ...sg,
          Items: matchedItems
        });
      }
    });
    if (matchedSubgroups.length > 0) {
      results.push({
        ...mg,
        SubGroups: matchedSubgroups
      });
    }
  });
  return results;
}

function Menu({ scrollToItemId, orderDetails }) {
  const { lang } = useLangStore();
  const [activeIndices, setActiveIndices] = useState(null);
  const [selectedMainGroupIndex, setSelectedMainGroupIndex] = useState(0);
  const [selectedMainGroupID, setSelectedMainGroupID] = useState(null);
  const [isMobileGroupsOpen, setIsMobileGroupsOpen] = useState(false);
  const { addToCart } = useCartStore();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const { setProduct } = useProductStore();
  const { setAvailableStations, selectedStation } = useStationStore();
  const lastScrolledIdRef = useRef(null);
  const menuContentRef = useRef(null);
  const mobileNavRef = useRef(null);
  const categoryRefs = useRef({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const { isArrival, isDeparture, setIsArrivalAndDeparture } = useProductStore();
  const { UpdataDetailsMutation } = useProductMutation();
  const queryClient = useQueryClient();
  const { selectedOrder } = useCartStore();

  // ── Favourites ────────────────────────────────────────────────────────────
  // Fetch the user's saved favourite IDs on mount (and after any mutation)
  const { data: favouriteIdsData } = useQuery({
    queryKey: ["client-favourites"],
    queryFn: GetClientFavoriteItems,
    enabled: !!user,
    staleTime: 0,
  });

  // Build a lookup set from the server response (optimistic local overrides go on top)
  const [localFavOverrides, setLocalFavOverrides] = useState({});

  // Merge server data + local overrides into one object consumed by the UI
  const favouritedItems = useMemo(() => {
    const serverSet = {};
    if (Array.isArray(favouriteIdsData)) {
      favouriteIdsData.forEach((id) => { serverSet[id] = true; });
    }
    return { ...serverSet, ...localFavOverrides };
  }, [favouriteIdsData, localFavOverrides]);

  const addFavouriteMutation = useMutation({
    mutationFn: (ItemId) => AddFavoriteItem(ItemId),
    onMutate: (ItemId) => {
      // Optimistic: mark as favourited immediately
      setLocalFavOverrides((prev) => ({ ...prev, [ItemId]: true }));
    },
    onSuccess: () => {
      onlineOrderToast.success(lang === "EN" ? "Added to favourites" : "تمت الإضافة إلى المفضلة");
      // Refetch from server to stay in sync
      queryClient.invalidateQueries({ queryKey: ["client-favourites"] });
      queryClient.invalidateQueries({ queryKey: ["menu-groups"] });
      // Clear local override once server confirms
      setLocalFavOverrides({});
    },
    onError: (error, ItemId) => {
      // Rollback optimistic update
      setLocalFavOverrides((prev) => ({ ...prev, [ItemId]: false }));
      onlineOrderToast.error(lang === "EN" ? "Failed to add to favourites" : "فشل الإضافة إلى المفضلة");
    },
  });

  const removeFavouriteMutation = useMutation({
    mutationFn: (ItemId) => RemoveFromFavoriteItems(ItemId),
    onMutate: (ItemId) => {
      // Optimistic: mark as un-favourited immediately
      setLocalFavOverrides((prev) => ({ ...prev, [ItemId]: false }));
    },
    onSuccess: () => {
      onlineOrderToast.success(lang === "EN" ? "Removed from favourites" : "تمت الإزالة من المفضلة");
      queryClient.invalidateQueries({ queryKey: ["client-favourites"] });
      queryClient.invalidateQueries({ queryKey: ["menu-groups"] });
      queryClient.invalidateQueries({ queryKey: ["subgroup-items"] });
      setLocalFavOverrides({});
    },
    onError: (error, ItemId) => {
      // Rollback: restore as favourited
      setLocalFavOverrides((prev) => ({ ...prev, [ItemId]: true }));
      onlineOrderToast.error(lang === "EN" ? "Failed to remove from favourites" : "فشل الإزالة من المفضلة");
    },
  });
  // ─────────────────────────────────────────────────────────────────────────

  // New States for mega-menu and deferred loading
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hoveredGroupId, setHoveredGroupId] = useState(null);
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);
  const [selectedMainGroup, setSelectedMainGroup] = useState(null);
  const [expandedMobileGroupId, setExpandedMobileGroupId] = useState(null);
  const [selectedMenuHeaderId, setSelectedMenuHeaderId] = useState(null);
  const [isFavoriteItems, setIsFavoriteItems] = useState(false);
  const [showAllFavorites, setShowAllFavorites] = useState(false);

  // Fallback to basic menu if the user removes their last favorite item while viewing favorites
  useEffect(() => {
    if (isFavoriteItems && favouriteIdsData?.length === 0) {
      setIsFavoriteItems(false);
      setSelectedMenuHeaderId(null);
      setShowAllFavorites(false);
    }
  }, [isFavoriteItems, favouriteIdsData]);

  // Endpoint configuration — all three endpoints receive menuHeaderId when set
  const GROUPS_SUBGROUPS_URL = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedMenuHeaderId != null) params.append('CustomerMenuHeaderId', selectedMenuHeaderId);
    if (isFavoriteItems) params.append('favItems', true);
    const qs = params.toString();
    return `/api/AirCatering/GetGroupsWithSubgroupsAndCounts${qs ? '?' + qs : ''}`;
  }, [selectedMenuHeaderId, isFavoriteItems]);

  const SUBGROUP_ITEMS_URL = useMemo(() => (grandGroupId, subgroupId, stationId) => {
    const params = new URLSearchParams();
    if (grandGroupId != null) params.append('grandGroupId', grandGroupId);
    if (subgroupId != null) params.append('groupId', subgroupId);
    if (stationId != null) params.append('stationId', stationId);
    if (selectedMenuHeaderId != null) params.append('menuHeaderId', selectedMenuHeaderId);
    if (isFavoriteItems) params.append('favItems', true);
    return `/api/AirCatering/GetMenuItems?${params.toString()}`;
  }, [selectedMenuHeaderId, selectedMainGroupID, selectedSubgroup, isFavoriteItems]);

  const SEARCH_URL = useMemo(() => (query) => {
    const params = new URLSearchParams();
    params.append('keyword', query);
    const stationId = typeof selectedStation === 'object' ? selectedStation?.stationId : selectedStation;
    if (stationId) params.append('stationId', stationId);
    if (selectedMenuHeaderId != null) params.append('menuHeaderId', selectedMenuHeaderId);
    if (isFavoriteItems) params.append('favItems', true);
    return `/api/AirCatering/MenuItemsSearch?${params.toString()}`;
  }, [search, selectedStation, selectedMenuHeaderId, isFavoriteItems]);

  // Debounce search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset selection when menu header changes to prevent fetching wrong items
  useEffect(() => {
    setSelectedMainGroupID(null);
    setSelectedMainGroup(null);
    setSelectedSubgroup(null);
  }, [selectedMenuHeaderId]);

  // React Queries
  // 1. Fetch only groups and subgroups
  const { data: groupsData, isLoading: isGroupsLoading } = useQuery({
    queryKey: ["menu-groups", selectedMenuHeaderId, isFavoriteItems],
    queryFn: async () => {
      const res = await axiosInstance.get(GROUPS_SUBGROUPS_URL);
      return res.data;
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: customerMenus, isLoading: customerMenusLoading } = useQuery({
    queryKey: ["customer-menus"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/AirCatering/CustomerMenu");
      return res.data;
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !!user
  });


  // 2. Fetch items for selected subgroup
  const { data: subgroupItems, isLoading: isItemsLoading } = useQuery({
    queryKey: ["subgroup-items", selectedSubgroup?.subGroupID, typeof selectedStation === 'object' ? selectedStation?.stationId : selectedStation, selectedMainGroupID, selectedMenuHeaderId, isFavoriteItems],
    queryFn: async () => {
      if (!selectedSubgroup) return [];
      const stationId = typeof selectedStation === 'object' ? selectedStation?.stationId : selectedStation;
      const url = SUBGROUP_ITEMS_URL(selectedMainGroupID, selectedSubgroup?.subGroupID, stationId);
      const res = await axiosInstance.get(url);
      return res.data;
    },
    enabled: !!selectedSubgroup && !!selectedMainGroupID && !debouncedSearch.trim() && !showAllFavorites && !!selectedStation,
  });

  // 2b. Fetch ALL favourites (grandGroupId=0, groupId=0)
  const { data: allFavouritesData, isLoading: isAllFavLoading } = useQuery({
    queryKey: ["all-favourites", typeof selectedStation === 'object' ? selectedStation?.stationId : selectedStation, selectedMenuHeaderId],
    queryFn: async () => {
      const stationId = typeof selectedStation === 'object' ? selectedStation?.stationId : selectedStation;
      const url = SUBGROUP_ITEMS_URL(0, 0, stationId);
      const res = await axiosInstance.get(url);
      return res.data;
    },
    enabled: showAllFavorites && isFavoriteItems && !!selectedStation,
  });
  useEffect(() => {
    console.log("allFavouritesData", allFavouritesData);
  }, [allFavouritesData])

  useEffect(() => {
    console.log("[Menu] subgroupItems response:", subgroupItems);
  }, [subgroupItems]);

  useEffect(() => {
    console.log("selectedMainGroup", selectedMainGroup);

  }, [selectedMainGroup])
  // 3. Search endpoint
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ["menu-search", debouncedSearch, selectedMenuHeaderId, isFavoriteItems],
    queryFn: async () => {
      const term = debouncedSearch.trim();
      if (!term) return [];
      const url = SEARCH_URL(term);
      if (!url) return getDummySearchResults(term);
      try {
        const res = await axiosInstance.get(url);
        return res.data;
      } catch (err) {
        // API returns 404 with { message: "No matching items found" } when nothing matches
        const isNoResults =
          err?.response?.status === 404 &&
          err?.response?.data?.message === "No matching items found";
        if (isNoResults) return [];
        throw err;
      }
    },
    enabled: debouncedSearch.trim().length > 0,
    retry: (failureCount, err) => {
      // Don't retry on 404 with "No matching items found" — it's an expected "no results" response
      const isNoResults =
        err?.response?.status === 404 &&
        err?.response?.data?.message === "No matching items found";
      if (isNoResults) return false;
      return failureCount < 2;
    },
  });
  console.log("userrrr", user);


  const isLoading = isGroupsLoading || (!!selectedSubgroup && isItemsLoading) || (!!debouncedSearch.trim() && isSearchLoading);

  // Sync available stations and flatten items
  // useEffect(() => {
  //   const activeItems = [];
  //   if (debouncedSearch.trim() && searchResults) {
  //     searchResults.forEach((mg) => {
  //       mg?.subGroups?.forEach((sg) => {
  //         sg?.Items?.forEach((item) => {
  //           activeItems.push(item);
  //         });
  //       });
  //     });
  //   } else if (subgroupItems) {
  //     activeItems.push(...subgroupItems);
  //   }

  //   if (activeItems.length > 0) {
  //     const stationsSet = new Set();
  //     activeItems.forEach((item) => {
  //       item?.ItemPrices?.forEach((priceObj) => {
  //         if (priceObj?.StationName) stationsSet.add(priceObj.StationName);
  //       });
  //     });
  //     setProduct(activeItems);
  //     // setAvailableStations(Array.from(stationsSet));
  //   }
  // }, [subgroupItems, searchResults, debouncedSearch, setProduct, setAvailableStations]);

  // Auto-select first category and subgroup or reset if invalid
  useEffect(() => {
    // Don't auto-select while "All Favourites" view is active
    if (showAllFavorites) return;

    if (groupsData && groupsData.length > 0) {
      if (selectedMainGroupID === null) {
        const savedMainId = localStorage.getItem("menu_mainGroupId");
        const savedSubId = localStorage.getItem("menu_subGroupId");

        if (savedMainId) {
          const mainIdInt = parseInt(savedMainId);
          const subIdInt = savedSubId ? parseInt(savedSubId) : null;
          const foundMain = groupsData.find(g => g.mainGroupID === mainIdInt);

          if (foundMain) {
            setSelectedMainGroupID(mainIdInt);
            setSelectedMainGroup(foundMain);
            setSelectedMainGroupIndex(groupsData.findIndex(g => g.mainGroupID === mainIdInt));

            if (subIdInt) {
              const foundSub = foundMain.subGroups?.find(s => s.subGroupID === subIdInt);
              if (foundSub) {
                setSelectedSubgroup(foundSub);
                return;
              }
            }
            if (foundMain.subGroups?.length > 0) {
              setSelectedSubgroup(foundMain.subGroups[0]);
            } else {
              setSelectedSubgroup(null);
            }
            return;
          }
        }
      }

      const isValidSelection = groupsData.some(g => g.mainGroupID === selectedMainGroupID);
      if (selectedMainGroupID === null || !isValidSelection) {
        const validGroupIndex = groupsData.findIndex(g => g?.subGroups?.length > 0);
        const targetIndex = validGroupIndex !== -1 ? validGroupIndex : 0;
        const targetGroup = groupsData[targetIndex];

        setSelectedMainGroupIndex(targetIndex);
        setSelectedMainGroupID(targetGroup?.mainGroupID ?? null);
        setSelectedMainGroup(targetGroup);

        if (targetGroup?.subGroups?.length > 0) {
          setSelectedSubgroup(targetGroup.subGroups[0]);
        } else {
          setSelectedSubgroup(null);
        }
      }
    } else if (groupsData && groupsData.length === 0) {
      setSelectedMainGroupIndex(0);
      setSelectedMainGroupID(null);
      setSelectedMainGroup(null);
      setSelectedSubgroup(null);
    }
  }, [groupsData, selectedMainGroupID, showAllFavorites]);

  // Persist selections to localStorage
  useEffect(() => {
    if (selectedMainGroupID) {
      localStorage.setItem("menu_mainGroupId", selectedMainGroupID);
    }
  }, [selectedMainGroupID]);

  useEffect(() => {
    if (selectedSubgroup) {
      localStorage.setItem("menu_subGroupId", selectedSubgroup.subGroupID);
    }
  }, [selectedSubgroup]);

  // category click handler
  const onCategoryClick = (idx, group) => {
    setSearch("");
    setShowAllFavorites(false);
    setSelectedMainGroupIndex(idx);
    setSelectedMainGroupID(group?.mainGroupID ?? null);
    setSelectedMainGroup(group ?? null);
    if (group?.subGroups?.length > 0) {
      setSelectedSubgroup(group.subGroups[0]);
    } else {
      setSelectedSubgroup(null);
    }
    setIsMobileGroupsOpen(false);

    if (menuContentRef.current) {
      menuContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollMobileNav = (direction) => {
    mobileNavRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  const getPriceInfo = (item) => {
    const stationName = typeof selectedStation === 'object'
      ? selectedStation?.stationName
      : selectedStation;
    if (stationName) {
      const stationPrice = item?.ItemPrices?.find((p) => p.StationName === stationName);
      if (stationPrice?.itemPriceUSD) {
        return { price: parseFloat(stationPrice.itemPriceUSD), label: stationName };
      }
    }
    return { price: parseFloat(item?.itemPriceUSD || 0), label: "Base Price" };
  };

  const sidebarGroups = useMemo(() => {
    return groupsData || [];
  }, [groupsData]);



  const updateTimeoutRef = useRef(null);
  const pendingUpdateRef = useRef(null);

  function handleAddItems(item, qty) {
    const { isArrival, isDeparture } = useProductStore.getState();
    const { selectedOrder } = useCartStore.getState();

    if (!user) {
      onlineOrderToast.error(langText.pleaseLoginFirst?.[lang]);
      navigate("/login");
      return;
    }
    if (!selectedOrder) {
      onlineOrderToast.error(langText.pleaseSelectOrderOrCreateANewOne?.[lang]);
      return;
    }

    const addedQty = +qty || 1;
    const queryKey = ['orderDetails', selectedOrder?.orderHeaderId];

    // 1. Read latest state directly from cache to avoid stale closures during rapid clicks
    const currentCache = queryClient.getQueryData(queryKey) || [];
    const existingOrderObj = currentCache[0] || {};
    const existingDetails = existingOrderObj.details || [];

    // Search for an existing item
    const existingItem = existingDetails.find(
      (d) =>
        d.orderDetailsItemId === item?.itemID &&
        d.orderDetailsIsArrival === isArrival &&
        d.orderDetailsIsDepartur === isDeparture
    );

    let newDetails;

    if (existingItem) {
      const newQty = existingItem.orderDetailsQty + addedQty;
      newDetails = existingDetails.map((d) => {
        if (
          d.orderDetailsItemId === item?.itemID &&
          d.orderDetailsIsArrival === isArrival &&
          d.orderDetailsIsDepartur === isDeparture
        ) {
          return {
            ...d,
            OrderDetailsHeaderId: selectedOrder?.orderHeaderId,
            orderDetailsQty: newQty,
            orderDetailsPrintedQty: newQty,
            orderDetailsLineTotalUsd: newQty * (Number(item?.itemPriceUSD) || 0)
          };
        }
        return {
          ...d,
          OrderDetailsHeaderId: selectedOrder?.orderHeaderId,
        };
      });
    } else {
      const items = existingDetails.map((d) => ({
        ...d,
        OrderDetailsHeaderId: selectedOrder?.orderHeaderId,
      }));

      newDetails = [
        ...items,
        {
          orderDetailsId: 0,
          OrderDetailsHeaderId: selectedOrder?.orderHeaderId,
          orderDetailsName: item?.ItemName || item?.itemName,
          orderDetailsItemId: item?.itemID,
          orderDetailsPackingId: 1,
          orderDetailsReplaceItem: false,
          orderDetailsSalesComment: "",
          orderDetailsQty: addedQty,
          orderDetailsPrintedQty: addedQty,
          orderDetailsKitchineReply: "",
          OrderDetailsPcking: "Standard Packing",
          orderDetailsIsArrival: isArrival,
          orderDetailsIsDepartur: isDeparture,
          orderDetailsDescription: item?.itemDescription,
          OrderDetailsCurrencyPrice: Number(item?.itemPriceUSD),
          OrderDetailsUnitName: item?.itemMegurment || "",
          OrderDetailsName: item?.itemName || item?.ItemName,
          orderDetailsPriceUsd: Number(item?.itemPriceUSD),
          orderDetailsLineTotalUsd: addedQty * Number(item?.itemPriceUSD)
        },
      ];
    }

    // 2. Optimistic Update: Instantly update the cart UI
    const newCache = [{ ...existingOrderObj, details: newDetails }];
    queryClient.setQueryData(queryKey, newCache);

    // Track the latest data payload for the API
    pendingUpdateRef.current = newDetails;

    // 3. Debounce the actual API call
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const dataToSend = pendingUpdateRef.current;
      if (!dataToSend) return;

      UpdataDetailsMutation.mutate(dataToSend, {
        onSuccess: () => {
          // onlineOrderToast.success(langText.itemAddedSuccessfully?.[lang], { id: "cart_update" });
          queryClient.invalidateQueries({ queryKey: ["order-details", selectedOrder?.orderHeaderId] });
          queryClient.invalidateQueries({ queryKey: ['myOrders'] });
          queryClient.invalidateQueries({ queryKey: ['orderDetails', selectedOrder?.orderHeaderId] });
        },
        onError: (error) => {
          console.log("error", error);
          onlineOrderToast.error(langText.failedToAddItem?.[lang], { id: "cart_update" });
          // Revert optimistic update by refetching on failure
          queryClient.invalidateQueries({ queryKey: ['orderDetails', selectedOrder?.orderHeaderId] });
        },
        onMutate: () => {
          onlineOrderToast.loading(langText.addingItem?.[lang], { id: "cart_update" });
        }
      });

      pendingUpdateRef.current = null;
    }, 1500);
  }
  useEffect(() => {
    console.log(selectedOrder, "selectedOrder menu");
  }, [selectedOrder]);


  // if (isLoading) return (

  //   <div className="w-full flex font-sans mx-auto lg:pl-[25%]">
  //     <Loading />
  //   </div>
  // )

  const isSearching = search.trim().length > 0;
  const noResults = isSearching && data.length === 0;

  const handleToggleFavourite = (e, item) => {
    e.stopPropagation();
    const itemId = item?.itemID || item?.ItemID;
    if (favouritedItems[itemId]) {
      // Already a favourite → remove it
      removeFavouriteMutation.mutate(itemId);
    } else {
      // Not a favourite → add it
      addFavouriteMutation.mutate(itemId);
    }
  };

  const renderMenuItem = (item) => {
    const price = parseFloat(item.itemPriceUSD || 0);
    return (
      <div
        id={`menu-item-${item.itemID}`}
        className="group relative bg-white p-4 flex flex-col justify-between border border-gray-100 rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer min-h-[100px]"
        key={item.itemID}
        onClick={() => {
          setSelectedItem(item);
          setIsItemModalOpen(true);
        }}
      >
        {/* Modern Tooltip for Description & Measurement */}
        {(item?.itemDescription || item?.itemMegurment) && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] w-max max-w-[240px] bg-secondary text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none p-3 scale-95 group-hover:scale-100 origin-bottom">
            {/* Arrow pointing down */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary"></div>

            <div className="flex flex-col gap-1.5 text-center">
              {item?.itemDescription && (
                <p className="text-white/90 leading-relaxed font-medium">
                  {item.itemDescription}
                </p>
              )}
              {item?.itemMegurment && (
                <p className="text-primary font-bold">
                  {item.itemMegurment}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Left: name + price */}
          <div className="flex flex-col flex-1 min-w-0 gap-1 ">
            <h3 className="text-[15px] font-bold text-slate-800 leading-snug line-clamp-2 pb-2">
              {item?.itemName}
            </h3>
            {user ? (
              <div id="guide-menu-prices" className="text-left">
                <p className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
                  ${price.toFixed(2)}
                </p>
                <p className="text-[9px] text-gray-400 font-medium tracking-wider whitespace-nowrap mt-0.5">
                  USD &bull; {item.stationName}
                </p>
              </div>
            ) : (
              <div
                className="flex items-center text-gray-400 bg-gray-50 p-2 rounded-full gap-1.5 w-fit"
                title={langText.pleaseLoginFirst?.[lang] || "Login required"}
              >
                <FaLock className="text-xs" />
                <span className="font-bold text-xs">$</span>
              </div>
            )}
          </div>

          {/* Right: heart on top, plus below */}
          <div className="flex flex-col justify-end items-center gap-1.5 shrink-0 h-full">
            {user && (
              <button
                className={`w-8 h-8 sm:w-9 sm:h-9 flex cursor-pointer items-center justify-center rounded-full border transition-all active:scale-95 ${favouritedItems[item?.itemID || item?.ItemID]
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-400"
                  }`}
                onClick={(e) => handleToggleFavourite(e, item)}
                aria-label="Add to favourites"
                title={lang === "EN" ? "Add to favourites" : "أضف إلى المفضلة"}
              >
                <FaHeart className="text-xs" />
              </button>
            )}
            <button
              className="w-8 h-8 sm:w-9 sm:h-9 flex cursor-pointer items-center justify-center bg-primary text-white rounded-full hover:bg-[#b08848] active:scale-95 transition-all shadow-sm shadow-primary/30"
              onClick={(e) => {
                e.stopPropagation();
                handleAddItems(item, 1);
              }}
              aria-label="Add to cart"
            >
              <FaPlus className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    console.log("selectedOrder-menu", selectedOrder);

    if (selectedOrder?.orderHeaderIsArrival && selectedOrder?.orderHeaderIsDeparture) {
      return
    }
    if (selectedOrder?.orderHeaderIsArrival) {
      console.log("selectedOrder-menu-arrival");
      setIsArrivalAndDeparture(true, false)
    }
    if (selectedOrder?.orderHeaderIsDeparture) {
      console.log("selectedOrder-menu-departure");
      setIsArrivalAndDeparture(false, true)
    }
  }, [selectedOrder]);

  return (
    <div dir={lang === 'AR' ? 'rtl' : 'ltr'} className="w-full flex font-sans max-w-[1400px] mx-auto">
      {/* Sidebar */}
      <div className="lg:w-1/4 hidden lg:block pe-6 relative">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-5 flex flex-col sticky top-3 z-40">
          <p className="text-slate-800 font-bold text-lg mb-4 tracking-tight px-2">
            {langText.categories?.[lang]}
          </p>
          <div className="flex flex-col gap-1.5">
            {isGroupsLoading ? (
              <BiLoaderAlt className="animate-spin mx-auto my-10 text-primary" size={30} />
            ) : (
              <>
                {/* "All" — first item, only visible in favourites mode */}
                {isFavoriteItems && (
                  <button
                    onClick={() => {
                      setShowAllFavorites(true);
                      setSelectedMainGroupID(null);
                      setSelectedSubgroup(null);
                      setSelectedMainGroup(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 flex items-center justify-between gap-2 ${showAllFavorites
                      ? 'bg-primary/10 text-primary border-l-[3px] border-primary shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-slate-700 border-l-[3px] border-transparent'
                      }`}
                  >
                    <span className="truncate">{lang === 'AR' ? 'الكل' : 'All'}</span>
                    <span className={`shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${showAllFavorites ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {favouriteIdsData?.length ?? 0}
                    </span>
                  </button>
                )}

                {sidebarGroups.map((mainGroup) => {
                  const isActive = mainGroup?.mainGroupID === selectedMainGroupID;
                  return (
                    <div
                      key={mainGroup?.mainGroupID}
                      className="relative"
                      onMouseEnter={() => setHoveredGroupId(mainGroup?.mainGroupID)}
                      onMouseLeave={() => setHoveredGroupId(null)}
                    >
                      <button
                        onClick={() => {
                          const realIdx = sidebarGroups.findIndex(
                            (g) => g.mainGroupID === mainGroup.mainGroupID
                          );
                          if (realIdx !== -1) onCategoryClick(realIdx, mainGroup);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 flex items-center justify-between gap-2 ${isActive
                          ? "bg-primary/10 text-primary border-l-[3px] border-primary shadow-sm"
                          : "text-gray-500 hover:bg-gray-50 hover:text-slate-700 border-l-[3px] border-transparent"
                          }`}
                      >
                        <div className="flex justify-between w-full">
                          <span className="truncate">{mainGroup?.mainGroupName}</span>
                          <span className={`shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${isActive
                            ? "bg-primary/20 text-primary"
                            : "bg-gray-100 text-gray-400"
                            }`}>
                            {mainGroup?.groupItemCount}
                          </span>
                        </div>
                      </button>

                      {/* Mega-menu Popup */}
                      {hoveredGroupId === mainGroup?.mainGroupID && (
                        <div className="absolute left-[92%] -top-2 ml-2 w-[500px] max-w-[calc(100vw-300px)] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 transition-all duration-250">
                          <p className="text-[10px] tracking-wider text-gray-400 font-bold mb-2">
                            {lang === 'AR' ? 'التصنيفات الفرعية' : 'Subcategories'}
                          </p>
                          <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto cutom-scroll">
                            {mainGroup?.subGroups?.map((sub) => (
                              <button
                                key={sub.subGroupID}
                                onClick={() => {
                                  setSearch("");
                                  setShowAllFavorites(false);
                                  setSelectedSubgroup(sub);
                                  setSelectedMainGroupID(mainGroup.mainGroupID);
                                  setSelectedMainGroupIndex(
                                    sidebarGroups.findIndex(g => g.mainGroupID === mainGroup.mainGroupID)
                                  );
                                  setHoveredGroupId(null);
                                  setSelectedMainGroup(mainGroup);
                                }}
                                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex justify-between w-full ${selectedSubgroup?.subGroupID === sub.subGroupID
                                  ? "bg-primary/10 text-primary"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-slate-900"
                                  }`}
                              >
                                <span>{sub.subGroupName}</span>
                                <span className={`shrink-0 h-fit self-start text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${selectedSubgroup?.subGroupID === sub.subGroupID
                                  ? "bg-primary/20 text-primary"
                                  : "bg-gray-100 text-gray-400"
                                  }`}>
                                  {sub?.itemCount}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={menuContentRef} className="lg:w-3/4 w-full lg:px-2 flex flex-col gap-6 scroll-mt-24">
        {/* Mobile Categories */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 rounded-2xl">
          <div className="flex items-center gap-2 px-3 py-3">
            {/* Bars Button */}
            <button
              onClick={() => setIsMobileGroupsOpen(true)}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center shadow-sm"
            >
              <FaBars />
            </button>

            {/* Horizontal Categories */}
            <div
              ref={mobileNavRef}
              className="flex-1 overflow-x-auto whitespace-nowrap"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="flex gap-2">
                {sidebarGroups.map((mainGroup) => {
                  const isActive = mainGroup.mainGroupID === selectedMainGroupID;
                  return (
                    <button
                      key={mainGroup.mainGroupID}
                      ref={(el) => {
                        categoryRefs.current[mainGroup.mainGroupID] = el;
                      }}
                      onClick={() => {
                        const realIdx = sidebarGroups.findIndex(
                          (g) => g.mainGroupID === mainGroup.mainGroupID
                        );
                        if (realIdx !== -1) {
                          onCategoryClick(realIdx, mainGroup);
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${isActive
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {mainGroup.mainGroupName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Menu Header Filter Buttons */}
        {user && (
          <div className="flex flex-wrap w-full gap-2">
            {
              (favouriteIdsData?.length > 0 || customerMenus?.[0]?.customerMenuHeaders?.length > 0) &&
              <button
                onClick={() => { setSelectedMenuHeaderId(null); setIsFavoriteItems(false); setShowAllFavorites(false); }}
                className={`flex-1 min-w-[150px] md:min-w-[25%] flex items-center justify-center px-4 h-[42px] rounded-full text-sm font-semibold transition-all border ${selectedMenuHeaderId === null && isFavoriteItems === false
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-secondary border-gray-200 hover:border-primary hover:text-primary'
                  }`}
              >
                {lang === 'AR' ? 'القائمة الأساسية' : 'Basic Menu'}
              </button>
            }
            {customerMenus?.[0]?.customerMenuHeaders?.length > 0 && customerMenus[0].customerMenuHeaders.map((header, i) => (
              <button
                key={header.customerMenuHeaderId}
                onClick={() => { setSelectedMenuHeaderId(header.customerMenuHeaderId); setIsFavoriteItems(false) }}
                className={`flex-1 min-w-[150px] md:min-w-[25%] flex items-center justify-center px-4 h-[42px] rounded-full text-sm font-semibold transition-all border ${selectedMenuHeaderId === header.customerMenuHeaderId && isFavoriteItems === false
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-secondary border-gray-200 hover:border-primary hover:text-primary'
                  }`}
              >
                {/* {header.customerMenuHeaderStationName || header.customerMenuHeaderCustomerName || `#${header.customerMenuHeaderId}`} */}
                {`Special Menu ${i + 1}`}
              </button>
            ))}
            {favouriteIdsData?.length > 0 && (
              <button
                onClick={() => { setIsFavoriteItems(true); setShowAllFavorites(false); }}
                className={`flex-1 min-w-[150px] md:min-w-[25%] flex items-center justify-center gap-1.5 px-4 h-[42px] rounded-full text-sm font-semibold transition-all border ${selectedMenuHeaderId === null && isFavoriteItems === true
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-secondary border-gray-200 hover:border-primary hover:text-primary'
                  }`}
              >
                <FaHeart className={`text-[10px] ${selectedMenuHeaderId === null && isFavoriteItems ? 'text-white' : 'text-red-400'}`} />
                {lang === 'AR' ? 'المفضلة' : 'My Favorites'}
              </button>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative w-full shadow-sm rounded-xl overflow-hidden bg-white border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            dir={lang === 'AR' ? 'rtl' : 'ltr'}
            placeholder={langText.searchMenuItems?.[lang]}
            className={`w-full h-12 p-3 outline-none text-slate-700 placeholder-gray-400 text-sm ${lang === 'AR' ? 'pl-12 text-right' : 'pr-12 text-left'}`}
          />
          <div className={`absolute ${lang === 'AR' ? 'left-0 border-r' : 'right-0 border-l'} top-0 h-full w-12 flex items-center justify-center bg-gray-50 border-gray-100`}>
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="flex items-center justify-center w-full h-full cursor-pointer text-gray-400 hover:text-primary transition-colors"
                aria-label="Clear search"
              >
                <IoIosClose className="text-2xl" />
              </button>
            ) : (
              <IoIosSearch className="text-gray-400 text-xl" />
            )}
          </div>
        </div>

        {user &&
          selectedOrder?.orderHeaderIsArrival && selectedOrder?.orderHeaderIsDeparture &&
          (
            <div style={{ direction: 'ltr' }} className="flex justify-end ">
              <div className="flex w-full">
                <button className={`rounded-l-full px-3 py-3 border text-white flex-1 transition-all duration-300 hover:text-sm ${isArrival ? 'bg-primary' : 'bg-secondary'}`} onClick={() => setIsArrivalAndDeparture(true, false)}><span>🛬</span>
                  {lang === 'AR' ? 'وصول' : 'Arrival'}
                </button>
                <button className={`rounded-r-full px-3 py-3 border border-r-0 text-white flex-1 transition-all duration-300 hover:text-sm ${isDeparture ? 'bg-primary' : 'bg-secondary'}`} onClick={() => setIsArrivalAndDeparture(false, true)}><span>🛫</span>
                  {lang === 'AR' ? 'مغادرة' : 'Departure'}</button>
              </div>
            </div>
          )}

        {/* All Favourites Results */}
        {!debouncedSearch.trim() && isFavoriteItems && showAllFavorites && (
          <div className="space-y-0">
            {isAllFavLoading ? (
              <div className="flex justify-center py-10">
                <Loading />
              </div>
            ) : !Array.isArray(allFavouritesData) || allFavouritesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FaHeart className="text-gray-300 text-2xl" />
                </div>
                <p className="text-primary font-semibold text-lg">
                  {lang === 'AR' ? 'لا توجد عناصر مفضلة' : 'No favourite items found'}
                </p>
              </div>
            ) : (
              allFavouritesData.map((group) =>
                group.subGroups?.map((sub) => (
                  <div key={`${group.mainGroupID}-${sub.subGroupID}`} className="rounded-2xl px-5 py-2">
                    <h3 className="text-[17px] font-bold text-white pb-2">
                      {group.mainGroupName} <span className="text-primary">({sub.subGroupName})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {sub.items?.map((item) => renderMenuItem(item))}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}

        {/* 3-Column Responsive Grid Content */}
        {!debouncedSearch.trim() && selectedSubgroup && !showAllFavorites && (
          <div className="rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-base font-bold text-primary">
                {selectedSubgroup.subGroupName}
              </h3>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loading />
              </div>
            ) : (() => {
              const activeItems = subgroupItems?.subGroups?.find(
                (sg) => sg.subGroupID === selectedSubgroup?.subGroupID
              )?.items ?? subgroupItems?.subGroups?.[0]?.items ?? [];

              if (!activeItems || activeItems.length === 0) {
                return (
                  <div className="text-center py-10 text-gray-400">
                    {lang === 'AR' ? 'لا توجد عناصر' : 'No items found'}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {activeItems.map((item) => renderMenuItem(item))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Search Results rendering */}
        {debouncedSearch.trim() && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loading />
              </div>
            ) : !searchResults || searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <IoIosSearch className="text-gray-300 text-3xl" />
                </div>
                <p className="text-primary font-semibold text-lg">{langText.noItemFound?.[lang]}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {langText.tryDifferentSearchTerm?.[lang]}
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {searchResults.map((group) => (
                  group.subGroups?.map((sub) => (
                    <div key={`${group.mainGroupID}-${sub.subGroupID}`} className="rounded-2xl px-5 py-2  ">
                      <h3 className="text-[17px] font-bold text-white  pb-2">
                        {group.mainGroupName} <span className="text-primary">({sub.subGroupName})</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {sub.items?.map((item) => renderMenuItem(item))}
                      </div>
                    </div>
                  ))
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Groups Popup Bottom Sheet */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMobileGroupsOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isMobileGroupsOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileGroupsOpen(false)}
        />

        {/* Bottom Sheet */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 transition-transform duration-300 h-[75vh] flex flex-col ${isMobileGroupsOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="px-4 pt-3 pb-3 border-b shrink-0">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-800 font-bold text-base">
                  {langText.categories?.[lang]}
                </p>
              </div>
              <button
                onClick={() => setIsMobileGroupsOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold"
                aria-label="Close groups"
              >
                ×
              </button>
            </div>
          </div>

          <div
            className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-2"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
              touchAction: "pan-y",
            }}
          >
            {sidebarGroups.map((mainGroup) => {
              const isActive = mainGroup.mainGroupID === selectedMainGroupID;
              const isExpanded = expandedMobileGroupId === mainGroup.mainGroupID;

              return (
                <div key={mainGroup.mainGroupID} className="flex flex-col gap-1 border-b border-gray-50 pb-2 last:border-b-0">
                  <button
                    onClick={() => {
                      setExpandedMobileGroupId(isExpanded ? null : mainGroup.mainGroupID);
                    }}
                    className={`text-left px-4 py-3 rounded-xl border flex justify-between items-center ${isActive
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <span className="font-bold">{mainGroup.mainGroupName}</span>
                    <span className="text-[11px] text-gray-400">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="pl-4 pr-2 py-1 flex flex-col gap-1.5 bg-gray-50/50 rounded-xl mt-1">
                      {mainGroup.subGroups?.map((sub) => (
                        <button
                          key={sub.subGroupID}
                          onClick={() => {
                            setSearch("");
                            setSelectedSubgroup(sub);
                            setSelectedMainGroupID(mainGroup.mainGroupID);
                            setSelectedMainGroupIndex(
                              sidebarGroups.findIndex(g => g.mainGroupID === mainGroup.mainGroupID)
                            );
                            setIsMobileGroupsOpen(false);
                          }}
                          className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${selectedSubgroup?.subGroupID === sub.subGroupID
                            ? "bg-primary/20 text-primary"
                            : "text-gray-600"
                            }`}
                        >
                          {sub.subGroupName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isItemModalOpen && selectedItem && (
          <ProductDetailsModal
            item={selectedItem}
            priceInfo={getPriceInfo(selectedItem)}
            user={user}
            selectedOrder={selectedOrder}
            lang={lang}
            addToCart={addToCart}
            navigate={navigate}
            onClose={() => setIsItemModalOpen(false)}
            orderDetails={orderDetails}
            UpdataDetailsMutation={UpdataDetailsMutation}
            queryClient={queryClient}
            isArrival={isArrival}
            isDeparture={isDeparture}
            addFavouriteMutation={addFavouriteMutation}
            removeFavouriteMutation={removeFavouriteMutation}
            favouritedItems={favouritedItems}
            onToggleFavourite={handleToggleFavourite}
          />
        )}
      </AnimatePresence>
    </div >
  );
}

export default Menu;
