import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaBuilding,
  FaPlane,
  FaMapMarkerAlt,
  FaLock,
  FaChevronDown,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaUsers
} from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { MdAirplanemodeActive, MdDeliveryDining } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

// Stores
import useAuthStore from "../../assets/store/authStore";
import { useCartStore } from "../../assets/store/cartStore";
import { useLangStore } from "../../assets/store/langStore";
import { useStationStore } from "../../assets/store/stationStore";

// APIs
import { getMyOrders, getOrderDetails } from "../../assets/apis/order/OrderApi";
import { UpdateOrderDetails, DeleteOrderItemAirCatering } from "../../assets/apis/product/PeoductApi";

// Constants & Helpers
import { langText, toArabicNumbers } from "../../assets/constants/lang";
import Loading from "../loading/Loading";
import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";
import orderMutation from "../../assets/apis/order/OrderMutation";
import { HomeHero, RunningOrder } from "../home/Home";
import { useRef } from "react";
import CheckoutSuccessModal from "../../components/CheckoutSuccessModal";
import FinalConfirmationSuccessModal from "../../components/FinalConfirmationSuccessModal";
import { useGuide } from "../../context/GuideContext";

export default function Cart() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFinalConfirmPopup, setShowFinalConfirmPopup] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { lang } = useLangStore();
  const { user } = useAuthStore();
  const { guideEnabled } = useGuide();
  const { selectedOrder: storeSelectedOrder, setSelectedOrder: setStoreSelectedOrder } = useCartStore();
  const { setSelectedStation } = useStationStore();

  const [localSelectedOrder, setLocalSelectedOrder] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const ordersScrollRef = useRef(null);
  const updateTimeoutRef = useRef(null);
  const pendingUpdateRef = useRef(null);

  function InfoRow({ icon, label, value }) {
    if (!value && value !== 0) return null;
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        {icon && <div className="opacity-60 text-[#9b9b9b] shrink-0 flex items-center">{icon}</div>}
        <div className="flex flex-col text-[10px] leading-[1.2] min-w-0 flex-1">
          <span className="text-[#9b9b9b] font-medium tracking-wide truncate">{label}</span>
          <span className="font-bold text-[#49494A] text-[11px] truncate mt-[1px]" title={String(value)}>{value}</span>
        </div>
      </div>
    );
  }

  const { CheckOutMutation, finalConfirmationMutation } = orderMutation({ onClose: () => { } })

  const selectedOrder = localSelectedOrder || storeSelectedOrder;

  // 1. Get All Orders
  const { data: myOrders, isLoading: isOrdersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['myOrders', "active"],
    queryFn: () => getMyOrders("active"),
    retry: 5,
    refetchInterval: 1000 * 60 * 1,
    enabled: !!user,
  });
  useEffect(() => {
    console.log("selectedOrder", selectedOrder)
  }, [selectedOrder]);

  // Automatically select the first order if none is selected
  useEffect(() => {
    // Treat myOrders or dummy data
    const orders = (myOrders && myOrders.length > 0) ? myOrders : (guideEnabled ? [{ header: { orderHeaderId: "DUMMY-ID" } }] : null);
    if (orders && orders.length > 0 && !selectedOrder) {
      const initialOrder = orders[0]?.header || orders[0];
      setLocalSelectedOrder(initialOrder);
      setStoreSelectedOrder(initialOrder);
    }
  }, [myOrders, selectedOrder, setStoreSelectedOrder, guideEnabled]);

  // Sync selectedOrder with fresh myOrders data after every refetch (price updates, etc.)
  useEffect(() => {
    if (!myOrders || !selectedOrder) return;
    const freshHeader = myOrders.find(
      (o) => (o?.header?.orderHeaderId ?? o?.orderHeaderId) === selectedOrder.orderHeaderId
    );
    if (!freshHeader) return;
    const freshOrder = freshHeader?.header ?? freshHeader;
    // Only update if something actually changed to avoid infinite loops
    if (JSON.stringify(freshOrder) !== JSON.stringify(selectedOrder)) {
      setLocalSelectedOrder(freshOrder);
      setStoreSelectedOrder(freshOrder);
    }
  }, [myOrders]); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Get Selected Order Items Details
  const { data: orderDetails, isLoading: orderDetailsLoading, refetch: orderDetailsRefetch } = useQuery({
    queryKey: ["orderDetails", selectedOrder?.orderHeaderId],
    queryFn: () => getOrderDetails(selectedOrder?.orderHeaderId),
    retry: 5,
    enabled: !!user && !!selectedOrder,
  });

  // Extract items list safely
  const detailsArray = useMemo(() => {
    if (guideEnabled && selectedOrder?.orderHeaderId === "DUMMY-ID") {
      return [
        {
          orderDetailsId: "DUMMY-ITEM-1",
          orderDetailsName: "Demo Hot Meal",
          orderDetailsNameAr: "وجبة ساخنة تجريبية",
          orderDetailsPriceUsd: 15.00,
          orderDetailsQty: 2,
          orderDetailsGrossUsd: 30.00,
          OrderDetailsUnitName: "Portion",
          orderDetailsIsArrival: true,
          orderDetailsIsDepartur: false,
          orderDetailsItemGroupName: "Demo Items"
        }
      ];
    }
    if (!orderDetails) return [];
    if (Array.isArray(orderDetails)) {
      if (Array.isArray(orderDetails[0]?.details)) return orderDetails[0].details;
      return orderDetails;
    }
    if (Array.isArray(orderDetails.details)) return orderDetails.details;
    return [];
  }, [orderDetails, guideEnabled, selectedOrder]);

  const groupedDetails = useMemo(() => {
    const groups = {};
    const fallbackGroup = lang === 'AR' ? 'أخرى' : 'Other';
    detailsArray.forEach(item => {
      const groupName = item.orderDetailsItemGroupName ? item.orderDetailsItemGroupName.trim() : '';
      const key = groupName || fallbackGroup;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }, [detailsArray, lang]);


  // Mutation to update item (qty & type)
  const updateItemMutation = useMutation({
    mutationFn: (payload) => UpdateOrderDetails(payload),
    onSuccess: () => {
      orderDetailsRefetch();
      refetchOrders();
      onlineOrderToast.success(lang === "EN" ? "Item updated successfully" : "تم تحديث العنصر بنجاح");
    },
    borderColor: "#C5A76D",
    onError: (error) => {
      console.error("Update item error:", error);
      onlineOrderToast.error(lang === "EN" ? "Failed to update item" : "فشل تحديث العنصر");
    },
    onSettled: () => {
      setUpdatingItemId(null);
    },
  });

  // Mutation to delete/void item
  const deleteItemMutation = useMutation({
    mutationFn: (detailsId) => DeleteOrderItemAirCatering(detailsId),
    onSuccess: () => {
      orderDetailsRefetch();
      refetchOrders();
      onlineOrderToast.success(lang === "EN" ? "Item removed successfully" : "تم حذف العنصر بنجاح");
    },
    onError: (error) => {
      console.error("Delete item error:", error);
      onlineOrderToast.error(lang === "EN" ? "Failed to remove item" : "فشل حذف العنصر");
    },
    onSettled: () => {
      setUpdatingItemId(null);
    },
  });

  // Handle Order Selection
  const handleSelectOrder = (order) => {
    const orderHeader = order?.header || order;
    setLocalSelectedOrder(orderHeader);
    setStoreSelectedOrder(orderHeader);
  };

  // Handle Edit Quantity
  const handleEditQuantity = (item, change) => {
    const newQty = item.orderDetailsQty + change;
    if (newQty <= 0) {
      handleDeleteItem(item.orderDetailsId);
      return;
    }

    const payload = [
      {
        orderDetailsId: item.orderDetailsId,
        orderDetailsHeaderId: selectedOrder?.orderHeaderId,
        orderDetailsItemId: item.orderDetailsItemId,
        orderDetailsName: item.orderDetailsName,
        orderDetailsPcking: item.OrderDetailsPcking || "Standard Packing",
        orderDetailsQty: newQty,
        orderDetailsPackingId: item.orderDetailsPackingId || 1,
        orderDetailsCurrencyPrice: item.orderDetailsPriceUsd,
        OrderDetailsUnitName: item.OrderDetailsUnitName || "Standard Unit",
        OrderDetailsUnitId: item.OrderDetailsUnitId || 1,
        orderDetailsMigerment: item.orderDetailsMigerment || "Pcs",
        orderDetailsIsArrival: item.orderDetailsIsArrival,
        orderDetailsIsDepartur: item.orderDetailsIsDepartur,
        _itemsAdds: item.orderDetailsAddons?.map((addon) => ({
          foodMenuItemAddsId: addon.foodMenuItemAddsId,
          foodMenuItemAddsName: addon.foodMenuItemAddsName,
        })) || [],
      },
    ];

    // Optimistic Update
    const queryKey = ["orderDetails", selectedOrder?.orderHeaderId];
    const previousDetails = queryClient.getQueryData(queryKey);

    if (previousDetails) {
      if (Array.isArray(previousDetails)) {
        if (Array.isArray(previousDetails[0]?.details)) {
          const updatedDetailsArray = previousDetails[0].details.map(d => d.orderDetailsId === item.orderDetailsId ? { ...d, orderDetailsQty: newQty } : d);
          queryClient.setQueryData(queryKey, [{ ...previousDetails[0], details: updatedDetailsArray }]);
        } else {
          const updatedDetailsArray = previousDetails.map(d => d.orderDetailsId === item.orderDetailsId ? { ...d, orderDetailsQty: newQty } : d);
          queryClient.setQueryData(queryKey, updatedDetailsArray);
        }
      } else if (Array.isArray(previousDetails.details)) {
        const updatedDetailsArray = previousDetails.details.map(d => d.orderDetailsId === item.orderDetailsId ? { ...d, orderDetailsQty: newQty } : d);
        queryClient.setQueryData(queryKey, { ...previousDetails, details: updatedDetailsArray });
      }
    }

    setUpdatingItemId(item.orderDetailsId);

    // Debounce the actual API call
    pendingUpdateRef.current = payload;

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const dataToSend = pendingUpdateRef.current;
      if (!dataToSend) return;
      updateItemMutation.mutate(dataToSend);
    }, 3000);
  };

  // Handle Toggle Type (Arrival vs Departure)
  const handleToggleType = (item) => {
    // if (selectedOrder?.orderHeaderAirCatringEndOrder) {
    //   onlineOrderToast.error(lang === "EN" ? "Order Closed" : "تم إغلاق الطلب");
    //   return;
    // }
    const newIsArrival = !item.orderDetailsIsArrival;
    const newIsDepartur = !newIsArrival;

    const payload = [
      {
        orderDetailsId: item.orderDetailsId,
        orderDetailsHeaderId: selectedOrder?.orderHeaderId,
        orderDetailsItemId: item.orderDetailsItemId,
        orderDetailsName: item.orderDetailsName,
        orderDetailsPcking: item.OrderDetailsPcking || "Standard Packing",
        orderDetailsQty: item.orderDetailsQty,
        orderDetailsPackingId: item.orderDetailsPackingId || 1,
        orderDetailsCurrencyPrice: item.orderDetailsPriceUsd,
        OrderDetailsUnitName: item.OrderDetailsUnitName || "Standard Unit",
        OrderDetailsUnitId: item.OrderDetailsUnitId || 1,
        orderDetailsMigerment: item.orderDetailsMigerment || "Pcs",
        orderDetailsIsArrival: newIsArrival,
        orderDetailsIsDepartur: newIsDepartur,
        _itemsAdds: item.orderDetailsAddons?.map((addon) => ({
          foodMenuItemAddsId: addon.foodMenuItemAddsId,
          foodMenuItemAddsName: addon.foodMenuItemAddsName,
          // foodMenuItemAddsPriceEgp: addon.foodMenuItemAddsPriceUsd ?? addon.foodMenuItemAddsPriceEgp,
        })) || [],
      },
    ];

    setUpdatingItemId(item.orderDetailsId);
    updateItemMutation.mutate(payload);
  };

  // Handle Delete Item
  const handleDeleteItem = (detailsId) => {
    // if (selectedOrder?.orderHeaderAirCatringEndOrder) {
    //   onlineOrderToast.error(lang === "EN" ? "Order Closed" : "تم إغلاق الطلب");
    //   return;
    // }
    setUpdatingItemId(detailsId);
    deleteItemMutation.mutate(detailsId);
  };

  // Date Parsing Helper
  const parseDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isFinite(d.getTime()) ? d : null;
  };

  // Format Date
  const formatArrival = (d) => {
    if (!d) return "";
    return d.toLocaleString(lang === "AR" ? "ar-EG" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Status helper logic
  const getStatusConfig = (orderHeader) => {
    const rawArrival = orderHeader?.orderHeaderDeliveryDateTime;
    const arrivalDate = parseDate(rawArrival);
    const isOrderDelay = arrivalDate && arrivalDate < new Date();
    const isOrderOnHisWay = orderHeader?.orderHeaderStatusID === 8;
    const isOrderDelivered = orderHeader?.orderHeaderStatusID > 8 && orderHeader?.orderHeaderStatusID < 10;
    const isOrderCancelled = orderHeader?.orderHeaderStatusID >= 10;

    if (isOrderOnHisWay) {
      return { label: langText.onHisWay?.[lang] || "On His Way", color: "#2F7D46", bg: "#EEF6F0", pulse: true };
    }
    if (isOrderCancelled) {
      return { label: langText.orderCancelled?.[lang] || "Cancelled", color: "#B54848", bg: "#FAECEC", pulse: false };
    }
    if (isOrderDelay) {
      return { label: lang === "EN" ? "Delayed" : "متأخر", color: "#B54848", bg: "#FAECEC", pulse: false };
    }
    if (isOrderDelivered) {
      return { label: langText.delivered?.[lang] || "Delivered", color: "#2F7D46", bg: "#EEF6F0", pulse: false };
    }
    return { label: langText.processing?.[lang] || "Processing", color: "#B88E52", bg: "#F7F3EA", pulse: true };
  };

  useEffect(() => {
    console.log("detailsArray: ", detailsArray);
  }, [detailsArray]);
  function handleCheckOut(order) {
    console.log("order", order);

    CheckOutMutation.mutate(order?.orderHeaderId, {
      onSuccess: () => {
        setShowSuccessPopup(true);
      }
    });
  }

  if (isOrdersLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <Loading fullScreen={true} />
      </div>
    );
  }

  // Safe checks for empty lists
  const displayOrders = (myOrders && myOrders.length > 0)
    ? myOrders
    : (guideEnabled ? [
      {
        header: {
          orderHeaderId: "DUMMY-ID",
          orderHeaderOrderNumber: "DUMMY-1234",
          orderHeaderCurrentStatus: lang === "EN" ? "New" : "جديد",
          orderHeaderStatusID: 1,
          orderHeaderAirCatringCretionDate: new Date().toISOString(),
          orderHeaderDeliveryDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          orderHeaderFlightNumberName: "FL-000",
          orderHeaderAcregName: "REG-000",
          orderHeaderStationName: selectedStation?.stationName || "Station",
          orderHeaderMount: "0.00",
          orderHeaderGrossUsd: 150.50,
          orderHeaderOperatorName: "Demo Operator",
          orderHeaderActypeName: "B737",
          orderHeaderIsArrival: true,
          orderHeaderIsDepartur: true,
          orderHeaderFlightArrivalDatTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          orderHeaderArrivalDeliveryDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
          orderHeaderDepatrialDateTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          orderHeaderArrivalPaxnum: 150,
          orderHeaderArrivalCrewNum: 5,
          orderHeaderPaxnum: 150,
          orderHeaderCrewNum: 5,
          orderHeaderAgentName: "Demo Agent",
          orderHeaderBillToName: "Demo Billing Co.",
        }
      }
    ] : []);
  const ordersList = displayOrders;

  // Conditional field arrays for the order info grid
  const isArrival = !!selectedOrder?.orderHeaderIsArrival;
  const isDeparture = !!(selectedOrder?.orderHeaderIsDeparture || selectedOrder?.orderHeaderIsDepartur);
  const isBoth = isArrival && isDeparture;
  const isArrivalOnly = isArrival && !isDeparture;
  const isDepartureOnly = isDeparture && !isArrival;

  const cartCol1Fields = selectedOrder ? [
    ...(isArrival ? [
      { icon: <FaMapMarkerAlt className="text-primary text-xs" />, label: lang === "EN" ? "Arrival Date & Time" : "تاريخ ووقت الوصول", value: selectedOrder.orderHeaderFlightArrivalDatTime ? formatArrival(parseDate(selectedOrder.orderHeaderFlightArrivalDatTime)) : "—" },
      { icon: <MdDeliveryDining className="text-primary text-xs" />, label: lang === "EN" ? "Arrival Delivery Date & Time" : "وقت التوصيل عند الوصول", value: selectedOrder.orderHeaderArrivalDeliveryDate ? formatArrival(parseDate(selectedOrder.orderHeaderArrivalDeliveryDate)) : "—" },
    ] : []),
    ...(isDeparture ? [
      { icon: <MdDeliveryDining className="text-primary text-xs" />, label: lang === "EN" ? "Departure/Delivery Date & Time" : "تاريخ ووقت التوصيل", value: selectedOrder.orderHeaderDeliveryDateTime ? formatArrival(parseDate(selectedOrder.orderHeaderDeliveryDateTime)) : "—" },
      { icon: <FaMapMarkerAlt className="text-primary text-xs" />, label: lang === "EN" ? "Departure Date & Time" : "تاريخ ووقت الاقلاع", value: selectedOrder.orderHeaderDepatrialDateTime ? formatArrival(parseDate(selectedOrder.orderHeaderDepatrialDateTime)) : "—" },
    ] : []),
    ...(isBoth ? [{ icon: <FaMapMarkerAlt className="text-primary text-xs" />, label: lang === "EN" ? "Station (Airport)" : "المحطة (المطار)", value: selectedOrder.orderHeaderStationName || "—" }] : []),
    ...(isArrivalOnly ? [
      { icon: <FaUsers className="text-primary text-xs" />, label: lang === "EN" ? "Arrival Passengers" : "ركاب الوصول", value: lang === "EN" ? (selectedOrder.orderHeaderArrivalPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalPaxnum || 0) },
      { icon: <FaUsers className="text-primary text-xs" />, label: lang === "EN" ? "Arrival Crew" : "طاقم الوصول", value: lang === "EN" ? (selectedOrder.orderHeaderArrivalCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalCrewNum || 0) },
    ] : []),
    ...(isDepartureOnly ? [
      { icon: <FaUsers className="text-primary text-xs" />, label: lang === "EN" ? "Departure Passengers" : "ركاب المغادرة", value: lang === "EN" ? (selectedOrder.orderHeaderPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderPaxnum || 0) },
      { icon: <FaUsers className="text-primary text-xs" />, label: lang === "EN" ? "Departure Crew" : "طاقم المغادرة", value: lang === "EN" ? (selectedOrder.orderHeaderCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderCrewNum || 0) },
    ] : []),
  ] : [];

  const cartCol2Fields = selectedOrder ? [
    { icon: <FaPlane className="text-primary text-xs" />, label: lang === "EN" ? "Flight Number" : "رقم الرحلة", value: selectedOrder.orderHeaderFlightNumberName || "—" },
    { icon: <FaPlane className="text-primary text-xs" />, label: lang === "EN" ? "Aircraft Reg" : "تسجيل الطائرة", value: selectedOrder.orderHeaderAcregName || "—", highlight: true },
    { icon: <FaPlane className="text-primary text-xs" />, label: lang === "EN" ? "Aircraft Type" : "نوع الطائرة", value: selectedOrder.orderHeaderActypeName || "—" },
    ...((isArrivalOnly || isDepartureOnly) ? [{ icon: <FaMapMarkerAlt className="text-primary text-xs" />, label: lang === "EN" ? "Station (Airport)" : "المحطة (المطار)", value: selectedOrder.orderHeaderStationName || "—" }] : []),
    ...(isBoth ? [
      { icon: <FaUsers className="text-primary text-xs" />, label: lang === "EN" ? "Arrival Passengers" : "ركاب الوصول", value: lang === "EN" ? (selectedOrder.orderHeaderArrivalPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalPaxnum || 0) },
      { icon: <FaUsers className="text-primary text-xs" />, label: lang === "EN" ? "Arrival Crew" : "طاقم الوصول", value: lang === "EN" ? (selectedOrder.orderHeaderArrivalCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalCrewNum || 0) },
    ] : []),
  ] : [];

  const cartCol3Fields = selectedOrder ? [
    ...(isBoth ? [
      { icon: <FaUsers className="text-primary text-xs" />, label: lang === "EN" ? "Departure Passengers" : "ركاب المغادرة", value: lang === "EN" ? (selectedOrder.orderHeaderPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderPaxnum || 0) },
      { icon: <FaUsers className="text-primary text-xs" />, label: lang === "EN" ? "Departure Crew" : "طاقم المغادرة", value: lang === "EN" ? (selectedOrder.orderHeaderCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderCrewNum || 0) },
    ] : []),
    { icon: <FaBuilding className="text-primary text-xs" />, label: lang === "EN" ? "Agent" : "الوكيل", value: selectedOrder?.orderHeaderAgentName || "—" },
    { icon: <FaBuilding className="text-primary text-xs" />, label: lang === "EN" ? "Operator" : "المشغل", value: selectedOrder?.orderHeaderOperatorName || "—" },
    { icon: <FaBuilding className="text-primary text-xs" />, label: lang === "EN" ? "Bill To" : "الفاتورة لـ", value: selectedOrder?.orderHeaderBillToName || "—" },
  ] : [];

  return (
    <div className="min-h-screen bg-transparent text-white font-sans">
      <HomeHero lang={lang} />
      <div className="max-w-[1440px] mx-auto space-y-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              {lang === "EN" ? "Flight Catering Cart" : "سلة تموين الطيران"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {lang === "EN"
                ? "Manage and edit multiple active flight quotations and orders in real-time."
                : "إدارة وتعديل عروض الأسعار والطلبات الجوية النشطة المتعددة في الوقت الفعلي."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
              {lang === "EN" ? "Orders Count:" : "عدد الطلبات:"} {lang === "EN" ? ordersList.length : toArabicNumbers(ordersList.length)}
            </span>
          </div>
        </div>

        {/* TOP SECTION: Horizontal Carousel / Scrollable container of Orders */}
        {(ordersList.length === 0 && !guideEnabled) ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-light-gray text-center p-6 shadow-sm">
            <img src="/images/empty-cart.svg" alt="No Orders" className="w-40 mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-secondary">
              {lang === "EN" ? "No Flight Orders Found" : "لا توجد طلبات طيران"}
            </h3>
            <p className="text-sm text-gray max-w-sm mt-1">
              {lang === "EN"
                ? "You don't have any active flight orders at the moment."
                : "ليس لديك أي طلبات طيران نشطة في الوقت الحالي."}
            </p>
            <button
              onClick={() => navigate("/home")}
              className="mt-6 px-6 py-2.5 rounded-full bg-primary hover:opacity-90 text-white font-bold text-sm transition-all duration-300 shadow-md cursor-pointer"
            >
              {lang === "EN" ? "Go to Menu" : "الذهاب إلى القائمة"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-wider text-primary uppercase text-xs">
              {lang === "EN" ? "Active Flight Orders" : "طلبات الطيران النشطة"}
            </h2>

            <div className="relative w-full">
              {/* Left Arrow */}
              <button
                onClick={() => ordersScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-[#E5E5E5] shadow-md flex items-center justify-center text-[#C5A76D] hover:bg-white transition-all cursor-pointer -translate-x-3"
                aria-label="Scroll left"
              >
                <FaChevronLeft size={14} />
              </button>

              {/* Scrollable Track */}
              <div
                id="guide-cart-orders-list"
                ref={ordersScrollRef}
                className="flex items-stretch overflow-x-auto gap-0 scroll-smooth snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {[...ordersList]
                  .sort((a, b) => new Date(b?.header?.orderHeaderAirCatringCretionDate ?? 0) - new Date(a?.header?.orderHeaderAirCatringCretionDate ?? 0))
                  .map((orderItem, index) => (
                    <div key={index} className="flex-shrink-0 w-[90vw] sm:w-[360px] snap-start" style={{ display: 'flex', flexDirection: 'column' }}>
                      <RunningOrder
                        order={orderItem}
                        selectedOrder={selectedOrder}
                        setSelectedOrder={handleSelectOrder}
                        setSelectedStation={setSelectedStation}
                      />
                    </div>
                  ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => ordersScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-[#E5E5E5] shadow-md flex items-center justify-center text-[#C5A76D] hover:bg-white transition-all cursor-pointer translate-x-3"
                aria-label="Scroll right"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: Split Layout (Active Order details left, Items right) */}
        {selectedOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: Active Order Header Details */}
            <div className="lg:col-span-2 space-y-6">
              <div id="guide-cart-order-info" className="bg-white border border-light-gray rounded-2xl p-6 relative overflow-hidden shadow-sm">


                {/* Header title */}
                <div className="flex items-center justify-between border-b border-light-gray pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                      <MdAirplanemodeActive className="text-primary text-2xl rotate-45" />
                      {lang === "EN" ? `Quotation Details` : `تفاصيل عرض السعر`}
                    </h2>
                    <p className="text-xs text-gray mt-1">
                      {lang === "EN" ? "Overview of flight header information" : "نظرة عامة على معلومات ترويسة الرحلة"}
                    </p>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-[#F6F4EF] border border-light-gray rounded-lg text-xs font-bold text-primary">
                      {lang === "EN" ? selectedOrder.orderHeaderOrderNumber : toArabicNumbers(selectedOrder.orderHeaderOrderNumber)}
                    </span>
                  </div>
                </div>

                {/* Metadata Grid — conditional columns based on order type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  <div className="flex flex-col gap-4">
                    {cartCol1Fields.map((field, idx) => (
                      <div key={idx} style={{ height: '80px', minHeight: '80px' }} className="bg-[#FBFBFA] border border-light-gray px-4 rounded-xl hover:shadow-sm transition-all duration-300 flex flex-col justify-center gap-1 overflow-hidden">
                        <span className="text-[10px] text-gray uppercase tracking-widest font-semibold flex items-center gap-1.5 truncate">
                          {field.icon}
                          {field.label}
                        </span>
                        <p className={`text-sm font-semibold truncate ${field.highlight ? "text-primary" : "text-secondary"}`}>{field.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    {cartCol2Fields.map((field, idx) => (
                      <div key={idx} style={{ height: '80px', minHeight: '80px' }} className="bg-[#FBFBFA] border border-light-gray px-4 rounded-xl hover:shadow-sm transition-all duration-300 flex flex-col justify-center gap-1 overflow-hidden">
                        <span className="text-[10px] text-gray uppercase tracking-widest font-semibold flex items-center gap-1.5 truncate">
                          {field.icon}
                          {field.label}
                        </span>
                        <p className={`text-sm font-semibold truncate ${field.highlight ? "text-primary" : "text-secondary"}`}>{field.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    {cartCol3Fields.map((field, idx) => (
                      <div key={idx} style={{ height: '80px', minHeight: '80px' }} className="bg-[#FBFBFA] border border-light-gray px-4 rounded-xl hover:shadow-sm transition-all duration-300 flex flex-col justify-center gap-1 overflow-hidden">
                        <span className="text-[10px] text-gray uppercase tracking-widest font-semibold flex items-center gap-1.5 truncate">
                          {field.icon}
                          {field.label}
                        </span>
                        <p className={`text-sm font-semibold truncate ${field.highlight ? "text-primary" : "text-secondary"}`}>{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Cost Card summary inside detail */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#FBFBFA] to-white border border-light-gray flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-gray block">
                      {lang === "EN" ? "Grand Net Price" : "السعر الإجمالي الصافي"}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {lang === "EN"
                        ? `${(selectedOrder.orderHeaderGrossUsd || 0).toFixed(2)} USD`
                        : `${toArabicNumbers((selectedOrder.orderHeaderGrossUsd || 0).toFixed(2))} دولار`}
                    </span>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => navigate(-1)}
                      className="px-5 py-2 rounded-full border border-light-gray bg-white text-secondary font-semibold text-xs hover:bg-[#F6F4EF] transition duration-300 cursor-pointer"
                    >
                      {langText.goBack[lang]}
                    </button>
                    <button
                      onClick={() => navigate(`/order/${selectedOrder.orderHeaderId}`)}
                      className="px-5 py-2 rounded-full font-bold text-white text-xs border border-primary bg-primary hover:opacity-90 transition duration-300 cursor-pointer"
                    >
                      {lang === "EN" ? "View Full Order" : "عرض الطلب بالكامل"}
                    </button>
                    {!selectedOrder?.orderHeaderAirCatringEndOrder && (
                      <button
                        onClick={() => handleCheckOut(selectedOrder)}
                        className="px-5 py-2 rounded-full font-bold text-white text-xs border border-primary bg-primary hover:opacity-90 transition duration-300 cursor-pointer"
                      >
                        {langText.sendToSkyCulinaire[lang]}
                      </button>
                    )}
                    {selectedOrder?.orderHeaderStatusID == 23 && (
                      <button
                        onClick={() => finalConfirmationMutation.mutate(selectedOrder.orderHeaderId, {
                          onSuccess: () => {
                            setShowFinalConfirmPopup(true);
                          }
                        })}
                        className="px-5 py-2 rounded-full font-bold text-white text-xs border border-primary bg-primary hover:opacity-90 transition duration-300 cursor-pointer"
                      >
                        {langText.finalConfirmation[lang]}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN (Sidebar Panel): Items List Sidebar */}
            <div className="space-y-6">
              <div id="guide-cart-order-items" className="bg-white border border-light-gray rounded-2xl shadow-sm flex flex-col h-[700px]">

                {/* Header */}
                <div className="bg-[#F6F4EF] border-b border-light-gray p-4 rounded-t-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold tracking-wider text-secondary uppercase">
                      {lang === "EN" ? "Order Items" : "أصناف الطلب"}
                    </h3>
                    <span className="text-xs text-gray">
                      {lang === "EN" ? `${detailsArray.length} items` : `${toArabicNumbers(detailsArray.length)} أصناف`}
                    </span>
                  </div>
                  {orderDetailsLoading && (
                    <AiOutlineLoading3Quarters className="animate-spin text-primary" />
                  )}
                </div>

                {/* Items Container: Grouped by orderDetailsItemGroupName */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 cutom-scroll">
                  {orderDetailsLoading && detailsArray.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-gray">
                      <AiOutlineLoading3Quarters className="animate-spin text-2xl text-primary mb-2" />
                      <p className="text-xs">{lang === "EN" ? "Loading items..." : "جاري تحميل الأصناف..."}</p>
                    </div>
                  ) : detailsArray.length === 0 ? (
                    <div className="text-center py-16 text-gray">
                      <p className="text-xs">{lang === "EN" ? "No items in this order" : "لا توجد أصناف في هذا الطلب"}</p>
                    </div>
                  ) : (
                    Object.entries(groupedDetails).map(([groupName, items]) => (
                      <div key={groupName} className="space-y-4">
                        {/* Group Header */}
                        <div className="text-[10px] font-bold uppercase tracking-wider text-primary bg-[#FBFBFA] px-3 py-1.5 rounded-lg border border-light-gray shadow-sm inline-block">
                          {groupName}
                        </div>

                        {/* Group Items List */}
                        <div className="space-y-4 divide-y divide-light-gray">
                          {items.map((item, idx) => {
                            const isUpdating = updatingItemId === item.orderDetailsId;
                            const hasAddons = item.orderDetailsAddons && item.orderDetailsAddons.length > 0;

                            return (
                              <div
                                key={item.orderDetailsId || idx}
                                className={`pt-4 first:pt-0 flex flex-col gap-3 relative transition-all duration-300 ${isUpdating ? "opacity-40 pointer-events-none" : ""
                                  }`}
                              >
                                {/* Name and Price */}
                                <div className="flex gap-3">
                                  <div className="flex-1 space-y-0.5">
                                    <h4 className="text-sm font-semibold text-secondary line-clamp-2">
                                      {lang === "EN"
                                        ? item.orderDetailsName
                                        : item.orderDetailsNameAr || item.orderDetailsName}
                                    </h4>
                                    <p className="text-xs text-gray">
                                      {lang === "EN"
                                        ? `Price: ${(item.orderDetailsPriceUsd || 0).toFixed(2)} USD`
                                        : `السعر: ${toArabicNumbers((item.orderDetailsPriceUsd || 0).toFixed(2))} دولار`}
                                    </p>
                                    {item.OrderDetailsUnitName && (
                                      <span className="text-[10px] text-gray font-medium">
                                        {lang === "EN" ? `Unit: ${item.OrderDetailsUnitName}` : `الوحدة: ${item.OrderDetailsUnitName}`}
                                      </span>
                                    )}
                                  </div>

                                  {/* Line Total */}
                                  <div className="text-right">
                                    <span className="text-xs text-gray block">
                                      {lang === "EN" ? "Total" : "الإجمالي"}
                                    </span>
                                    <span className="text-sm font-bold text-primary">
                                      {lang === "EN"
                                        ? `${(item.orderDetailsGrossUsd || 0).toFixed(2)}`
                                        : `${toArabicNumbers((item.orderDetailsGrossUsd || 0).toFixed(2))}`}
                                    </span>
                                  </div>
                                </div>

                                {/* Addons preview if any */}
                                {hasAddons && (
                                  <div className="bg-[#FBFBFA] p-2 rounded-lg border border-light-gray text-[11px] space-y-1">
                                    <span className="text-gray font-semibold">
                                      {lang === "EN" ? "Addons:" : "الإضافات:"}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {item.orderDetailsAddons.map((addon, aIdx) => (
                                        <span key={addon.foodMenuItemAddsId || aIdx} className="bg-white border border-light-gray text-secondary px-2 py-0.5 rounded-full">
                                          {lang === "EN" ? addon.foodMenuItemAddsName : addon.foodMenuItemAddsName_Ar || addon.foodMenuItemAddsName} (+{lang === "EN" ? (addon.foodMenuItemAddsPriceUsd ?? addon.foodMenuItemAddsPriceEgp) : toArabicNumbers(addon.foodMenuItemAddsPriceUsd ?? addon.foodMenuItemAddsPriceEgp)} {lang === "EN" ? "USD" : "دولار"})
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Interactive Controls Row */}
                                <div className="flex items-center justify-between bg-[#FBFBFA] p-2.5 rounded-xl border border-light-gray gap-3">

                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-3">
                                    <button
                                      disabled={isUpdating}
                                      onClick={() => handleEditQuantity(item, -1)}
                                      className="w-7 h-7 rounded-lg bg-white border border-light-gray flex items-center justify-center hover:bg-[#F6F4EF] transition cursor-pointer text-xs"
                                    >
                                      <FaMinus className="text-secondary" />
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center text-primary">
                                      {lang === "EN" ? item.orderDetailsQty : toArabicNumbers(item.orderDetailsQty)}
                                    </span>
                                    <button
                                      disabled={isUpdating}
                                      onClick={() => handleEditQuantity(item, 1)}
                                      className="w-7 h-7 rounded-lg bg-white border border-light-gray flex items-center justify-center hover:bg-[#F6F4EF] transition cursor-pointer text-xs"
                                    >
                                      <FaPlus className="text-primary" />
                                    </button>
                                  </div>

                                  {/* Arrival / Departure Toggle Button */}
                                  {isBoth && <div className="flex items-center gap-1.5">
                                    <button
                                      disabled={isUpdating}
                                      onClick={() => handleToggleType(item)}
                                      className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 transition duration-300 border cursor-pointer uppercase"
                                      style={{
                                        backgroundColor: item.orderDetailsIsArrival ? "rgba(197, 167, 109, 0.15)" : "transparent",
                                        borderColor: item.orderDetailsIsArrival ? "var(--color-primary)" : "var(--color-light-gray)",
                                        color: item.orderDetailsIsArrival ? "var(--color-primary)" : "var(--color-gray)",
                                      }}
                                    >
                                      <span>🛬</span>
                                      <span>{lang === "EN" ? "Arr" : "وصول"}</span>
                                    </button>

                                    <button
                                      disabled={isUpdating}
                                      onClick={() => handleToggleType(item)}
                                      className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 transition duration-300 border cursor-pointer uppercase"
                                      style={{
                                        backgroundColor: item.orderDetailsIsDepartur ? "rgba(197, 167, 109, 0.15)" : "transparent",
                                        borderColor: item.orderDetailsIsDepartur ? "var(--color-primary)" : "var(--color-light-gray)",
                                        color: item.orderDetailsIsDepartur ? "var(--color-primary)" : "var(--color-gray)",
                                      }}
                                    >
                                      <span>🛫</span>
                                      <span>{lang === "EN" ? "Dep" : "مغادرة"}</span>
                                    </button>
                                  </div>}

                                  {/* Void / Delete Control */}
                                  <button
                                    disabled={isUpdating}
                                    onClick={() => handleDeleteItem(item.orderDetailsId)}
                                    className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition flex items-center justify-center text-red-600 cursor-pointer"
                                    title={lang === "EN" ? "Void Item" : "حذف الصنف"}
                                  >
                                    <FaTrash className="text-xs" />
                                  </button>

                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal Summary footer for sidebar */}
                {!!selectedOrder.orderHeaderNetUsd && (
                  <div className="bg-[#FDFDFD] border-t border-light-gray p-4 rounded-b-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray">
                      <span>{lang === "EN" ? "Items subtotal" : "إجمالي الأصناف"}</span>
                      <span className="text-secondary font-semibold">
                        {lang === "EN"
                          ? `${(selectedOrder.orderHeaderNetUsd || 0).toFixed(2)} USD`
                          : `${toArabicNumbers((selectedOrder.orderHeaderNetUsd || 0).toFixed(2))} دولار`}
                      </span>
                    </div>
                    {!!selectedOrder.orderHeaderTransportaion &&
                      <div className="flex items-center justify-between text-xs text-gray">
                        <span>{lang === "EN" ? "Transportation" : "النقل"}</span>
                        <span className="text-secondary font-semibold">
                          {lang === "EN"
                            ? `${(selectedOrder.orderHeaderTransportaion || 0).toFixed(2)} USD`
                            : `${toArabicNumbers((selectedOrder.orderHeaderTransportaion || 0).toFixed(2))} دولار`}
                        </span>
                      </div>}

                    {!!selectedOrder.orderHeaderAirportCost &&
                      <div className="flex items-center justify-between text-xs text-gray">
                        <span>{lang === "EN" ? "Airport Fees" : "رسوم المطار"}</span>
                        <span className="text-secondary font-semibold">
                          {lang === "EN"
                            ? `${(selectedOrder.orderHeaderAirportCost || 0).toFixed(2)} USD`
                            : `${toArabicNumbers((selectedOrder.orderHeaderAirportCost || 0).toFixed(2))} دولار`}
                        </span>
                      </div>}
                    {!!selectedOrder.orderHeaderHandling &&
                      <div className="flex items-center justify-between text-xs text-gray">
                        <span>{lang === "EN" ? "Handling Fees" : "رسوم المناولة"}</span>
                        <span className="text-secondary font-semibold">
                          {lang === "EN"
                            ? `${(selectedOrder.orderHeaderHandling || 0).toFixed(2)} USD`
                            : `${toArabicNumbers((selectedOrder.orderHeaderHandling || 0).toFixed(2))} دولار`}
                        </span>
                      </div>
                    }
                    {!!selectedOrder.orderHeaderDiscount &&
                      <div className="flex text-red-400 items-center justify-between text-xs">
                        <span>{lang === "EN" ? "Discount" : "الخصم"}</span>
                        <span className="font-semibold">
                          {lang === "EN"
                            ? ` (${toArabicNumbers((selectedOrder.orderHeaderDiscountPercent || 0).toFixed(2))} %) ${(selectedOrder.orderHeaderDiscount || 0).toFixed(2)} USD`
                            : `(${toArabicNumbers((selectedOrder.orderHeaderDiscountPercent || 0).toFixed(2))} %) ${toArabicNumbers((selectedOrder.orderHeaderDiscount || 0).toFixed(2))} دولار `}
                        </span>
                      </div>
                    }
                    <hr className="border-light-gray" />
                    <div className="flex items-center justify-between text-xs text-gray">
                      <span className="font-bold">{lang === "EN" ? "Grand Total" : "الإجمالي الكلي"}</span>
                      <span className="text-primary text-xl font-extrabold">
                        {lang === "EN"
                          ? `${(selectedOrder.orderHeaderGrossUsd || 0).toFixed(2)} USD`
                          : `${toArabicNumbers((selectedOrder.orderHeaderGrossUsd || 0).toFixed(2))} دولار`}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
      <CheckoutSuccessModal
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        lang={lang}
      />
      <FinalConfirmationSuccessModal
        isOpen={showFinalConfirmPopup}
        onClose={() => setShowFinalConfirmPopup(false)}
        lang={lang}
      />
    </div>
  );
}
