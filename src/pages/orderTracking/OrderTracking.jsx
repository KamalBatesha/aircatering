import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getOrderById } from "../../assets/apis/order/OrderApi";
import { useLangStore } from "../../assets/store/langStore";
import { toArabicNumbers } from "../../assets/constants/lang";
import Loading from "../loading/Loading";
import { HomeHero } from "../home/Home";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaPlane,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBuilding,
  FaUsers,
  FaFileInvoiceDollar,
  FaDollarSign,
} from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

/* ─────────────── Helpers ─────────────── */
const parseDate = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isFinite(d.getTime()) ? d : null;
};

const formatArrival = (date, lang) => {
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

/* ─────────────── Skeleton ─────────────── */
function SkeletonPulse({ className = "" }) {
  return (
    <div
      className={`bg-gradient-to-r from-[#e9e9e9] via-[#f4f4f4] to-[#e9e9e9] bg-[length:400%_100%] animate-pulse rounded-lg ${className}`}
    />
  );
}

function TrackingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonPulse className="h-32 w-full" />
        <SkeletonPulse className="h-44 w-full" />
        <SkeletonPulse className="h-48 w-full" />
      </div>
    </div>
  );
}

/* ─────────────── Step Icon ─────────────── */
function StepIcon({ completed, current, index }) {
  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.08 }}
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
      >
        <FaCheck className="text-white text-sm" />
      </motion.div>
    );
  }
  if (current) {
    return (
      <div className="w-10 h-10 rounded-full border-[3px] border-primary bg-white flex items-center justify-center shadow-md relative">
        <div className="w-3 h-3 rounded-full bg-primary animate-ping absolute" />
        <div className="w-3 h-3 rounded-full bg-primary" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full border-2 border-[#E5E5E5] bg-[#FBFBFA] flex items-center justify-center">
      <span className="text-xs font-bold text-[#9b9b9b]">{index + 1}</span>
    </div>
  );
}

/* ─────────────── Desktop Horizontal Timeline ─────────────── */
function HorizontalTimeline({ steps }) {
  console.log("steps", steps);

  const currentIndex = steps.findIndex((s) => !s.completed);

  return (
    <div className="hidden md:block px-2">
      <div className="relative flex items-start justify-between">
        {/* Background connector line */}
        <div
          className="absolute top-5 left-5 right-5 h-0.5 bg-[#E5E5E5] z-0"
          style={{ transform: "translateY(0)" }}
        />

        {/* Foreground progress line — reaches the start of the current step */}
        {currentIndex > 0 && (() => {
          // The background line spans from left-5 (1.25rem) to right-5 (1.25rem),
          // so its length = 100% - 2.5rem.
          // The progress should cover (currentIndex / (n-1)) of that same span,
          // minus 1.25rem to stop exactly at the start of the current step's icon.
          const ratio = currentIndex / (steps.length - 1);
          const widthVal = `calc(${(ratio * 100).toFixed(4)}% - ${(ratio * 2.5 - 1.25).toFixed(4)}rem)`;
          return (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: widthVal }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-primary to-[#a8883a] z-0"
              style={{ transform: "translateY(0)" }}
            />
          );
        })()}
        {/* All completed line */}
        {currentIndex === -1 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "calc(100% - 2.5rem)" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-primary to-[#a8883a] z-0"
          />
        )}

        {steps.map((step, i) => {
          const isCompleted = step.completed;
          const isCurrent = !isCompleted && i === currentIndex;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative z-10 flex flex-col items-center gap-2 flex-1"
            >
              <StepIcon completed={isCompleted} current={isCurrent} index={i} />
              <div className="flex flex-col items-center gap-0.5 text-center px-1">
                <span
                  className={`text-xs font-semibold leading-tight ${isCompleted
                    ? "text-primary"
                    : isCurrent
                      ? "text-[#49494A]"
                      : "text-[#9b9b9b]"
                    }`}
                >
                  {step.name}
                </span>
                {isCurrent && (
                  <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full mt-0.5">
                    Current
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────── Mobile Vertical Timeline ─────────────── */
function VerticalTimeline({ steps }) {
  const currentIndex = steps.findIndex((s) => !s.completed);

  return (
    <div className="md:hidden flex flex-col gap-0">
      {steps.map((step, i) => {
        const isCompleted = step.completed;
        const isCurrent = !isCompleted && i === currentIndex;
        const isLast = i === steps.length - 1;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex gap-4"
          >
            {/* Left: icon + connector */}
            <div className="flex flex-col items-center">
              <StepIcon completed={isCompleted} current={isCurrent} index={i} />
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 mt-1 rounded-full ${isCompleted ? "bg-primary" : "bg-[#E5E5E5]"
                    }`}
                  style={{ minHeight: "2rem" }}
                />
              )}
            </div>

            {/* Right: content */}
            <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
              <div
                className={`inline-flex flex-col gap-0.5 px-4 py-3 rounded-xl border transition-all ${isCompleted
                  ? "bg-primary/5 border-primary/20"
                  : isCurrent
                    ? "bg-white border-primary shadow-sm shadow-primary/10"
                    : "bg-[#FBFBFA] border-[#E5E5E5]"
                  }`}
              >
                <span
                  className={`text-sm font-semibold ${isCompleted
                    ? "text-primary"
                    : isCurrent
                      ? "text-[#49494A]"
                      : "text-[#9b9b9b]"
                    }`}
                >
                  {step.name}
                </span>
                {isCompleted && (
                  <span className="text-[10px] text-primary/70 font-medium">
                    ✓ Completed
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] text-primary font-semibold">
                    ● In progress
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────── Main Page ─────────────── */
export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const isAR = lang === "AR";

  const { data: orderInfo, isLoading: isOrderInfoLoading } = useQuery({
    queryKey: ["orderInfo", id],
    queryFn: () => getOrderById(id),
    retry: 3,
  });

  const selectedOrder = useMemo(() => {
    if (!orderInfo?.length) return null;
    return orderInfo[0]?.header;
  }, [orderInfo]);

  const trackingSteps = useMemo(() => {
    if (!orderInfo?.length) return [];
    return orderInfo[0]?.tracking || [];
  }, [orderInfo]);

  const getStatusConfig = () => {
    if (!selectedOrder) return { label: "...", color: "#6b6b6b", bg: "#F6F4EF", pulse: false };
    const statusId = selectedOrder.orderHeaderStatusID;
    const isCancelled = statusId > 9;
    const isDelivered = statusId > 8 && statusId < 10;
    const deliveryDate = parseDate(selectedOrder.orderHeaderDeliveryDateTime);
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

  if (isOrderInfoLoading) return <TrackingSkeleton />;

  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center gap-4 text-[#6b6b6b]">
        <FaFileInvoiceDollar className="text-6xl text-gray-300" />
        <h2 className="text-2xl font-bold text-[#49494A]">
          {isAR ? "الطلب غير موجود" : "Order Not Found"}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline cursor-pointer flex items-center gap-2 mt-2"
        >
          {isAR ? (
            <>
              <FaArrowRight /> رجوع
            </>
          ) : (
            <>
              <FaArrowLeft /> Go Back
            </>
          )}
        </button>
      </div>
    );
  }

  const isArrival = !!selectedOrder?.orderHeaderIsArrival;
  const isDeparture = !!(selectedOrder?.orderHeaderIsDeparture || selectedOrder?.orderHeaderIsDepartur);

  const col1Fields = [
    ...(isArrival ? [
      {
        label: lang === "EN" ? "Arrival Date & Time" : "تاريخ ووقت الوصول",
        value: selectedOrder.orderHeaderFlightArrivalDatTime ? formatArrival(parseDate(selectedOrder.orderHeaderFlightArrivalDatTime), lang) : "—",
        icon: <FaMapMarkerAlt className="text-primary text-xs" />
      },
      {
        label: lang === "EN" ? "Arrival Delivery Date & Time" : "وقت التوصيل عند الوصول",
        value: selectedOrder.orderHeaderArrivalDeliveryDate ? formatArrival(parseDate(selectedOrder.orderHeaderArrivalDeliveryDate), lang) : "—",
        icon: <MdDeliveryDining className="text-primary text-xs" />
      },
    ] : []),
    ...(isDeparture ? [
      {
        label: lang === "EN" ? "Departure/Delivery Date & Time" : "تاريخ ووقت التوصيل",
        value: selectedOrder.orderHeaderDeliveryDateTime ? formatArrival(parseDate(selectedOrder.orderHeaderDeliveryDateTime), lang) : "—",
        icon: <MdDeliveryDining className="text-primary text-xs" />
      },
      {
        label: lang === "EN" ? "Departure Date & Time" : "تاريخ ووقت الاقلاع",
        value: selectedOrder.orderHeaderDepatrialDateTime ? formatArrival(parseDate(selectedOrder.orderHeaderDepatrialDateTime), lang) : "—",
        icon: <FaMapMarkerAlt className="text-primary text-xs" />
      },
    ] : []),
    ...(isArrival && isDeparture ? [
      {
        label: lang === "EN" ? "Station (Airport)" : "المحطة (المطار)",
        value: selectedOrder.orderHeaderStationName || "—",
        icon: <FaMapMarkerAlt className="text-primary text-xs" />
      }
    ] : []),
    ...(isArrival && !isDeparture ? [
      {
        label: lang === "EN" ? "Arrival Passengers" : "ركاب الوصول",
        value: lang === "EN" ? (selectedOrder.orderHeaderArrivalPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalPaxnum || 0),
        icon: <FaUsers className="text-primary text-xs" />
      },
      {
        label: lang === "EN" ? "Arrival Crew" : "طاقم الوصول",
        value: lang === "EN" ? (selectedOrder.orderHeaderArrivalCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalCrewNum || 0),
        icon: <FaUsers className="text-primary text-xs" />
      },
    ] : []),
    ...(isDeparture && !isArrival ? [
      {
        label: lang === "EN" ? "Departure Passengers" : "ركاب المغادرة",
        value: lang === "EN" ? (selectedOrder.orderHeaderPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderPaxnum || 0),
        icon: <FaUsers className="text-primary text-xs" />
      },
      {
        label: lang === "EN" ? "Departure Crew" : "طاقم المغادرة",
        value: lang === "EN" ? (selectedOrder.orderHeaderCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderCrewNum || 0),
        icon: <FaUsers className="text-primary text-xs" />
      },
    ] : []),
  ];

  const col2Fields = [
    {
      label: lang === "EN" ? "Flight Number" : "رقم الرحلة",
      value: selectedOrder.orderHeaderFlightNumberName || "—",
      icon: <FaPlane className="text-primary text-xs" />
    },
    {
      label: lang === "EN" ? "Aircraft Registration" : "تسجيل الطائرة",
      value: selectedOrder.orderHeaderAcregName || "—",
      icon: <FaPlane className="text-primary text-xs" />
    },
    {
      label: lang === "EN" ? "Aircraft Type" : "نوع الطائرة",
      value: selectedOrder.orderHeaderActypeName || "—",
      icon: <FaPlane className="text-primary text-xs" />
    },
    ...((isArrival && !isDeparture) || (isDeparture && !isArrival) ? [
      {
        label: lang === "EN" ? "Station (Airport)" : "المحطة (المطار)",
        value: selectedOrder.orderHeaderStationName || "—",
        icon: <FaMapMarkerAlt className="text-primary text-xs" />
      }
    ] : []),
    ...(isArrival && isDeparture ? [
      {
        label: lang === "EN" ? "Arrival Passengers" : "ركاب الوصول",
        value: lang === "EN" ? (selectedOrder.orderHeaderArrivalPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalPaxnum || 0),
        icon: <FaUsers className="text-primary text-xs" />
      },
      {
        label: lang === "EN" ? "Arrival Crew" : "طاقم الوصول",
        value: lang === "EN" ? (selectedOrder.orderHeaderArrivalCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderArrivalCrewNum || 0),
        icon: <FaUsers className="text-primary text-xs" />
      },
    ] : []),
  ];

  const col3Fields = [
    ...(isArrival && isDeparture ? [
      {
        label: lang === "EN" ? "Departure Passengers" : "ركاب المغادرة",
        value: lang === "EN" ? (selectedOrder.orderHeaderPaxnum || 0) : toArabicNumbers(selectedOrder.orderHeaderPaxnum || 0),
        icon: <FaUsers className="text-primary text-xs" />
      },
      {
        label: lang === "EN" ? "Departure Crew" : "طاقم المغادرة",
        value: lang === "EN" ? (selectedOrder.orderHeaderCrewNum || 0) : toArabicNumbers(selectedOrder.orderHeaderCrewNum || 0),
        icon: <FaUsers className="text-primary text-xs" />
      },
    ] : []),
    {
      label: lang === "EN" ? "Agent" : "الوكيل",
      value: selectedOrder.orderHeaderAgentName || "—",
      icon: <FaBuilding className="text-primary text-xs" />
    },
    {
      label: lang === "EN" ? "Operator" : "المشغل",
      value: selectedOrder.orderHeaderOperatorName || "—",
      icon: <FaBuilding className="text-primary text-xs" />
    },
    {
      label: lang === "EN" ? "Bill To" : "الفاتورة لـ",
      value: selectedOrder.orderHeaderBillToName || "—",
      icon: <FaBuilding className="text-primary text-xs" />
    },
    {
      label: lang === "EN" ? "Total Price" : "إجمالي السعر",
      value: selectedOrder.orderHeaderMount?.trim() || (selectedOrder.orderHeaderGrossUsd ? `${(selectedOrder.orderHeaderGrossUsd).toFixed(2)} USD` : "—"),
      icon: <FaDollarSign className="text-primary text-xs" />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen bg-transparent text-white font-sans py-5 ${isAR ? "rtl" : "ltr"}`}
      dir={isAR ? "rtl" : "ltr"}
    >
      <HomeHero lang={lang} />
      <div className="max-w-[1200px] mx-auto space-y-8 px-4">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mt-4">
          <div className="flex items-center gap-4">
            <button
              id="guide-tracking-back"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition cursor-pointer text-[#C5A76D]"
            >
              {lang === "AR" ? <FaArrowRight /> : <FaArrowLeft />}
            </button>
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
                {isAR ? "تتبع الطلب" : "Order Tracking"}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                {selectedOrder?.orderHeaderOrderNumber ? (lang === "EN" ? `#${selectedOrder.orderHeaderOrderNumber}` : `#${toArabicNumbers(selectedOrder.orderHeaderOrderNumber)}`) : ""}
              </h1>
            </div>
          </div>
          {/* <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5E5E5] w-max shadow-sm"
              style={{ backgroundColor: statusConfig.bg }}
            >
              {statusConfig.pulse && <span className="w-2 h-2 rounded-full bg-current animate-ping" style={{ color: statusConfig.color }} />}
              <span className="text-sm font-bold tracking-wider" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </span>
            </div>
          </div> */}
        </div>

        {/* Flight Metadata Grid */}
        <div id="guide-tracking-info" className="bg-white border border-light-gray rounded-2xl p-6 sm:p-8 shadow-sm">
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
                <div id="guide-tracking-status" className="inline-flex items-center gap-2 rounded-full px-4 h-8 text-sm font-bold shadow-sm tracking-wider w-max bg-primary text-white border border-primary/20">
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
                    {field.value}
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
                    {field.value}
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
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div id="guide-tracking-timeline" className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
          <div className="bg-gradient-to-r from-[#49494A] to-[#5e5e5f] px-6 py-4 flex items-center gap-3">
            <MdDeliveryDining className="text-primary text-xl shrink-0" />
            <h2 className="text-white font-semibold text-base">
              {isAR ? "مراحل تنفيذ الطلب" : "Tracking Timeline"}
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            {trackingSteps.length === 0 ? (
              <p className="text-center text-[#9b9b9b] text-sm py-8">
                {isAR ? "لا توجد مراحل للتتبع" : "No tracking steps available."}
              </p>
            ) : (
              <>
                <HorizontalTimeline steps={trackingSteps} />
                <VerticalTimeline steps={trackingSteps} />
              </>
            )}
          </div>
        </div>

        {/* Progress summary chips */}
        {trackingSteps.length > 0 && (
          <div id="guide-tracking-summary" className="flex flex-wrap gap-3 justify-center pt-2 pb-6">
            {(() => {
              const completed = trackingSteps.filter((s) => s.completed).length;
              const total = trackingSteps.length;
              const percent = Math.round((completed / total) * 100);
              return (
                <>
                  <div className="bg-white border border-[#E5E5E5] rounded-full px-4 py-1.5 text-xs font-semibold text-[#49494A] shadow-sm">
                    {isAR ? `${completed} من ${total} مرحلة مكتملة` : `${completed} of ${total} steps completed`}
                  </div>
                  <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary shadow-sm">
                    {percent}% {isAR ? "مكتمل" : "Complete"}
                  </div>
                </>
              );
            })()}
          </div>
        )}

      </div>
    </motion.div>
  );
}
