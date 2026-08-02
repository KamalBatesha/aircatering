import { getMyOrders, RestoreFromArchive, AddOrderToArchive } from '../../assets/apis/order/OrderApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState, useRef } from 'react';
import { onlineOrderToast } from '../../assets/Helpers/onlineOrderToast';
import { MdOutlineShoppingCart, MdDeliveryDining, MdTimeline } from "react-icons/md";
import { FiEye, FiPackage, FiCalendar, FiHash, FiChevronDown, FiFilter, FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlane, FaBuilding, FaMapMarkerAlt, FaUsers,
  FaMoneyBillWave, FaTruck, FaPercentage, FaTag
} from "react-icons/fa";
import Loading from '../loading/Loading';
import { useLangStore } from '../../assets/store/langStore';
import { langText, toArabicNumbers } from '../../assets/constants/lang';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../assets/store/cartStore';
import { GetAllProducts } from '../../assets/apis/product/PeoductApi';
import CreateOrderModal from '../../components/CreateOrderModal';
import { useGuide } from '../../context/GuideContext';

function Orders({ status: routeStatus = "all" }) {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const { setCart } = useCartStore();
  const { guideEnabled } = useGuide();
  const queryClient = useQueryClient();
  const [allProducts, setAllProducts] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isRTL = lang === "AR";
  const [orderAgainId, setOrderAgainId] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = [
    { value: "all", labelEN: "All", labelAR: "الكل" },
    { value: "today", labelEN: "Today", labelAR: "اليوم" },
    { value: "this_week", labelEN: "This Week", labelAR: "هذا الأسبوع" },
    { value: "this_month", labelEN: "This Month", labelAR: "هذا الشهر" },
    { value: "this_year", labelEN: "This Year", labelAR: "هذا العام" },
    { value: "last_year", labelEN: "Last Year", labelAR: "العام الماضي" },
  ];
  const activeFilter = filterOptions.find(o => o.value === dateFilter) || filterOptions[0];

  const { data: myOrders, isLoading } = useQuery({
    queryKey: ['myOrders', routeStatus],
    queryFn: () => getMyOrders(routeStatus),
    retry: 5,
    refetchInterval: 1000 * 60 * 1,
    select: (data) => data?.sort((a, b) => b.header.orderHeaderAirCatringCretionDate - a.header.orderHeaderAirCatringCretionDate)
  });

  const restoreOrderMutation = useMutation({
    mutationFn: (orderHeaderId) => RestoreFromArchive(orderHeaderId),
    onSuccess: () => {
      onlineOrderToast.success(lang === "EN" ? "Order restored from archive." : "تم استعادة الطلب من الأرشيف.");
      queryClient.invalidateQueries({ queryKey: ['myOrders', routeStatus] });
      queryClient.invalidateQueries({ queryKey: ['myOrders', ''] });
    },
    onError: (err) => {
      onlineOrderToast.error(
        lang === "EN"
          ? "Failed to restore order. " + (err.response?.data?.message || err.message)
          : "فشل في استعادة الطلب. " + (err.response?.data?.message || err.message)
      );
    },
  });

  const archiveOrderMutation = useMutation({
    mutationFn: (orderHeaderId) => AddOrderToArchive(orderHeaderId),
    onSuccess: () => {
      onlineOrderToast.success(lang === "EN" ? "Order sent to archive." : "تم إرسال الطلب إلى الأرشيف.");
      queryClient.invalidateQueries({ queryKey: ['myOrders', routeStatus] });
      queryClient.invalidateQueries({ queryKey: ['myOrders', 'archived'] });
    },
    onError: (err) => {
      onlineOrderToast.error(
        lang === "EN"
          ? "Failed to archive order. " + (err.response?.data?.message || err.message)
          : "فشل في أرشفة الطلب. " + (err.response?.data?.message || err.message)
      );
    },
  });


  const { data: items } = useQuery({
    queryKey: ['products'],
    queryFn: GetAllProducts,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 5,
  });

  useEffect(() => {
    if (items) {
      const allFoodItems = (items ?? []).flatMap(grand =>
        (grand.mainGroup ?? []).flatMap(group => group.itemDatas ?? [])
      );
      setAllProducts(allFoodItems);
    }
  }, [items]);

  // function handleOrderAgain(details) {
  //   const newOrder = details.map((detail) => {
  //     const product = allProducts.find(p => p.FoodMenuItemId === detail.orderDetailsItemId);
  //     if (!product) return null;
  //     return {
  //       ...product,
  //       quantity: detail.orderDetailsQty,
  //       cartItemId: detail.orderDetailsId || `${product.FoodMenuItemId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  //       FoodMenuItemAdds: detail?.orderDetailsAddons?.map(addon => ({
  //         FoodMenuItemMultyAddsAddId: addon.foodMenuItemAddsId,
  //         FoodMenuItemAddsName: addon.foodMenuItemAddsName,
  //         FoodMenuItemAddsPriceEgp: addon.foodMenuItemAddsPriceEgp,
  //       })) || []
  //     };
  //   }).filter(Boolean);
  //   setCart(newOrder);
  //   navigate("/cart");
  // }

  function getStatusInfo(statusId) {
    if (statusId > 8 && statusId < 10) return { label: langText.delivered[lang], color: "#10B981", bg: "rgba(16,185,129,0.08)", dot: "#10B981" };
    if (statusId === 10) return { label: langText.cancelled[lang], color: "#EF4444", bg: "rgba(239,68,68,0.08)", dot: "#EF4444" };
    return { label: langText.inProgress[lang], color: "var(--color-primary)", bg: "rgba(197,167,109,0.10)", dot: "var(--color-primary)" };
  }

  const filteredOrders = React.useMemo(() => {
    if (!myOrders) return [];
    if (dateFilter === "all") return myOrders;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return myOrders.filter(({ header }) => {
      if (!header?.orderHeaderAirCatringCretionDate) return false;
      const orderDate = new Date(header.orderHeaderAirCatringCretionDate);

      switch (dateFilter) {
        case "today":
          return orderDate >= today;
        case "this_week": {
          const firstDayOfWeek = new Date(today);
          firstDayOfWeek.setDate(today.getDate() - today.getDay());
          return orderDate >= firstDayOfWeek;
        }
        case "this_month":
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        case "this_year":
          return orderDate.getFullYear() === now.getFullYear();
        case "last_year":
          return orderDate.getFullYear() === now.getFullYear() - 1;
        default:
          return true;
      }
    });
  }, [myOrders, dateFilter]);

  const displayOrders = (filteredOrders && filteredOrders.length > 0)
    ? filteredOrders
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
          orderHeaderStationName: "Station",
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
        },
        details: []
      }
    ] : []);

  if (isLoading) return <Loading />;

  if (!myOrders || myOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5" style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "rgba(197,167,109,0.10)", border: "2px dashed var(--color-primary)" }}
        >
          <MdOutlineShoppingCart size={42} style={{ color: "var(--color-primary)" }} />
        </div>
        <h4 className="text-xl font-semibold text-gray-600">{langText.noOrdersFound[lang]}</h4>
        <p className="text-sm text-gray-400">{lang === "AR" ? "لا توجد طلبات بعد" : "You haven't placed any orders yet."}</p>
      </div>
    );
  }

  return (
    <div style={{ direction: isRTL ? "rtl" : "ltr" }}>
      {/* Order Again Modal */}
      <CreateOrderModal
        isOpen={!!orderAgainId}
        onClose={() => setOrderAgainId(null)}
        oldOrderId={orderAgainId}
      />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="text-lg font-bold m-0" style={{ color: "var(--color-secondary)" }}>
          {langText.myOrders[lang]}
          <span className="ms-2 text-sm font-normal px-2 py-0.5 rounded-full text-white" style={{ background: "var(--color-primary)" }}>
            {filteredOrders.length}
          </span>
        </h3>

        <div className="relative" ref={dropdownRef}>
          <button
            id="guide-myorders-filter"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 outline-none"
            style={{
              background: isDropdownOpen ? "rgba(197,167,109,0.05)" : "#fff",
              borderColor: isDropdownOpen ? "var(--color-primary)" : "#E5E5E5",
              color: "var(--color-secondary)",
              boxShadow: isDropdownOpen ? "0 0 0 4px rgba(197,167,109,0.12)" : "0 2px 10px rgba(0,0,0,0.03)"
            }}
          >
            <FiFilter size={16} style={{ color: "var(--color-primary)" }} />
            <span className="text-sm font-bold tracking-wide">
              {lang === "EN" ? activeFilter.labelEN : activeFilter.labelAR}
            </span>
            <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <FiChevronDown size={16} style={{ color: "var(--color-primary)" }} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`absolute z-10 top-full mt-2 min-w-[170px] w-full rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border bg-white ${isRTL ? 'left-0' : 'right-0'}`}
                style={{ borderColor: "rgba(197,167,109,0.2)" }}
              >
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setDateFilter(opt.value);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-medium transition-colors hover:bg-[#fafafa] flex items-center justify-between outline-none"
                    style={{
                      color: dateFilter === opt.value ? "var(--color-primary)" : "var(--color-secondary)",
                      background: dateFilter === opt.value ? "rgba(197,167,109,0.04)" : "transparent"
                    }}
                  >
                    <span style={{ textAlign: isRTL ? 'right' : 'left' }}>
                      {lang === "EN" ? opt.labelEN : opt.labelAR}
                    </span>
                    {dateFilter === opt.value && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-primary)" }}></span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {displayOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500">
          <FaClipboardList size={48} className="mb-4 text-gray-300" />
          <p className="text-lg font-semibold">{lang === "EN" ? "No orders found." : "لم يتم العثور على طلبات."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {displayOrders.map(({ header, details, tracking }, index) => {
            let currentTrackingStatus = null;
            if (tracking && tracking.length > 0) {
              const currentIndex = tracking.findIndex(s => !s.completed);
              currentTrackingStatus = currentIndex !== -1 ? tracking[currentIndex].name : (lang === "EN" ? "Completed" : "مكتمل");
            }
            const status = getStatusInfo(header?.orderHeaderStatusID);
            const pillText = header?.orderHeaderCurrentStatus ? header?.orderHeaderCurrentStatus : "";

            return (
              <div
                key={header?.orderHeaderId}
                className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "#fff",
                  border: "1px solid var(--color-light-gray)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                {/* ── Status strip ── */}
                <div
                  className="flex items-center justify-between px-5 py-3 flex-wrap gap-2"
                  style={{ background: status.bg, borderBottom: `1px solid ${status.color}22` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: status.dot }} />
                    <span className="text-sm font-semibold" style={{ color: status.color }}>{pillText}</span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    {header?.orderHeaderOrderNumber && (
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(197,167,109,0.15)", color: "var(--color-primary)", border: "1px solid rgba(197,167,109,0.3)" }}
                      >
                        #{lang === "EN" ? header.orderHeaderOrderNumber : toArabicNumbers(header.orderHeaderOrderNumber)}
                      </span>
                    )}
                    {header?.orderHeaderAirCatringCretionDate && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FiCalendar size={11} />
                        <span>{formatDate(header.orderHeaderAirCatringCretionDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="px-5 py-4">

                  {/* Top meta: Order ID, items count, flight type */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiPackage size={18} style={{ color: "var(--color-primary)" }} />
                      <span className='font-bold'>{langText.itemsNumber[lang]} :</span>
                      <span className="font-bold text-gray-800">
                        {lang === "EN" ? header?.orderHeaderItemsCountAirCatering : toArabicNumbers(header?.orderHeaderItemsCountAirCatering)}
                      </span>
                    </div>

                    {header?.orderHeaderFlightType && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {header.orderHeaderFlightType === "Arrival"
                          ? (lang === "AR" ? "وصول" : "Arrival ")
                          : header.orderHeaderFlightType === "Departure"
                            ? (lang === "AR" ? "مغادرة" : "Departure")
                            : (lang === "AR" ? "وصول + مغادرة" : "Arrival & Departure")}
                      </span>
                    )}
                  </div>

                  {/* Order Information Section */}
                  <div id={index === 0 ? "guide-myorders-flight-info" : undefined} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 mb-4">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-2.5">
                      <InfoRow icon={<FiCalendar />} label={lang === "EN" ? "Arrival Time" : "وقت الوصول"} value={header?.orderHeaderFlightArrivalDatTime ? formatDate(header.orderHeaderFlightArrivalDatTime) : null} />
                      <InfoRow icon={<MdDeliveryDining />} label={lang === "EN" ? "Arrival Delivery Time" : "وقت توصيل الوصول"} value={header?.orderHeaderArrivalDeliveryDate ? formatDate(header.orderHeaderArrivalDeliveryDate) : null} />
                      <InfoRow icon={<MdDeliveryDining />} label={lang === "EN" ? "Departure Delivery Time" : "وقت توصيل المغادرة"} value={header?.orderHeaderDeliveryDateTime ? formatDate(header.orderHeaderDeliveryDateTime) : null} />
                      <InfoRow icon={<FiCalendar />} label={lang === "EN" ? "Departure Time" : "وقت المغادرة"} value={header?.orderHeaderDepatrialDateTime ? formatDate(header.orderHeaderDepatrialDateTime) : null} />
                      <InfoRow icon={<FaMapMarkerAlt />} label={lang === "EN" ? "Station" : "المحطة"} value={header?.orderHeaderStationName} />
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-2.5">
                      <InfoRow icon={<FaPlane />} label={lang === "EN" ? "Flight Number" : "رقم الرحلة"} value={header?.orderHeaderFlightNumberName} />
                      <InfoRow icon={<FaTag />} label={lang === "EN" ? "Registration" : "تسجيل الطائرة"} value={header?.orderHeaderAcregName} />
                      <InfoRow icon={<FaPlane />} label={lang === "EN" ? "Aircraft Type" : "نوع الطائرة"} value={header?.orderHeaderActypeName} />
                      <InfoRow
                        icon={<FaUsers />}
                        label={lang === "EN" ? "Passengers" : "الركاب"}
                        value={header?.orderHeaderPaxnum ? (lang === "EN" ? String(header.orderHeaderPaxnum) : toArabicNumbers(header.orderHeaderPaxnum)) : null}
                      />
                      <InfoRow
                        icon={<FaUsers />}
                        label={lang === "EN" ? "Crew" : "الطاقم"}
                        value={header?.orderHeaderCrewNum ? (lang === "EN" ? String(header.orderHeaderCrewNum) : toArabicNumbers(header.orderHeaderCrewNum)) : null}
                      />
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-2.5">
                      <InfoRow icon={<FaBuilding />} label={lang === "EN" ? "Agent" : "الوكيل"} value={header?.orderHeaderAgentName} />
                      <InfoRow icon={<FaBuilding />} label={lang === "EN" ? "Operator" : "المشغل"} value={header?.orderHeaderOperatorName} />
                      <InfoRow icon={<FaBuilding />} label={lang === "EN" ? "Bill To" : "الفاتورة لـ"} value={header?.orderHeaderBillToName} />
                    </div>
                  </div>

                  {/* Financials — only shown when subtotal exists */}
                  {!!header?.orderHeaderNetUsd && (
                    <div
                      className="rounded-xl p-3 mb-4 flex flex-wrap gap-x-6 gap-y-2 flex-row-reverse"
                      style={{ background: "rgba(197,167,109,0.06)", border: "1px solid rgba(197,167,109,0.15)" }}
                    >
                      <FinancialItem
                        icon={<FaMoneyBillWave />}
                        label={lang === "EN" ? "Items Total" : "إجمالي الأصناف"}
                        value={`${header.orderHeaderNetUsd.toFixed(2)} ${langText.USD[lang]}`}
                      />
                      {!!header?.orderHeaderTransportaion && (
                        <FinancialItem
                          icon={<FaTruck />}
                          label={lang === "EN" ? "Transportation" : "النقل"}
                          value={`${header.orderHeaderTransportaion.toFixed(2)} ${langText.USD[lang]}`}
                        />
                      )}
                      {!!header?.orderHeaderAirportCost && (
                        <FinancialItem
                          icon={<FaMapMarkerAlt />}
                          label={lang === "EN" ? "Airport Fees" : "رسوم المطار"}
                          value={`${header.orderHeaderAirportCost.toFixed(2)} ${langText.USD[lang]}`}
                        />
                      )}
                      {!!header?.orderHeaderHandling && (
                        <FinancialItem
                          icon={<FaTag />}
                          label={lang === "EN" ? "Handling" : "التعامل"}
                          value={`${header.orderHeaderHandling.toFixed(2)} ${langText.USD[lang]}`}
                        />
                      )}
                      {!!header?.orderHeaderDiscount && (
                        <FinancialItem
                          icon={<FaPercentage />}
                          label={`${lang === "EN" ? "Discount" : "الخصم"}${header?.orderHeaderDiscountPercent ? ` (${header.orderHeaderDiscountPercent}%)` : ""}`}
                          value={`-${header.orderHeaderDiscount.toFixed(2)} ${langText.USD[lang]}`}
                          red
                        />
                      )}
                    </div>
                  )}

                  {/* Footer: Grand Total + View button */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-3 flex-row-reverse" style={{ borderTop: "1px solid var(--color-light-gray)" }}>
                    {!!header?.orderHeaderGrossUsd ? (
                      <span className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                        {lang === "EN"
                          ? header.orderHeaderGrossUsd.toFixed(2)
                          : toArabicNumbers(header.orderHeaderGrossUsd.toFixed(2))}{" "}
                        {langText.USD[lang]}
                      </span>
                    ) : (
                      <span />
                    )}

                    <div className="flex flex-wrap items-center gap-3 flex-row-reverse">
                      <button
                        id={index === 0 ? "guide-myorders-view-details" : undefined}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md active:scale-95"
                        style={{ background: "linear-gradient(135deg, var(--color-primary), #a8894f)" }}
                        onClick={() => navigate(`/order/${header?.orderHeaderId}`)}
                      >
                        <FiEye size={14} />
                        {langText.viewOrder[lang]}
                      </button>
                      {/* Order Again button */}
                      <button
                        id={index === 0 ? "guide-myorders-order-again" : undefined}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md active:scale-95 bg-secondary"
                        // style={{ background: "linear-gradient(135deg, #C5A76D 0%, #a8883a 100%)" }}
                        onClick={() => setOrderAgainId(header?.orderHeaderId)}
                      >
                        <FiRefreshCw size={14} />
                        {lang === "AR" ? "طلب مجدداً" : "Order Again"}
                      </button>
                      {routeStatus === "archived" ? (
                        <button
                          id={index === 0 ? "guide-myarchive-restore" : undefined}
                          onClick={() => restoreOrderMutation.mutate(header?.orderHeaderId)}
                          disabled={restoreOrderMutation.isPending}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-md transition-all whitespace-nowrap ${restoreOrderMutation.isPending
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                            : "bg-[#2F7D46] hover:bg-[#246337] text-white cursor-pointer"
                            }`}
                        >
                          ↩ {lang === "EN" ? "Restore From Archive" : "استعادة من الأرشيف"}
                        </button>
                      ) : (
                        <>
                          <button
                            id={index === 0 ? "guide-myorders-archive" : undefined}
                            onClick={() => archiveOrderMutation.mutate(header?.orderHeaderId)}
                            disabled={archiveOrderMutation.isPending}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-md transition-all whitespace-nowrap ${archiveOrderMutation.isPending
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                              : "bg-[#49494A] hover:bg-[#333333] text-white cursor-pointer"
                              }`}
                          >
                            🗃 {lang === "EN" ? "Send to Archive" : "إرسال إلى الأرشيف"}
                          </button>
                          {![10, 11].includes(header?.orderHeaderStatusID) && (
                            <button
                              id={index === 0 ? "guide-myorders-track" : undefined}
                              onClick={() => navigate(`/order/${header?.orderHeaderId}/tracking`)}
                              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FBFBFA] text-[#49494A] border border-[#E5E5E5] rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer"
                            >
                              <MdTimeline style={{ color: "var(--color-primary)" }} size={16} /> {lang === "EN" ? "Track Order" : "تتبع الطلب"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;

/* ── Inline helper components ─────────────────────────────────────── */

/** Renders a label+icon+value row. Returns null when value is falsy. */
function InfoRow({ icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-2 text-xs text-gray-500 min-w-0">
      <span className="mt-0.5 shrink-0" style={{ color: "var(--color-primary)" }}>{icon}</span>
      <span className="shrink-0 font-medium">{label}:</span>
      <span className="font-semibold text-gray-700 truncate">{value}</span>
    </div>
  );
}

/** Compact financial pill. */
function FinancialItem({ icon, label, value, red }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span style={{ color: red ? "#EF4444" : "var(--color-primary)" }}>{icon}</span>
      <span className="text-gray-500">{label}:</span>
      <span className="font-semibold" style={{ color: red ? "#EF4444" : "var(--color-secondary)" }}>{value}</span>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "";
  const d1 = new Date(d);
  return d1.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


