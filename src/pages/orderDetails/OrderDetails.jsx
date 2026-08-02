import React, { useState, useMemo, useEffect } from "react";
import { useGuide } from "../../context/GuideContext";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders, getOrderById, getOrderDetails, CancelOrderAirCatering, AddOrderToArchive, RestoreFromArchive } from "../../assets/apis/order/OrderApi";
import { useLangStore } from "../../assets/store/langStore";
import { toArabicNumbers, langText } from "../../assets/constants/lang";
import orderMutation from "../../assets/apis/order/OrderMutation";
import { motion } from "framer-motion";
import Loading from "../loading/Loading";
import { FaArrowLeft, FaArrowRight, FaPlane, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaFileInvoiceDollar, FaBuilding, FaPlus } from "react-icons/fa";
import { MdDeliveryDining, MdTimeline } from "react-icons/md";
import { HomeHero } from "../home/Home";
import { FaTrash, FaMinus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useProductMutation from "../../assets/apis/product/ProductMutation";
import { getMyFlightNumbers, getMyRegistrations, getMyAirCrafts, getMyAgent, getMyOperators, getMyBillTo } from "../../assets/apis/order/OrderApi";
import { GetPayTypes, GetStationsList } from "../../assets/apis/PurchasingAPI";
import CustomLookup from "../../components/HelperComponents/CustomLookup";
import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";
import { DeleteOrderItemAirCatering } from "../../assets/apis/product/PeoductApi";
import CheckoutSuccessModal from "../../components/CheckoutSuccessModal";
import FinalConfirmationSuccessModal from "../../components/FinalConfirmationSuccessModal";
import OrderInvoicePrint from "../../components/OrderInvoicePrint";



export default function OrderDetails() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFinalConfirmPopup, setShowFinalConfirmPopup] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showConfirmDecisionsModal, setShowConfirmDecisionsModal] = useState(false);


  const { id } = useParams();
  const navigate = useNavigate();
  const { CheckOutMutation, finalConfirmationMutation, submitClientDecisionMutation } = orderMutation({ onClose: () => { } });

  function handleCheckOut(order) {
    console.log("order", order);
    CheckOutMutation.mutate(order?.orderHeaderId, {
      onSuccess: () => {
        setShowSuccessPopup(true);
      }
    });
  }
  const { lang } = useLangStore();
  const [activeTab, setActiveTab] = useState("All");
  const [isEditMode, setIsEditMode] = useState(false);
  const { guideEnabled } = useGuide();
  const [editedHeader, setEditedHeader] = useState({});
  const [updatingItemId, setUpdatingItemId] = useState(null);
  // clientDecisions: keyed by orderDetailsId
  // value: { decisionType: "APPROVE_ALTERNATIVE" | "REJECT", orderDetailQty: number }
  const [clientDecisions, setClientDecisions] = useState({});
  const queryClient = useQueryClient();

  const cancelOrderMutation = useMutation({
    mutationFn: ({ quatId, reason }) => CancelOrderAirCatering({ quatId, reason }),
    onSuccess: () => {
      onlineOrderToast.success(lang === "EN" ? "Order cancelled successfully." : "تم إلغاء الطلب بنجاح.");
      setShowCancelModal(false);
      setCancelReason("");
      queryClient.invalidateQueries(["orderInfo", id]);
    },
    onError: (err) => {
      onlineOrderToast.error(
        lang === "EN"
          ? "Failed to cancel order. " + (err.response?.data?.message || err.message)
          : "فشل في إلغاء الطلب. " + (err.response?.data?.message || err.message)
      );
    }
  });

  const archiveOrderMutation = useMutation({
    mutationFn: (orderHeaderId) => AddOrderToArchive(orderHeaderId),
    onSuccess: () => {
      onlineOrderToast.success(lang === "EN" ? "Order sent to archive." : "تم إرسال الطلب إلى الأرشيف.");
      queryClient.invalidateQueries(["orderInfo", id]);
      queryClient.invalidateQueries(["myOrders"]);
    },
    onError: (err) => {
      onlineOrderToast.error(
        lang === "EN"
          ? "Failed to archive order. " + (err.response?.data?.message || err.message)
          : "فشل في أرشفة الطلب. " + (err.response?.data?.message || err.message)
      );
    },
  });

  const restoreOrderMutation = useMutation({
    mutationFn: (orderHeaderId) => RestoreFromArchive(orderHeaderId),
    onSuccess: () => {
      onlineOrderToast.success(lang === "EN" ? "Order restored from archive." : "تم استعادة الطلب من الأرشيف.");
      queryClient.invalidateQueries(["orderInfo", id]);
      queryClient.invalidateQueries(["myOrders"]);
    },
    onError: (err) => {
      onlineOrderToast.error(
        lang === "EN"
          ? "Failed to restore order. " + (err.response?.data?.message || err.message)
          : "فشل في استعادة الطلب. " + (err.response?.data?.message || err.message)
      );
    },
  });

  const handleCancelClick = () => {
    if (isOrderLocked) {
      onlineOrderToast.error(
        lang === "EN"
          ? "This order is already in progress and cannot be cancelled."
          : "لا يمكن إلغاء الطلب لأنه قيد التنفيذ بالفعل."
      );
      return;
    }
    setShowCancelModal(true);
  };

  const { UpdateOrderHeaderMutation, UpdataDetailsMutation } = useProductMutation();
  const deleteItemMutation = useMutation({
    mutationFn: (detailsId) => DeleteOrderItemAirCatering(detailsId),
  });

  const { data: flightNumbers } = useQuery({ queryKey: ["flightNumbers"], queryFn: getMyFlightNumbers, enabled: isEditMode });
  const { data: registrations } = useQuery({ queryKey: ["registrations"], queryFn: getMyRegistrations, enabled: isEditMode });
  const { data: airCrafts } = useQuery({ queryKey: ["airCrafts"], queryFn: getMyAirCrafts, enabled: isEditMode });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: getMyAgent, enabled: isEditMode });
  const { data: operators } = useQuery({ queryKey: ["operators"], queryFn: getMyOperators, enabled: isEditMode });
  const { data: stations } = useQuery({ queryKey: ["stations"], queryFn: GetStationsList, enabled: isEditMode });
  const { data: billTos } = useQuery({ queryKey: ["billTos"], queryFn: getMyBillTo, enabled: isEditMode });
  // We only enable dropdowns in edit mode to save initial load time



  const { data: orderInfo, isLoading: isOrderInfoLoading } = useQuery({
    queryKey: ["orderInfo", id],
    queryFn: () => getOrderById(id),
    retry: 3,
    refetchInterval: 1000 * 60 * 1,
  });

  useEffect(() => {
    console.log("orderInfo", orderInfo);
  }, [orderInfo]);

  const selectedOrder = useMemo(() => {
    if (!orderInfo || !orderInfo.length) return null;
    return orderInfo[0]?.header;
  }, [orderInfo]);

  const trackingSteps = useMemo(() => {
    if (!orderInfo || !orderInfo.length) return [];
    return orderInfo[0]?.tracking || [];
  }, [orderInfo]);

  const currentTrackingStatus = useMemo(() => {
    if (!trackingSteps.length) return null;
    const currentIndex = trackingSteps.findIndex(s => !s.completed);
    if (currentIndex !== -1) {
      return trackingSteps[currentIndex].name;
    } else {
      return lang === "EN" ? "Completed" : "مكتمل";
    }
  }, [trackingSteps, lang]);

  // Lock editing once the order moves past "Placed" (i.e., index 0).
  // Steps are ordered: Placed(0) → In Progress(1) → ... → Delivered(6).
  // currentIndex === 0 means only "Placed" is the current step → edit allowed.
  // currentIndex >= 1 or all completed (-1) → edit locked.
  const isOrderLocked = useMemo(() => {
    if (!trackingSteps.length) return false;
    const currentIndex = trackingSteps.findIndex(s => !s.completed);
    // currentIndex === 0  → still at "Placed" → editable
    // currentIndex >= 1   → "In Progress" or later → locked
    // currentIndex === -1 → all completed → locked
    return currentIndex !== 0;
  }, [trackingSteps]);

  const handleEditClick = () => {
    if (isOrderLocked) {
      onlineOrderToast.error(
        lang === "EN"
          ? "This order is already in progress and cannot be edited."
          : "لا يمكن تعديل الطلب لأنه قيد التنفيذ بالفعل."
      );
      return;
    }
    setIsEditMode(true);
  };

  // 3. Fetch specific details & addons for the resolved header
  const { data: orderDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["orderDetails", selectedOrder?.orderHeaderId],
    queryFn: () => getOrderDetails(selectedOrder?.orderHeaderId),
    enabled: !!selectedOrder?.orderHeaderId,
    retry: 3,
    refetchInterval: 1000 * 60 * 1,
  });
  useEffect(() => {
    console.log("orderDetails", orderDetails);
  }, [orderDetails]);

  // Extract items list safely
  const detailsArray = useMemo(() => {
    if (!orderDetails) return [];
    if (Array.isArray(orderDetails)) {
      if (Array.isArray(orderDetails[0]?.details)) return orderDetails[0].details;
      return orderDetails;
    }
    if (Array.isArray(orderDetails.details)) return orderDetails.details;
    return [];
  }, [orderDetails]);


  // Sync Edit Mode data
  useEffect(() => {
    if (isEditMode) {
      setEditedHeader({});
    }
  }, [isEditMode, detailsArray]);

  const handleEditQuantity = (item, change) => {
    // if (selectedOrder?.orderHeaderAirCatringEndOrder) {
    //   onlineOrderToast.error(lang === "EN" ? "Order Closed" : "تم إغلاق الطلب");
    //   return;
    // }
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

    setUpdatingItemId(item.orderDetailsId);
    UpdataDetailsMutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(["orderDetails", selectedOrder?.orderHeaderId]);
        queryClient.invalidateQueries(["myOrders"]);
      },
      onSettled: () => setUpdatingItemId(null)
    });
  };

  const handleDeleteItem = (detailsId) => {
    // if (selectedOrder?.orderHeaderAirCatringEndOrder) {
    //   onlineOrderToast.error(lang === "EN" ? "Order Closed" : "تم إغلاق الطلب");
    //   return;
    // }
    setUpdatingItemId(detailsId);
    deleteItemMutation.mutate(detailsId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["orderDetails", selectedOrder?.orderHeaderId]);
        queryClient.invalidateQueries(["myOrders"]);
      },
      onSettled: () => setUpdatingItemId(null)
    });
  };

  const handleSave = async () => {
    try {
      onlineOrderToast.loading(lang === "EN" ? "Saving Changes..." : "جاري حفظ التغييرات...", { id: "savingOrder" });

      let allSuccess = true;

      // Update Header
      if (Object.keys(editedHeader).length > 0) {
        const headerPayload = { ...selectedOrder, ...editedHeader };
        // The payload rules: send existing values for unmodified fields
        await UpdateOrderHeaderMutation.mutateAsync({ orderId: selectedOrder?.orderHeaderId, data: headerPayload });
      }



      onlineOrderToast.success(lang === "EN" ? "Order updated successfully" : "تم تحديث الطلب بنجاح", { id: "savingOrder" });
      setIsEditMode(false);
      queryClient.invalidateQueries(["orderDetails", selectedOrder?.orderHeaderId]);
      queryClient.invalidateQueries(["myOrders"]);
    } catch (err) {
      onlineOrderToast.error(lang === "EN" ? "Failed to save changes" : "فشل حفظ التغييرات", { id: "savingOrder" });
      console.error("Save Error:", err);
    }
  };

  const filteredDetails = useMemo(() => {
    if (activeTab === "Arrival") return detailsArray.filter(item => item.orderDetailsIsArrival);
    if (activeTab === "Departure") return detailsArray.filter(item => item.orderDetailsIsDepartur);
    return detailsArray;
  }, [detailsArray, activeTab]);

  // Items that need a client decision (not available = replyId 2 or 3)
  const nonAvailableItems = useMemo(
    () => detailsArray.filter(item => item.orderDetailsKitchenReplyId !== 1),
    [detailsArray]
  );

  const allDecisionsMade = useMemo(
    () => nonAvailableItems.length > 0 && nonAvailableItems.every(item => !!clientDecisions[item.orderDetailsId]),
    [nonAvailableItems, clientDecisions]
  );

  const handleClientDecision = (item, decisionType, qty) => {
    setClientDecisions(prev => ({
      ...prev,
      [item.orderDetailsId]: {
        decisionType,
        orderDetailQty: qty ?? item.orderDetailsQty,
      },
    }));
  };

  const handleConfirmDecisions = () => {
    const decisions = nonAvailableItems.map(item => ({
      orderDetailsId: item.orderDetailsId,
      decisionType: clientDecisions[item.orderDetailsId]?.decisionType,
      orderDetailQty: clientDecisions[item.orderDetailsId]?.orderDetailQty ?? item.orderDetailsQty,
    }));
    submitClientDecisionMutation.mutate({
      orderHeaderId: selectedOrder?.orderHeaderId,
      decisions,
    });
  };

  const groupedDetails = useMemo(() => {
    const groups = {};
    const fallbackGroup = lang === 'AR' ? 'أخرى' : 'Other';
    filteredDetails.forEach(item => {
      const groupName = item.orderDetailsItemGroupName ? item.orderDetailsItemGroupName.trim() : '';
      const key = groupName || fallbackGroup;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }, [filteredDetails, lang]);


  // Helpers
  const parseDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isFinite(d.getTime()) ? d : null;
  };

  const formatArrival = (date) => {
    if (!date) return "—";
    return date.toLocaleString(lang === "AR" ? "ar-EG" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const deliveryDate = parseDate(selectedOrder?.orderHeaderDeliveryDateTime);

  const getStatusConfig = () => {
    if (!selectedOrder) return { label: "...", color: "#6b6b6b", bg: "#F6F4EF", pulse: false };
    const statusId = selectedOrder.orderHeaderStatusID;
    const isCancelled = statusId > 9;
    const isDelivered = statusId > 8 && statusId < 10;
    const isDelay = deliveryDate && deliveryDate < new Date() && !isDelivered && !isCancelled;
    const isPending = statusId <= 5;
    const isOnHisWay = statusId === 8;

    if (isCancelled) return { label: lang === "EN" ? "Cancelled" : "ملغى", color: "#B54848", bg: "#FAECEC", pulse: false };
    if (isDelivered) return { label: lang === "EN" ? "Delivered" : "تم التوصيل", color: "#2F7D46", bg: "#EEF6F0", pulse: false };
    if (isDelay) return { label: lang === "EN" ? "Delayed" : "متأخر", color: "#B54848", bg: "#FAECEC", pulse: false };
    if (isOnHisWay) return { label: lang === "EN" ? "On the way" : "في الطريق", color: "#60a5fa", bg: "#EFF6FF", pulse: true };
    return { label: lang === "EN" ? "Processing" : "قيد المعالجة", color: "#B88E52", bg: "#F7F3EA", pulse: true };
  };

  const statusConfig = getStatusConfig();

  if (isOrderInfoLoading || (selectedOrder && isDetailsLoading)) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isOrderInfoLoading && !selectedOrder) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center text-[#6b6b6b] gap-4">
        <FaFileInvoiceDollar className="text-6xl text-gray-400" />
        <h2 className="text-2xl font-bold text-[#49494A]">{lang === "EN" ? "Order Not Found" : "الطلب غير موجود"}</h2>
        <button onClick={() => navigate(-1)} className="text-[#C5A76D] hover:underline mt-2 cursor-pointer">
          {lang === "EN" ? "Go Back" : "رجوع"}
        </button>
      </div>
    );
  }


  const isArrival = !!selectedOrder?.orderHeaderIsArrival;
  const isDeparture = !!(selectedOrder?.orderHeaderIsDeparture || selectedOrder?.orderHeaderIsDepartur);

  const col1Fields = [
    // --- Arrival date fields (only when arrival) ---
    ...(isArrival ? [
      {
        label: lang === "EN" ? "Arrival Date & Time" : "تاريخ ووقت الوصول",
        value: selectedOrder.orderHeaderFlightArrivalDatTime ? formatArrival(parseDate(selectedOrder.orderHeaderFlightArrivalDatTime)) : "—",
        icon: <FaMapMarkerAlt className="text-primary text-xs" />,
        editElement: (
          <input type="datetime-local" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderFlightArrivalDatTime !== undefined ? (editedHeader.orderHeaderFlightArrivalDatTime ? editedHeader.orderHeaderFlightArrivalDatTime.substring(0, 16) : "") : (selectedOrder.orderHeaderFlightArrivalDatTime ? selectedOrder.orderHeaderFlightArrivalDatTime.substring(0, 16) : "")}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderFlightArrivalDatTime: e.target.value ? new Date(e.target.value).toISOString() : null }))}
          />
        )
      },
      {
        label: lang === "EN" ? "Arrival Delivery Date & Time" : "وقت التوصيل عند الوصول",
        value: selectedOrder.orderHeaderArrivalDeliveryDate ? formatArrival(parseDate(selectedOrder.orderHeaderArrivalDeliveryDate)) : "—",
        icon: <MdDeliveryDining className="text-primary text-xs" />,
        editElement: (
          <input type="datetime-local" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderArrivalDeliveryDate !== undefined ? (editedHeader.orderHeaderArrivalDeliveryDate ? editedHeader.orderHeaderArrivalDeliveryDate.substring(0, 16) : "") : (selectedOrder.orderHeaderArrivalDeliveryDate ? selectedOrder.orderHeaderArrivalDeliveryDate.substring(0, 16) : "")}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderArrivalDeliveryDate: e.target.value ? new Date(e.target.value).toISOString() : null }))}
          />
        )
      },
    ] : []),
    // --- Departure date fields (only when departure) ---
    ...(isDeparture ? [
      {
        label: lang === "EN" ? "Departure/Delivery Date & Time" : "تاريخ ووقت التوصيل",
        value: selectedOrder.orderHeaderDeliveryDateTime ? formatArrival(parseDate(selectedOrder.orderHeaderDeliveryDateTime)) : "—",
        icon: <MdDeliveryDining className="text-primary text-xs" />,
        editElement: (
          <input type="datetime-local" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderDeliveryDateTime !== undefined ? (editedHeader.orderHeaderDeliveryDateTime ? editedHeader.orderHeaderDeliveryDateTime.substring(0, 16) : "") : (selectedOrder.orderHeaderDeliveryDateTime ? selectedOrder.orderHeaderDeliveryDateTime.substring(0, 16) : "")}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderDeliveryDateTime: e.target.value ? new Date(e.target.value).toISOString() : null }))}
          />
        )
      },
      {
        label: lang === "EN" ? "Departure Date & Time" : "تاريخ ووقت الاقلاع",
        value: selectedOrder.orderHeaderDepatrialDateTime ? formatArrival(parseDate(selectedOrder.orderHeaderDepatrialDateTime)) : "—",
        icon: <FaMapMarkerAlt className="text-primary text-xs" />,
        editElement: (
          <input type="datetime-local" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderDepatrialDateTime !== undefined ? (editedHeader.orderHeaderDepatrialDateTime ? editedHeader.orderHeaderDepatrialDateTime.substring(0, 16) : "") : (selectedOrder.orderHeaderDepatrialDateTime ? selectedOrder.orderHeaderDepatrialDateTime.substring(0, 16) : "")}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderDepatrialDateTime: e.target.value ? new Date(e.target.value).toISOString() : null }))}
          />
        )
      },
    ] : []),
    // --- Station stays in col1 only for "Both" mode ---
    ...(isArrival && isDeparture ? [
      {
        label: lang === "EN" ? "Station (Airport)" : "المحطة (المطار)",
        value: selectedOrder.orderHeaderStationName || "—",
        icon: <FaMapMarkerAlt className="text-primary text-xs" />,
        editElement: (
          <CustomLookup
            options={stations || []}
            value={editedHeader.orderHeaderStationId !== undefined ? editedHeader.orderHeaderStationId : selectedOrder.orderHeaderStationId}
            onChange={(val, label) => setEditedHeader(prev => ({ ...prev, orderHeaderStationId: val, orderHeaderStationName: label }))}
            getOptionLabel={(opt) => opt.stationName}
            getOptionValue={(opt) => opt.stationId}
            defaultLabel={selectedOrder.orderHeaderStationName || ""}
          />
        )
      }
    ] : []),
    // --- Pax / Crew join col1 only for SINGLE-MODE orders ---
    ...(isArrival && !isDeparture ? [
      {
        label: lang === "EN" ? "Arrival Passengers" : "ركاب الوصول",
        value: lang === "EN" ? (selectedOrder.orderHeaderArrivalPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalPaxnum || 0),
        icon: <FaUsers className="text-primary text-xs" />,
        editElement: (
          <input type="number" min="0" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderArrivalPaxnum !== undefined ? editedHeader.orderHeaderArrivalPaxnum : selectedOrder.orderHeaderArrivalPaxnum || 0}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderArrivalPaxnum: parseInt(e.target.value) || 0 }))}
          />
        )
      },
      {
        label: lang === "EN" ? "Arrival Crew" : "طاقم الوصول",
        value: lang === "EN" ? (selectedOrder.orderHeaderArrivalCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalCrewNum || 0),
        icon: <FaUsers className="text-primary text-xs" />,
        editElement: (
          <input type="number" min="0" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderArrivalCrewNum !== undefined ? editedHeader.orderHeaderArrivalCrewNum : selectedOrder.orderHeaderArrivalCrewNum || 0}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderArrivalCrewNum: parseInt(e.target.value) || 0 }))}
          />
        )
      },
    ] : []),
    ...(isDeparture && !isArrival ? [
      {
        label: lang === "EN" ? "Departure Passengers" : "ركاب المغادرة",
        value: lang === "EN" ? (selectedOrder.orderHeaderPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderPaxnum || 0),
        icon: <FaUsers className="text-primary text-xs" />,
        editElement: (
          <input type="number" min="0" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderPaxnum !== undefined ? editedHeader.orderHeaderPaxnum : selectedOrder.orderHeaderPaxnum || 0}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderPaxnum: parseInt(e.target.value) || 0 }))}
          />
        )
      },
      {
        label: lang === "EN" ? "Departure Crew" : "طاقم المغادرة",
        value: lang === "EN" ? (selectedOrder.orderHeaderCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderCrewNum || 0),
        icon: <FaUsers className="text-primary text-xs" />,
        editElement: (
          <input type="number" min="0" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderCrewNum !== undefined ? editedHeader.orderHeaderCrewNum : selectedOrder.orderHeaderCrewNum || 0}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderCrewNum: parseInt(e.target.value) || 0 }))}
          />
        )
      },
    ] : []),
  ];

  const col2Fields = [
    {
      label: lang === "EN" ? "Flight Number" : "رقم الرحلة",
      value: selectedOrder.orderHeaderFlightNumberName || "—",
      icon: <FaPlane className="text-primary text-xs" />,
      editElement: (
        <CustomLookup
          options={flightNumbers || []}
          value={editedHeader.orderHeaderFlightNumberId !== undefined ? editedHeader.orderHeaderFlightNumberId : selectedOrder.orderHeaderFlightNumberId}
          onChange={(val, label) => setEditedHeader(prev => ({ ...prev, orderHeaderFlightNumberId: val, orderHeaderFlightNumberName: label }))}
          getOptionLabel={(opt) => opt.flightNumberName}
          getOptionValue={(opt) => opt.flightNumberId}
          defaultLabel={selectedOrder.orderHeaderFlightNumberName || ""}
        />
      )
    },
    {
      label: lang === "EN" ? "Aircraft Registration" : "تسجيل الطائرة",
      value: selectedOrder.orderHeaderAcregName || "—",
      icon: <FaPlane className="text-primary text-xs" />,
      editElement: (
        <CustomLookup
          options={registrations || []}
          value={editedHeader.orderHeaderAcregId !== undefined ? editedHeader.orderHeaderAcregId : selectedOrder.orderHeaderAcregId}
          onChange={(val, label) => setEditedHeader(prev => ({ ...prev, orderHeaderAcregId: val, orderHeaderAcregName: label }))}
          getOptionLabel={(opt) => opt.registrationName}
          getOptionValue={(opt) => opt.registrationId}
          defaultLabel={selectedOrder.orderHeaderAcregName || ""}
        />
      )
    },
    {
      label: lang === "EN" ? "Aircraft Type" : "نوع الطائرة",
      value: selectedOrder.orderHeaderActypeName || "—",
      icon: <FaPlane className="text-primary text-xs" />,
      editElement: (
        <CustomLookup
          options={airCrafts || []}
          value={editedHeader.orderHeaderActypeId !== undefined ? editedHeader.orderHeaderActypeId : selectedOrder.orderHeaderActypeId}
          onChange={(val, label) => setEditedHeader(prev => ({ ...prev, orderHeaderActypeId: val, orderHeaderActypeName: label }))}
          getOptionLabel={(opt) => opt.airCraftName}
          getOptionValue={(opt) => opt.airCraftId}
          defaultLabel={selectedOrder.orderHeaderActypeName || ""}
        />
      )
    },
    // --- Station moves to col2 for single-mode orders ---
    ...((isArrival && !isDeparture) || (isDeparture && !isArrival) ? [
      {
        label: lang === "EN" ? "Station (Airport)" : "المحطة (المطار)",
        value: selectedOrder.orderHeaderStationName || "—",
        icon: <FaMapMarkerAlt className="text-primary text-xs" />,
        editElement: (
          <CustomLookup
            options={stations || []}
            value={editedHeader.orderHeaderStationId !== undefined ? editedHeader.orderHeaderStationId : selectedOrder.orderHeaderStationId}
            onChange={(val, label) => setEditedHeader(prev => ({ ...prev, orderHeaderStationId: val, orderHeaderStationName: label }))}
            getOptionLabel={(opt) => opt.stationName}
            getOptionValue={(opt) => opt.stationId}
            defaultLabel={selectedOrder.orderHeaderStationName || ""}
          />
        )
      }
    ] : []),
    // --- Arrival Pax / Crew in col2 only for "Both" ---
    ...(isArrival && isDeparture ? [
      {
        label: lang === "EN" ? "Arrival Passengers" : "ركاب الوصول",
        value: lang === "EN" ? (selectedOrder.orderHeaderArrivalPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalPaxnum || 0),
        icon: <FaUsers className="text-primary text-xs" />,
        editElement: (
          <input type="number" min="0" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderArrivalPaxnum !== undefined ? editedHeader.orderHeaderArrivalPaxnum : selectedOrder.orderHeaderArrivalPaxnum || 0}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderArrivalPaxnum: parseInt(e.target.value) || 0 }))}
          />
        )
      },
      {
        label: lang === "EN" ? "Arrival Crew" : "طاقم الوصول",
        value: lang === "EN" ? (selectedOrder.orderHeaderArrivalCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalCrewNum || 0),
        icon: <FaUsers className="text-primary text-xs" />,
        editElement: (
          <input type="number" min="0" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderArrivalCrewNum !== undefined ? editedHeader.orderHeaderArrivalCrewNum : selectedOrder.orderHeaderArrivalCrewNum || 0}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderArrivalCrewNum: parseInt(e.target.value) || 0 }))}
          />
        )
      },
    ] : []),
  ];

  const col3Fields = [
    // --- Departure Pax / Crew in col3 only for "Both" ---
    ...(isArrival && isDeparture ? [
      {
        label: lang === "EN" ? "Departure Passengers" : "ركاب المغادرة",
        value: lang === "EN" ? (selectedOrder.orderHeaderPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderPaxnum || 0),
        icon: <FaUsers className="text-primary text-xs" />,
        editElement: (
          <input type="number" min="0" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderPaxnum !== undefined ? editedHeader.orderHeaderPaxnum : selectedOrder.orderHeaderPaxnum || 0}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderPaxnum: parseInt(e.target.value) || 0 }))}
          />
        )
      },
      {
        label: lang === "EN" ? "Departure Crew" : "طاقم المغادرة",
        value: lang === "EN" ? (selectedOrder.orderHeaderCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderCrewNum || 0),
        icon: <FaUsers className="text-primary text-xs" />,
        editElement: (
          <input type="number" min="0" className="w-full px-3 py-1 text-sm border border-gray-300 rounded-[24px] h-[30px] focus:outline-none focus:border-primary text-black"
            value={editedHeader.orderHeaderCrewNum !== undefined ? editedHeader.orderHeaderCrewNum : selectedOrder.orderHeaderCrewNum || 0}
            onChange={(e) => setEditedHeader(prev => ({ ...prev, orderHeaderCrewNum: parseInt(e.target.value) || 0 }))}
          />
        )
      },
    ] : []),
    {
      label: lang === "EN" ? "Agent" : "الوكيل",
      value: selectedOrder.orderHeaderAgentName || "—",
      icon: <FaBuilding className="text-primary text-xs" />,
      editElement: (
        <CustomLookup
          options={agents || []}
          value={editedHeader.orderHeaderAgentId !== undefined ? editedHeader.orderHeaderAgentId : selectedOrder.orderHeaderAgentId}
          onChange={(val, label) => setEditedHeader(prev => ({ ...prev, orderHeaderAgentId: val, orderHeaderAgentName: label }))}
          getOptionLabel={(opt) => opt.agentName}
          getOptionValue={(opt) => opt.agentId}
          defaultLabel={selectedOrder.orderHeaderAgentName || ""}
        />
      )
    },
    {
      label: lang === "EN" ? "Operator" : "المشغل",
      value: selectedOrder.orderHeaderOperatorName || "—",
      icon: <FaBuilding className="text-primary text-xs" />,
      editElement: (
        <CustomLookup
          options={operators || []}
          value={editedHeader.orderHeaderOperatorId !== undefined ? editedHeader.orderHeaderOperatorId : selectedOrder.orderHeaderOperatorId}
          onChange={(val, label) => setEditedHeader(prev => ({ ...prev, orderHeaderOperatorId: val, orderHeaderOperatorName: label }))}
          getOptionLabel={(opt) => opt.operatorName}
          getOptionValue={(opt) => opt.operatorId}
          defaultLabel={selectedOrder.orderHeaderOperatorName || ""}
        />
      )
    },
    {
      label: lang === "EN" ? "Bill To" : "الفاتورة لـ",
      value: selectedOrder.orderHeaderBillToName || "—",
      icon: <FaBuilding className="text-primary text-xs" />,
      editElement: (
        <CustomLookup
          options={billTos || []}
          value={editedHeader.orderHeaderBillToId !== undefined ? editedHeader.orderHeaderBillToId : selectedOrder.orderHeaderBillToId}
          onChange={(val, label) => setEditedHeader(prev => ({ ...prev, orderHeaderBillToId: val, orderHeaderBillToName: label }))}
          getOptionLabel={(opt) => opt.billToName}
          getOptionValue={(opt) => opt.billToId}
          defaultLabel={selectedOrder.orderHeaderBillToName || ""}
        />
      )
    }
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-transparent text-white font-sans py-5"
    >
      <HomeHero lang={lang} />
      <div className="max-w-[1200px] mx-auto space-y-8">


        {/* Header Section */}
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition cursor-pointer text-[#C5A76D]"
            >
              {lang === "AR" ? <FaArrowRight /> : <FaArrowLeft />}
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                {lang === "EN" ? "Order Details" : "تفاصيل الطلب"} {selectedOrder?.orderHeaderOrderNumber ? (lang === "EN" ? `#${selectedOrder.orderHeaderOrderNumber}` : `#${toArabicNumbers(selectedOrder.orderHeaderOrderNumber)}`) : ""}
              </h1>
              {/* <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-gray-400">
                  {lang === "EN" ? "Archival Read-Only View" : "عرض الأرشيف للقراءة فقط"}
                </p>
              </div> */}
            </div>
          </div>


          <div className="flex flex-wrap items-center gap-3 justify-end">
            {/* === ARCHIVED STATE (status 25): only show Edit, Cancel, Restore === */}
            {selectedOrder?.orderHeaderStatusID === 25 ? (
              <>
                {/* Edit Order */}
                <button
                  onClick={handleEditClick}
                  title={isOrderLocked ? (lang === "EN" ? "Order is already in progress" : "الطلب قيد التنفيذ") : undefined}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-all whitespace-nowrap ${isOrderLocked
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                    : "bg-primary hover:opacity-90 text-white cursor-pointer"
                    }`}
                >
                  <FaEdit /> {lang === "EN" ? "Edit Order" : "تعديل الطلب"}
                </button>

                {/* Restore From Archive */}
                <button
                  onClick={() => restoreOrderMutation.mutate(selectedOrder.orderHeaderId)}
                  disabled={restoreOrderMutation.isPending || isOrderLocked}
                  title={isOrderLocked ? (lang === "EN" ? "Order is already in progress" : "الطلب قيد التنفيذ") : undefined}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-all whitespace-nowrap ${(restoreOrderMutation.isPending || isOrderLocked)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                    : "bg-secondary hover:opacity-90 text-white cursor-pointer"
                    }`}
                >
                  ↩ {lang === "EN" ? "Restore From Archive" : "استعادة من الأرشيف"}
                </button>

                {/* Cancel Order */}
                <button
                  onClick={handleCancelClick}
                  disabled={cancelOrderMutation.isPending || isOrderLocked}
                  title={isOrderLocked ? (lang === "EN" ? "Order is already in progress" : "الطلب قيد التنفيذ") : undefined}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${(cancelOrderMutation.isPending || isOrderLocked)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70 border-none"
                    : "bg-white border border-red-500 text-red-500 hover:bg-red-50 cursor-pointer"
                    }`}
                >
                  <FaTimes /> {lang === "EN" ? "Cancel Order" : "إلغاء الطلب"}
                </button>
              </>
            ) : (
              /* === NORMAL STATE === */
              <>
                {selectedOrder?.orderHeaderStatusID === 12 && (
                  <OrderInvoicePrint
                    header={selectedOrder}
                    details={detailsArray}
                    lang={lang}
                  />
                )}

                <button
                  id="guide-order-track"
                  onClick={() => navigate(`/order/${id}/tracking`)}
                  className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-gray-50 text-secondary border border-gray-200 rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <MdTimeline className="text-primary" size={16} /> {lang === "EN" ? "Track Order" : "تتبع الطلب"}
                </button>

                {(!isEditMode && selectedOrder && !selectedOrder?.orderHeaderAirCatringEndOrder && detailsArray?.length > 0) || guideEnabled ? (
                  <button
                    id="guide-order-send-to-sky"
                    onClick={() => !guideEnabled && handleCheckOut(selectedOrder)}
                    className="flex items-center gap-2 px-5 py-2 bg-primary hover:opacity-90 text-white rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    {langText.sendToSkyCulinaire?.[lang]}
                  </button>
                ) : null}

                {(!isEditMode && selectedOrder?.orderHeaderStatusID == 23) || guideEnabled ? (
                  <button
                    id="guide-order-final-confirm"
                    onClick={() => !guideEnabled && finalConfirmationMutation.mutate(selectedOrder.orderHeaderId, {
                      onSuccess: () => setShowFinalConfirmPopup(true)
                    })}
                    className="flex items-center gap-2 px-5 py-2 bg-primary hover:opacity-90 text-white rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    {langText.finalConfirmation?.[lang]}
                  </button>
                ) : null}

                {isEditMode && !guideEnabled ? (
                  <>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-red-50 text-red-500 border border-red-500 rounded-full font-bold text-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      <FaTimes /> {lang === "EN" ? "Cancel" : "إلغاء"}
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2 bg-primary hover:opacity-90 text-white rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      <FaSave /> {lang === "EN" ? "Save Changes" : "حفظ التغييرات"}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Edit Order */}
                    <button
                      id="guide-order-edit"
                      onClick={handleEditClick}
                      title={isOrderLocked ? (lang === "EN" ? "Order is already in progress" : "الطلب قيد التنفيذ") : undefined}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-all whitespace-nowrap ${isOrderLocked
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                        : "bg-primary hover:opacity-90 text-white cursor-pointer"
                        }`}
                    >
                      <FaEdit /> {lang === "EN" ? "Edit Order" : "تعديل الطلب"}
                    </button>

                    {/* Send to Archive */}
                    <button
                      id="guide-order-archive"
                      onClick={() => archiveOrderMutation.mutate(selectedOrder.orderHeaderId)}
                      disabled={archiveOrderMutation.isPending || isOrderLocked}
                      title={isOrderLocked ? (lang === "EN" ? "Order is already in progress" : "الطلب قيد التنفيذ") : undefined}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-all whitespace-nowrap ${(archiveOrderMutation.isPending || isOrderLocked)
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                        : "bg-secondary hover:opacity-90 text-white cursor-pointer"
                        }`}
                    >
                      🗃 {lang === "EN" ? "Send to Archive" : "إرسال إلى الأرشيف"}
                    </button>

                    {/* Cancel Order */}
                    <button
                      id="guide-order-cancel"
                      onClick={handleCancelClick}
                      disabled={cancelOrderMutation.isPending || isOrderLocked}
                      title={isOrderLocked ? (lang === "EN" ? "Order is already in progress" : "الطلب قيد التنفيذ") : undefined}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${(cancelOrderMutation.isPending || isOrderLocked)
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70 border-none"
                        : "bg-white border border-red-500 text-red-500 hover:bg-red-50 cursor-pointer"
                        }`}
                    >
                      <FaTimes /> {lang === "EN" ? "Cancel Order" : "إلغاء الطلب"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Flight Metadata Grid */}
        <div className="bg-white border border-light-gray rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2 m-0">
              <FaPlane />
              {lang === "EN" ? "Flight Information" : "معلومات الرحلة"}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Flight Type Badge */}
              {(isArrival || isDeparture) && (
                isArrival && isDeparture ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <FaPlane className="rotate-90" />
                    {lang === "EN" ? "Arrival & Departure" : "وصول ومغادرة"}
                  </span>
                ) : isArrival ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <FaPlane className="rotate-180" />
                    {lang === "EN" ? "Arrival" : "وصول"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <FaPlane />
                    {lang === "EN" ? "Departure" : "مغادرة"}
                  </span>
                )
              )}
              {orderInfo?.[0]?.header?.orderHeaderCurrentStatus &&
                <div className="inline-flex items-center gap-2 rounded-full px-4 h-8 text-sm font-bold shadow-sm tracking-wider w-max bg-primary text-white border border-primary/20">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                    className="w-2 h-2 rounded-full inline-block bg-white"
                  />
                  {orderInfo?.[0]?.header?.orderHeaderCurrentStatus ? orderInfo?.[0]?.header?.orderHeaderCurrentStatus : ""}
                </div>
              }
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col gap-4">
              {col1Fields.map((field, idx) => (
                <div key={idx} style={{ height: '80px', minHeight: '80px' }} className="bg-[#FBFBFA] border border-light-gray px-4 rounded-xl hover:shadow-sm transition-all duration-300 flex flex-col justify-center gap-1 overflow-hidden">
                  <span className="text-[10px] text-gray uppercase tracking-widest font-semibold flex items-center gap-1.5 truncate">
                    {field.icon}
                    {field.label}
                  </span>
                  <div className="text-sm font-semibold text-secondary truncate">
                    {isEditMode && field.editElement ? field.editElement : field.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {col2Fields.map((field, idx) => (
                <div key={idx} style={{ height: '80px', minHeight: '80px' }} className="bg-[#FBFBFA] border border-light-gray px-4 rounded-xl hover:shadow-sm transition-all duration-300 flex flex-col justify-center gap-1 overflow-hidden">
                  <span className="text-[10px] text-gray uppercase tracking-widest font-semibold flex items-center gap-1.5 truncate">
                    {field.icon}
                    {field.label}
                  </span>
                  <div className="text-sm font-semibold text-secondary truncate">
                    {isEditMode && field.editElement ? field.editElement : field.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {col3Fields.map((field, idx) => (
                <div key={idx} style={{ height: '80px', minHeight: '80px' }} className="bg-[#FBFBFA] border border-light-gray px-4 rounded-xl hover:shadow-sm transition-all duration-300 flex flex-col justify-center gap-1 overflow-hidden">
                  <span className="text-[10px] text-gray uppercase tracking-widest font-semibold flex items-center gap-1.5 truncate">
                    {field.icon}
                    {field.label}
                  </span>
                  <div className="text-sm font-semibold text-secondary truncate">
                    {isEditMode && field.editElement ? field.editElement : field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kitchen Review Panel – visible only when status === 24 */}
        {selectedOrder?.orderHeaderStatusID === 24 && (
          <div className="bg-white border border-light-gray rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="p-6 sm:p-8 border-b border-light-gray bg-gradient-to-r from-[#FFF8EE] to-[#F6F4EF] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
                  <span className="text-2xl">🍽️</span>
                  {lang === "EN" ? "Kitchen Response – Review Required" : "رد المطبخ – مراجعة مطلوبة"}
                </h2>
                <p className="text-xs text-gray mt-1">
                  {lang === "EN"
                    ? "Please review each item and approve or reject the kitchen's alternative."
                    : "يرجى مراجعة كل عنصر والموافقة على بديل المطبخ أو رفضه."}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs text-gray">
                  {lang === "EN"
                    ? `${Object.keys(clientDecisions).length} / ${nonAvailableItems.length} reviewed`
                    : `${Object.keys(clientDecisions).length} / ${nonAvailableItems.length} تمت المراجعة`}
                </span>
                <div className="w-32 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: nonAvailableItems.length ? `${(Object.keys(clientDecisions).length / nonAvailableItems.length) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {detailsArray.length === 0 ? (
                <p className="text-gray text-center py-8">{lang === "EN" ? "No items found." : "لا توجد عناصر."}</p>
              ) : (
                detailsArray.map((item) => {
                  const replyId = item.orderDetailsKitchenReplyId;
                  const decision = clientDecisions[item.orderDetailsId];
                  const isApproved = decision?.decisionType === "APPROVE_ALTERNATIVE";
                  const isRejected = decision?.decisionType === "REJECT";

                  return (
                    <div
                      key={item.orderDetailsId}
                      className={`rounded-2xl border-2 transition-all duration-300 ${replyId === 1
                        ? "border-[#2F7D46]/20 bg-[#F0FAF3]"
                        : isApproved
                          ? "border-primary/30 bg-[#FFF8EE]"
                          : isRejected
                            ? "border-red-300 bg-red-50"
                            : "border-amber-300 bg-amber-50"
                        }`}
                    >
                      {/* Original Item Row */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {/* Status Badge */}
                            {replyId === 1 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF6F0] text-[#2F7D46] border border-[#2F7D46]/20">
                                ✅ {lang === "EN" ? "Available" : "متاح"}
                              </span>
                            )}
                            {replyId === 2 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300">
                                🔄 {lang === "EN" ? "Alternative Provided" : "تم تقديم بديل"}
                              </span>
                            )}
                            {replyId === 3 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 border border-red-300">
                                ❌ {lang === "EN" ? "Not Available" : "غير متاح"}
                              </span>
                            )}
                            <span className="font-bold text-base text-secondary">{item.orderDetailsName}</span>
                          </div>
                          <div className="text-xs text-gray flex items-center gap-2">
                            <span>{lang === "EN" ? "Qty:" : "الكمية:"} <strong className="text-secondary">{item.orderDetailsQty}</strong></span>
                            <span>•</span>
                            <span>{(item.orderDetailsPriceUsd || 0).toFixed(2)} {lang === "EN" ? "USD" : "دولار"}</span>
                          </div>
                        </div>

                        {/* Action buttons for Not Available */}
                        {replyId === 3 && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleClientDecision(item, "REJECT", item.orderDetailsQty)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${isRejected
                                ? "bg-red-500 text-white border-red-500 shadow-md"
                                : "bg-white text-red-500 border-red-300 hover:bg-red-50"
                                }`}
                            >
                              {isRejected ? "✓ " : ""}{lang === "EN" ? "Reject" : "رفض"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Alternative Card */}
                      {replyId === 2 && (
                        <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 rounded-xl border border-primary/20 bg-white overflow-hidden shadow-sm">
                          {/* Alt Header */}
                          <div className="px-4 py-2 bg-primary/5 border-b border-primary/10 flex items-center gap-2">
                            <span className="text-primary text-xs font-bold uppercase tracking-wider">
                              🍴 {lang === "EN" ? "Kitchen Alternative" : "بديل المطبخ"}
                            </span>
                          </div>

                          {/* Alt Details */}
                          <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex-1">
                              <p className="font-bold text-base text-secondary mb-1">
                                {item.orderDetailsKitchedAlternativeItemName || "—"}
                              </p>
                              {item.orderDetailsKitchedAlternativeItemDescription && (
                                <p className="text-xs text-gray mb-1">{item.orderDetailsKitchedAlternativeItemDescription}</p>
                              )}
                              <div className="text-xs text-gray flex items-center gap-2 flex-wrap">
                                {item.orderDetailsKitchedAlternativeItemMegurment && (
                                  <span className="px-2 py-0.5 rounded bg-[#F6F4EF] border border-light-gray text-secondary">
                                    {item.orderDetailsKitchedAlternativeItemMegurment}
                                  </span>
                                )}
                                <span>{(item.orderDetailsKitchedAlternativeItemPriceUSD || 0).toFixed(2)} {lang === "EN" ? "USD" : "دولار"}</span>
                              </div>
                            </div>

                            {/* Approve / Reject + Qty editor */}
                            <div className="flex flex-col gap-2 items-end shrink-0">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleClientDecision(item, "APPROVE_ALTERNATIVE", item.orderDetailsQty)}
                                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${isApproved
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "bg-white text-primary border-primary/40 hover:bg-[#FFF8EE]"
                                    }`}
                                >
                                  {isApproved ? "✓ " : ""}{lang === "EN" ? "Approve" : "موافقة"}
                                </button>
                                <button
                                  onClick={() => handleClientDecision(item, "REJECT", item.orderDetailsQty)}
                                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${isRejected
                                    ? "bg-red-500 text-white border-red-500 shadow-md"
                                    : "bg-white text-red-500 border-red-300 hover:bg-red-50"
                                    }`}
                                >
                                  {isRejected ? "✓ " : ""}{lang === "EN" ? "Reject" : "رفض"}
                                </button>
                              </div>

                              {/* Quantity editor – only when approved */}
                              {isApproved && (
                                <div className="flex items-center gap-2 mt-1 bg-[#FFF8EE] border border-primary/20 rounded-xl px-3 py-2">
                                  <span className="text-xs text-gray">{lang === "EN" ? "Qty:" : "الكمية:"}</span>
                                  <button
                                    onClick={() =>
                                      handleClientDecision(
                                        item,
                                        "APPROVE_ALTERNATIVE",
                                        Math.max(1, (decision?.orderDetailQty ?? item.orderDetailsQty) - 1)
                                      )
                                    }
                                    className="w-6 h-6 rounded bg-white border border-light-gray flex items-center justify-center hover:bg-[#F6F4EF] transition cursor-pointer text-xs text-secondary"
                                  >
                                    −
                                  </button>
                                  <span className="w-6 text-center text-sm font-bold text-primary">
                                    {decision?.orderDetailQty ?? item.orderDetailsQty}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleClientDecision(
                                        item,
                                        "APPROVE_ALTERNATIVE",
                                        (decision?.orderDetailQty ?? item.orderDetailsQty) + 1
                                      )
                                    }
                                    className="w-6 h-6 rounded bg-white border border-light-gray flex items-center justify-center hover:bg-[#F6F4EF] transition cursor-pointer text-xs text-primary"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Confirm Button */}
              {nonAvailableItems.length > 0 && (
                <div className="flex justify-end mt-4">
                  <button
                    disabled={!allDecisionsMade || submitClientDecisionMutation.isPending}
                    onClick={() => setShowConfirmDecisionsModal(true)}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm shadow-md transition-all cursor-pointer ${allDecisionsMade && !submitClientDecisionMutation.isPending
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {submitClientDecisionMutation.isPending ? (
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <span>✓</span>
                    )}
                    {lang === "EN" ? "Confirm My Decisions" : "تأكيد قراراتي"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items Summary Panel */}
        <div className="bg-white border border-light-gray rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 sm:p-8 border-b border-light-gray bg-[#F6F4EF] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
              <FaFileInvoiceDollar className="text-primary" />
              {lang === "EN" ? "Items’ Summary" : "ملخص العناصر"}
            </h2>

            {/* Tabs for All, Arrival, Departure */}
            {selectedOrder?.orderHeaderIsArrival && selectedOrder?.orderHeaderIsDeparture && <div className="flex bg-white p-1 rounded-xl gap-1 border border-light-gray w-full md:w-80 shadow-sm shrink-0">
              {['All', 'Arrival', 'Departure'].map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                    style={{
                      backgroundColor: active ? 'var(--color-primary)' : 'transparent',
                      color: active ? '#FFFFFF' : 'var(--color-gray)',
                      boxShadow: active ? '0 2px 8px rgba(197, 167, 109, 0.2)' : 'none'
                    }}
                  >
                    {tab === 'All' ? (lang === 'AR' ? 'الكل' : 'All') : tab === 'Arrival' ? (lang === 'AR' ? 'الوصول' : 'Arrival') : (lang === 'AR' ? 'المغادرة' : 'Departure')}
                  </button>
                );
              })}
            </div>}
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            {/* Add More Items button — shown only in edit mode */}
            {isEditMode && (
              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/home', { state: { activeOrderId: selectedOrder?.orderHeaderId } })}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all shadow-sm hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #C5A76D 0%, #b08848 100%)' }}
                >
                  <FaPlus size={12} />
                  {lang === 'AR' ? 'إضافة المزيد من العناصر' : 'Add More Items'}
                </button>
              </div>
            )}

            {filteredDetails.length === 0 ? (
              <p className="text-gray text-center py-8">{lang === "EN" ? "No items found." : "لا توجد عناصر."}</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedDetails).map(([groupName, items]) => (
                  <div key={groupName} className="space-y-4">
                    {/* Group Header */}
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary bg-[#FBFBFA] px-3 py-1.5 rounded-lg border border-light-gray shadow-sm inline-block">
                      {groupName}
                    </div>

                    {/* Group Items */}
                    <div className="space-y-4">
                      {items.map((item, idx) => {
                        const hasAddons = item.orderDetailsAddons && item.orderDetailsAddons.length > 0;
                        return (
                          <div key={item.orderDetailsId || idx} className="bg-[#FBFBFA] border border-light-gray rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-sm transition-all duration-300">
                            {/* Left: Item Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-lg text-secondary">{item.orderDetailsName}</span>
                                {item.orderDetailsUnitName && (
                                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#F6F4EF] text-gray border border-light-gray">
                                    {item.orderDetailsUnitName}
                                  </span>
                                )}
                                <div className="flex gap-1">
                                  {item.orderDetailsIsArrival && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#EEF6F0] text-[#2F7D46] border border-[#2F7D46]/10 shrink-0">
                                      <span>🛬</span>{lang === 'AR' ? 'وصول' : 'Arr'}
                                    </span>
                                  )}
                                  {item.orderDetailsIsDepartur && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#FBF8F1] text-primary border border-primary/10 shrink-0">
                                      <span>🛫</span>{lang === 'AR' ? 'مغادرة' : 'Dep'}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-sm text-gray mt-1 flex items-center gap-2">
                                {isEditMode ? (
                                  <div className="flex items-center gap-3">
                                    <button
                                      disabled={updatingItemId === item.orderDetailsId}
                                      onClick={() => handleEditQuantity(item, -1)}
                                      className="w-7 h-7 rounded-lg bg-white border border-light-gray flex items-center justify-center hover:bg-[#F6F4EF] transition cursor-pointer text-xs"
                                    >
                                      <FaMinus className="text-secondary" />
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center text-primary">
                                      {lang === "EN" ? item.orderDetailsQty : toArabicNumbers(item.orderDetailsQty)}
                                    </span>
                                    <button
                                      disabled={updatingItemId === item.orderDetailsId}
                                      onClick={() => handleEditQuantity(item, 1)}
                                      className="w-7 h-7 rounded-lg bg-white border border-light-gray flex items-center justify-center hover:bg-[#F6F4EF] transition cursor-pointer text-xs"
                                    >
                                      <FaPlus className="text-primary" />
                                    </button>
                                    <button
                                      disabled={updatingItemId === item.orderDetailsId}
                                      onClick={() => handleDeleteItem(item.orderDetailsId)}
                                      className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition flex items-center justify-center text-red-600 cursor-pointer ml-2"
                                    >
                                      <FaTrash className="text-xs" />
                                    </button>
                                  </div>
                                ) : (
                                  <span>{lang === "EN" ? "Quantity:" : "الكمية:"} <strong className="text-secondary">{lang === "EN" ? item.orderDetailsQty : toArabicNumbers(item.orderDetailsQty)}</strong></span>
                                )}
                                <span>&bull;</span>
                                <span>
                                  {lang === "EN" ? (item.orderDetailsPriceUsd || 0).toFixed(2) : toArabicNumbers((item.orderDetailsPriceUsd || 0).toFixed(2))} {lang === "EN" ? "USD" : "دولار"} {lang === "EN" ? "each" : "للوحدة"}
                                </span>
                              </div>

                              {/* Addons rendering if any */}
                              {hasAddons && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {item.orderDetailsAddons.map((addon, aIdx) => (
                                    <span key={addon.foodMenuItemAddsId || aIdx} className="bg-white border border-light-gray text-secondary text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                                      {lang === "EN" ? addon.foodMenuItemAddsName : (addon.foodMenuItemAddsName_Ar || addon.foodMenuItemAddsName)}
                                      <span className="text-primary font-bold">
                                        (+{lang === "EN" ? (addon.foodMenuItemAddsPriceUsd ?? addon.foodMenuItemAddsPriceEgp) : toArabicNumbers(addon.foodMenuItemAddsPriceUsd ?? addon.foodMenuItemAddsPriceEgp)})
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Right: Item Total Cost */}
                            <div className="flex sm:flex-col justify-between sm:justify-center items-end border-t sm:border-t-0 sm:border-l border-light-gray pt-3 sm:pt-0 sm:pl-6 shrink-0">
                              <span className="text-xs text-gray uppercase tracking-wider">{lang === "EN" ? "Line Total" : "إجمالي السطر"}</span>
                              <span className="text-xl font-bold text-secondary">
                                {lang === "EN" ? (item.orderDetailsGrossUsd || 0).toFixed(2) : toArabicNumbers((item.orderDetailsGrossUsd || 0).toFixed(2))} <span className="text-sm text-primary">{lang === "EN" ? "USD" : "دولار"}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grand Totals Block */}
            {!!selectedOrder.orderHeaderNetUsd && (
              <div className="mt-6 flex justify-end">
                <div className="w-full md:w-80 bg-[#FBFBFA] rounded-xl border border-light-gray p-5 space-y-3 shadow-sm">
                  {!!selectedOrder.orderHeaderNetUsd && <div className="flex justify-between text-sm text-gray">
                    <span>{lang === "EN" ? "Items Subtotal" : "المجموع الفرعي"}</span>
                    <span className="text-secondary font-semibold">{lang === "EN" ? (selectedOrder?.orderHeaderNetUsd || 0).toFixed(2) : toArabicNumbers((selectedOrder?.orderHeaderNetUsd || 0).toFixed(2))}</span>
                  </div>}
                  {!!selectedOrder.orderHeaderTransportaion && <div className="flex justify-between text-sm text-gray">
                    <span>{lang === "EN" ? "Transportation" : "النقل"}</span>
                    <span className="text-secondary font-semibold">{lang === "EN" ? (selectedOrder?.orderHeaderTransportaion || 0).toFixed(2) : toArabicNumbers((selectedOrder?.orderHeaderTransportaion || 0).toFixed(2))}</span>
                  </div>}
                  {!!selectedOrder.orderHeaderAirportCost && <div className="flex justify-between text-sm text-gray">
                    <span>{lang === "EN" ? "Airport Fees" : "رسوم المطار"}</span>
                    <span className="text-secondary font-semibold">{lang === "EN" ? (selectedOrder?.orderHeaderAirportCost || 0).toFixed(2) : toArabicNumbers((selectedOrder?.orderHeaderAirportCost || 0).toFixed(2))}</span>
                  </div>}
                  {!!selectedOrder.orderHeaderHandling && <div className="flex justify-between text-sm text-gray">
                    <span>{lang === "EN" ? "Handling Fees" : "رسوم المناولة"}</span>
                    <span className="text-secondary font-semibold">{lang === "EN" ? (selectedOrder?.orderHeaderHandling || 0).toFixed(2) : toArabicNumbers((selectedOrder?.orderHeaderHandling || 0).toFixed(2))}</span>
                  </div>}
                  {!!selectedOrder.orderHeaderDiscount && <div className="flex justify-between text-sm text-red-400">
                    <span>{lang === "EN" ? "Discount" : "الخصم"} {selectedOrder?.orderHeaderDiscountPercent > 0 ? `(${selectedOrder.orderHeaderDiscountPercent}%)` : ""}</span>
                    <span className="font-semibold">-{lang === "EN" ? (selectedOrder?.orderHeaderDiscount || 0).toFixed(2) : toArabicNumbers((selectedOrder?.orderHeaderDiscount || 0).toFixed(2))}</span>
                  </div>}

                  <div className="pt-3 border-t border-light-gray flex justify-between items-center">
                    <span className="text-secondary font-bold">{lang === "EN" ? "Grand Total" : "الإجمالي النهائي"}</span>
                    <span className="text-2xl font-bold text-primary">
                      {lang === "EN" ? (selectedOrder?.orderHeaderGrossUsd || 0).toFixed(2) : toArabicNumbers((selectedOrder?.orderHeaderGrossUsd || 0).toFixed(2))} {lang === "EN" ? "USD" : "دولار"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <CheckoutSuccessModal
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        lang={lang}
      />
      <FinalConfirmationSuccessModal
        isOpen={showFinalConfirmPopup}
        onClose={() => {
          setShowFinalConfirmPopup(false);
          queryClient.invalidateQueries(["orderInfo", id]);
          navigate(`/order/${id}/tracking`);
        }}
        lang={lang}
      />

      {/* Confirm Decisions Modal */}
      {showConfirmDecisionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-6 py-4 flex items-center gap-3">
              <span className="text-white text-xl">✓</span>
              <h3 className="text-white font-bold text-base">
                {lang === "EN" ? "Confirm Your Decisions" : "تأكيد قراراتك"}
              </h3>
            </div>
            {/* Body */}
            <div className="p-6">
              <p className="text-secondary text-sm leading-relaxed">
                {lang === "EN"
                  ? "How would you like to proceed with your decisions?"
                  : "كيف تريد المتابعة مع قراراتك؟"}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {lang === "EN"
                  ? '"Approve & Send" will confirm your decisions and immediately send the order to Sky Culinaire.'
                  : '"موافقة وإرسال" ستؤكد قراراتك وترسل الطلب فوراً إلى Sky Culinaire.'}
              </p>
            </div>
            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              {/* Close */}
              <button
                onClick={() => setShowConfirmDecisionsModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                {lang === "EN" ? "Close" : "إغلاق"}
              </button>
              {/* Approve only */}
              <button
                disabled={submitClientDecisionMutation.isPending}
                onClick={() => {
                  handleConfirmDecisions();
                  setShowConfirmDecisionsModal(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm bg-secondary text-white hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {lang === "EN" ? "Approve" : "موافقة"}
              </button>
              {/* Approve + Send to Sky Culinaire */}
              <button
                disabled={submitClientDecisionMutation.isPending || CheckOutMutation.isPending}
                onClick={() => {
                  const decisions = nonAvailableItems.map(item => ({
                    orderDetailsId: item.orderDetailsId,
                    decisionType: clientDecisions[item.orderDetailsId]?.decisionType,
                    orderDetailQty: clientDecisions[item.orderDetailsId]?.orderDetailQty ?? item.orderDetailsQty,
                  }));
                  submitClientDecisionMutation.mutate(
                    { orderHeaderId: selectedOrder?.orderHeaderId, decisions },
                    {
                      onSuccess: () => {
                        handleCheckOut(selectedOrder);
                      }
                    }
                  );
                  setShowConfirmDecisionsModal(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-center"
              >
                {lang === "EN" ? "Approve & Send to Sky Culinaire" : "موافقة وإرسال لـ Sky Culinaire"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
          >
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              disabled={cancelOrderMutation.isPending}
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-bold text-[#49494A] mb-4">
              {lang === "EN" ? "Cancel Order" : "إلغاء الطلب"}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {lang === "EN"
                ? "Are you sure you want to cancel this order? Please provide a reason below."
                : "هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ يرجى تقديم سبب أدناه."}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#49494A] mb-2">
                {lang === "EN" ? "Reason for Cancellation" : "سبب الإلغاء"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={lang === "EN" ? "Type your reason here..." : "اكتب السبب هنا..."}
                rows={4}
                className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-[#FBFBFA]"
                disabled={cancelOrderMutation.isPending}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                disabled={cancelOrderMutation.isPending}
              >
                {lang === "EN" ? "Keep Order" : "الاحتفاظ بالطلب"}
              </button>
              <button
                onClick={() => {
                  if (!cancelReason.trim()) {
                    return;
                  }
                  cancelOrderMutation.mutate({ quatId: selectedOrder.orderHeaderId, reason: cancelReason });
                }}
                disabled={cancelOrderMutation.isPending || !cancelReason.trim()}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {cancelOrderMutation.isPending && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {lang === "EN" ? "Cancel Order" : "تأكيد الإلغاء"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
