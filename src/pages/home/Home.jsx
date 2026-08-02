import React, { useEffect, useState } from 'react'
import { langText, toArabicNumbers } from '../../assets/constants/lang'
import { onlineOrderToast } from '../../assets/Helpers/onlineOrderToast';
import { useLangStore } from '../../assets/store/langStore';
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaLock, FaMinus, FaUtensils, FaShippingFast, FaStar, FaClock, FaRegBell, FaShoppingCart, FaChevronDown, FaChevronLeft, FaChevronRight, FaPlane, FaTag, FaBuilding, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { MdAirplanemodeActive, MdDeliveryDining } from "react-icons/md";
import { IoMdClose } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import Bars from '../../components/Bars';
import Menu from '../../components/Menu';
import { useGuide } from '../../context/GuideContext';
import { useCartStore } from '../../assets/store/cartStore';
import CreateOrderModal from '../../components/CreateOrderModal';
import Review from '../../components/Review';
import useAuthStore from '../../assets/store/authStore';
import { getMyOrders, getOrderDetails } from '../../assets/apis/order/OrderApi';
import { useQuery } from '@tanstack/react-query';
import { useNotificationStore } from '../../assets/store/notificationStore';
import { UpdateNotification } from '../../assets/apis/notifications/Notifications';
import useReviewMutation from '../../assets/apis/review/ReviewMutation';
import { BiLoaderAlt } from "react-icons/bi";
import { useStationStore } from '../../assets/store/stationStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

export function HomeHero({ lang, onOrderClick }) {
  return (
    <div style={{ position: "fixed", zIndex: -1, height: "100vh", width: "100vw", top: 0, opacity: 0.8 }} className="home-hero-section">
      <div className="absolute inset-0 bg-black/30 w-full h-full z-10"></div>
      <div className="home-hero-bg" style={{ backgroundImage: `url('/images/hero_bg_home.png')` }} />
      <div className="home-hero-overlay" />
      <div className="home-hero-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="home-hero-particle" style={{ '--i': i }} />
        ))}
      </div>
      <div className="home-hero-content"></div>
    </div>
  );
}

function Home() {
  const { lang } = useLangStore();
  const [selectedBar, setSelectedBar] = useState(0);
  const { cart, updateQuantity, setSelectedOrder, selectedOrder } = useCartStore();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [reviewsIds, setReviewsIds] = useState([]);
  const navigate = useNavigate();
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [cartTab, setCartTab] = useState('All');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { selectedStation, setSelectedStation } = useStationStore();
  const ordersScrollRef = useRef(null);

  const { data: myOrders, isLoading } = useQuery({
    queryKey: ['myOrders', "active"],
    queryFn: () => getMyOrders("active"),
    retry: 5,
    enabled: !!user,
    refetchInterval: 1000 * 60 * 1,
    // select: (data) => data?.filter(item => item?.header?.orderHeaderStatusID <= 15)
  });

  useEffect(() => {
    if (selectedOrder && selectedStation && selectedOrder.orderHeaderStationName !== selectedStation?.stationName) {
      setSelectedOrder(null);
    }
  }, [selectedStation, selectedOrder, setSelectedOrder]);

  useEffect(() => {
    if (location.state?.scrollToItemId) {
      setSelectedBar(0);
    }
  }, [location.state?.scrollToItemId]);


  const { ReviewedMutation } = useReviewMutation();


  const { data: myDeliveredOrders, isLoading: deliveredLoading } = useQuery({
    queryKey: ['myOrders', "delivered"],
    queryFn: () => getMyOrders("delivered"),
    retry: 5,
    enabled: !!user,
    refetchInterval: 1000 * 60 * 1,
    // select: (data) => data?.filter(item => item?.header?.orderHeaderStatusID <= 15)
  });
  useEffect(() => {
    if (!myOrders?.length) return;
    // If navigated from OrderDetails with a specific order, activate it first
    const targetOrderId = location.state?.activeOrderId;
    if (targetOrderId) {
      const matched = myOrders.find((o) => o?.header?.orderHeaderId == targetOrderId);
      if (matched) {
        setSelectedOrder(matched.header);
        return;
      }
    }
    // Otherwise keep the currently selected order in sync with fresh data
    setSelectedOrder(myOrders.find((order) => order?.header?.orderHeaderId == selectedOrder?.orderHeaderId)?.header);
  }, [myOrders]);

  const { data: orderDetails, isLoading: orderDetailsLoading, isFetching: orderDetailsFetching } = useQuery({
    queryKey: ['orderDetails', selectedOrder?.orderHeaderId],
    queryFn: () => getOrderDetails(selectedOrder?.orderHeaderId),
    retry: 5,
    enabled: !!user && !!selectedOrder,
  });

  const { notifications } = useNotificationStore();

  function handleReview(id) {
    if (reviewsIds.includes(id)) {
      setReviewsIds(reviewsIds.filter((i) => i !== id));
      ReviewedMutation.mutate(id);
    } else {
      setReviewsIds([...reviewsIds, id]);
    }
  }

  const detailsArray = React.useMemo(() => {
    if (!orderDetails) return [];
    if (Array.isArray(orderDetails?.at(0)?.details)) return orderDetails?.at(0)?.details;
    return [];
  }, [orderDetails]);

  const filteredDetails = React.useMemo(() => {
    if (cartTab === 'Arrival') return detailsArray.filter(item => item.orderDetailsIsArrival);
    if (cartTab === 'Departure') return detailsArray.filter(item => item.orderDetailsIsDepartur);
    return detailsArray;
  }, [detailsArray, cartTab]);

  const groupedDetails = React.useMemo(() => {
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


  function renderCartContent({ inDrawer = false } = {}) {
    if (!selectedOrder || !user) {
      return (
        <div className={`bg-white p-6 flex flex-col items-center justify-center border border-[#E5E5E5] shadow-sm ${inDrawer ? 'flex-1 rounded-none' : 'h-[550px] border-t-0 rounded-b-2xl'}`}>
          <div className="text-center flex flex-col items-center justify-center gap-4">
            <img src="images/empty-cart.svg" className="w-20 opacity-60" alt="" />
            <p className="text-[#6b6b6b] text-sm font-semibold max-w-[200px] leading-relaxed">
              {langText.pleaseSelectAnOrderToViewItsDetails[lang]}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-white border border-[#E5E5E5] pt-2 flex flex-col ${inDrawer ? 'flex-1 rounded-none border-0' : 'h-[550px] border-t-0 rounded-b-2xl shadow-sm'}`}>
        {selectedOrder?.orderHeaderIsArrival && selectedOrder?.orderHeaderIsDeparture && <div className="flex bg-[#F6F4EF] p-1.5 m-3 rounded-xl gap-1 shrink-0">
          {['All', 'Arrival', 'Departure'].map((tab) => {
            const active = cartTab === tab;
            return (
              <button key={tab} onClick={() => setCartTab(tab)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all"
                style={{ backgroundColor: active ? '#FFFFFF' : 'transparent', color: active ? '#49494A' : '#6b6b6b', boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none' }}
              >
                {tab === 'All' ? (lang === 'AR' ? 'الكل' : 'All') : tab === 'Arrival' ? (lang === 'AR' ? 'الوصول' : 'Arrival') : (lang === 'AR' ? 'المغادرة' : 'Departure')}
              </button>
            );
          })}
        </div>}
        <div className="grid grid-cols-14 gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-[#F0F0F0] shrink-0">
          <div className="col-span-5">{lang === 'AR' ? 'العنصر' : 'Item'}</div>
          <div className="col-span-3 text-center">{lang === 'AR' ? 'الكمية' : 'Quantity'}</div>
          <div className="col-span-3 text-right">{lang === 'AR' ? 'سعر الوحدة' : 'Unit Price'}</div>
          <div className="col-span-3 text-right">{lang === 'AR' ? 'السعر' : 'Total Price'}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {(orderDetailsLoading || orderDetailsFetching) ? <BiLoaderAlt className="animate-spin mx-auto my-10 text-primary" size={30} /> :
            filteredDetails.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">{lang === 'AR' ? 'لا توجد عناصر' : 'No items found'}</div>
            ) : (
              Object.entries(groupedDetails).map(([groupName, items]) => (
                <div key={groupName} className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#C5A76D] bg-[#FBFBFA] px-3 py-1.5 rounded-xl border border-[#EFEFEF] mt-3 first:mt-0 shadow-sm inline-block">
                    {groupName}
                  </div>
                  {items.map((item, idx) => {
                    const isArrival = item.orderDetailsIsArrival;
                    const isDeparture = item.orderDetailsIsDepartur;
                    return (
                      <div key={idx} className="grid grid-cols-14 gap-2 items-center p-3 rounded-2xl border bg-[#FBFBFA] text-xs transition-all hover:shadow-sm" style={{ borderColor: '#EFEFEF' }}>
                        <div className="col-span-5 flex flex-col gap-1 min-w-0">
                          <span className="font-bold text-[#49494A] leading-tight" title={item.orderDetailsName}>
                            {item.orderDetailsName ? (item.orderDetailsName.length > 20 ? item.orderDetailsName.substring(0, 10) + '...' : item.orderDetailsName) : '—'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {isArrival && (<span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold bg-[#EEF6F0] text-[#2F7D46] border border-[#2F7D46]/10 shrink-0"><span>🛬</span>{lang === 'AR' ? 'وصول' : 'Arr'}</span>)}
                            {isDeparture && (<span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold bg-[#FBF8F1] text-[#C5A76D] border border-[#C5A76D]/10 shrink-0"><span>🛫</span>{lang === 'AR' ? 'مغادرة' : 'Dep'}</span>)}
                          </div>
                        </div>
                        <div className="col-span-3 text-center font-bold text-[#49494A]">{item.orderDetailsQty}</div>
                        <div className="col-span-3 text-right text-[10px] text-gray-500">${(item.orderDetailsPriceUsd || 0).toFixed(2)}</div>
                        <div className="col-span-3 text-right font-extrabold text-[#C5A76D]">${(item.orderDetailsLineTotalUsd || 0).toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
        </div>
        <div className="p-4 border-t border-[#E5E5E5] bg-[#FDFDFD] shrink-0 space-y-3" style={{ borderRadius: inDrawer ? '0' : '0 0 1rem 1rem' }}>
          {!!selectedOrder.orderHeaderNetUsd && (
            <>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400 font-medium">{lang === "EN" ? "Items subtotal" : "إجمالي الأصناف"}</span>
                <span className="text-xs">{lang === "EN" ? `${(selectedOrder.orderHeaderNetUsd || 0).toFixed(2)} USD` : `${toArabicNumbers((selectedOrder.orderHeaderNetUsd || 0).toFixed(2))} دولار`}</span>
              </div>
              {!!selectedOrder.orderHeaderTransportaion &&
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400 font-medium">{lang === "EN" ? "Transportation" : "النقل"}</span>
                  <span className="text-xs">{lang === "EN" ? `${(selectedOrder.orderHeaderTransportaion || 0).toFixed(2)} USD` : `${toArabicNumbers((selectedOrder.orderHeaderTransportaion || 0).toFixed(2))} دولار`}</span>
                </div>}
              {!!selectedOrder.orderHeaderAirportCost &&
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400 font-medium">{lang === "EN" ? "Airport Fees" : "رسوم المطار"}</span>
                  <span className="text-xs">{lang === "EN" ? `${(selectedOrder.orderHeaderAirportCost || 0).toFixed(2)} USD` : `${toArabicNumbers((selectedOrder.orderHeaderAirportCost || 0).toFixed(2))} دولار`}</span>
                </div>}
              {!!selectedOrder.orderHeaderAirportCost &&
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400 font-medium">{lang === "EN" ? "Handling Fees" : "رسوم المناولة"}</span>
                  <span className="text-xs">{lang === "EN" ? `${(selectedOrder.orderHeaderHandling || 0).toFixed(2)} USD` : `${toArabicNumbers((selectedOrder.orderHeaderHandling || 0).toFixed(2))} دولار`}</span>
                </div>}
              {!!selectedOrder.orderHeaderAirportCost &&
                <div className="flex justify-between items-baseline text-[#f87171]">
                  <span className="text-xs text-gray-400 font-medium">{lang === "EN" ? "Discount" : "الخصم"}</span>
                  <span className="text-xs">{lang === "EN" ? ` (${((selectedOrder.orderHeaderDiscountPercent || 0).toFixed(2))} %) ${(selectedOrder.orderHeaderDiscount || 0).toFixed(2)} USD` : `(${toArabicNumbers((selectedOrder.orderHeaderDiscountPercent || 0).toFixed(2))} %) ${toArabicNumbers((selectedOrder.orderHeaderDiscount || 0).toFixed(2))} دولار`}</span>
                </div>}
              {!!selectedOrder.orderHeaderGrossUsd && <hr />}
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400 font-medium">{lang === "EN" ? "Grand Total" : "الإجمالي الكلي"}</span>
                <span className="text-base font-extrabold text-primary">{lang === "EN" ? `${(selectedOrder.orderHeaderGrossUsd || 0).toFixed(2)} USD` : `${toArabicNumbers((selectedOrder.orderHeaderGrossUsd || 0).toFixed(2))} دولار`}</span>
              </div>
            </>
          )}
          <button
            onClick={() => { if (!user) { onlineOrderToast.error(langText.pleaseLoginFirst[lang]); navigate("/login"); return; } setIsCartDrawerOpen(false); navigate(`/order/${selectedOrder.orderHeaderId}`); }}
            className="w-full py-3 mt-1 rounded-xl text-sm font-bold text-white transition-all hover:opacity-95 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #C5A76D 0%, #b08848 100%)' }}
          >
            {lang === 'AR' ? 'عرض تفاصيل الطلب' : 'View Order Details'}
          </button>
        </div>
      </div>
    );
  }

  const { guideEnabled } = useGuide();
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
        }
      }
    ] : []);

  return (
    <div>
      <CreateOrderModal isOpen={isCreateOrderModalOpen} onClose={() => setIsCreateOrderModalOpen(false)} />
      <HomeHero lang={lang} onOrderClick={() => setIsCreateOrderModalOpen(true)} />
      {/* Orders Carousel */}
      {user && (displayOrders.length > 0 || guideEnabled || isLoading) && (
        <div id="guide-orders-carousel" className="relative container mx-auto px-2">
          {/* Left Arrow */}
          <button
            onClick={() => ordersScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-[#E5E5E5] shadow-md flex items-center justify-center text-[#C5A76D] hover:bg-white transition-all cursor-pointer -translate-x-1"
            aria-label="Scroll left"
          >
            <FaChevronLeft size={14} />
          </button>

          {/* Scrollable Track */}
          <div
            ref={ordersScrollRef}
            className="flex items-stretch overflow-x-auto gap-0 scroll-smooth snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(isLoading && !guideEnabled)
              ? <div className="flex-shrink-0 w-full flex items-center justify-center h-32"><BiLoaderAlt className='text-primary animate-spin' size={30} /></div>
              : [...displayOrders]
                .sort((a, b) => new Date(b?.header?.orderHeaderAirCatringCretionDate ?? 0) - new Date(a?.header?.orderHeaderAirCatringCretionDate ?? 0))
                .map((order, index) => (
                  <div key={index} className="flex-shrink-0 w-[90vw] sm:w-[360px] snap-start" style={{ display: 'flex', flexDirection: 'column' }}>
                    <RunningOrder order={order} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} setSelectedStation={setSelectedStation} />
                  </div>
                ))
            }
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => ordersScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-[#E5E5E5] shadow-md flex items-center justify-center text-[#C5A76D] hover:bg-white transition-all cursor-pointer translate-x-1"
            aria-label="Scroll right"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      )}


      <div className="flex items-center justify-center py-5">
        <motion.button
          id="guide-add-order-btn"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { if (user) { setIsCreateOrderModalOpen(true) } else { navigate("/register") } }}
          className="home-hero-cta"
        >
          <FaPlus className="text-sm" />
          {user ? <span>{langText.addNewOrder?.[lang] || "Add New Order"}</span> : <span>{langText.reQuestFullMenu?.[lang] || "Request Full Menu"}</span>}
        </motion.button>
      </div>

      <div dir={lang === 'AR' ? 'rtl' : 'ltr'} className="container mx-auto px-3 pb-10">
        <Bars setSelectedBar={setSelectedBar} selectedBar={selectedBar} lang={lang} />
        <div className="flex w-full mt-6">
          <Menu scrollToItemId={location.state?.scrollToItemId} orderDetails={orderDetails} orderDetailsLoading={orderDetailsLoading} />
          <div className={`w-[33.33%] hidden lg:block ${lang === 'AR' ? 'pr-2' : 'pl-2'} sticky top-2 self-start`}>
            <div className="bg-[#49494A] p-4 text-center rounded-t-2xl border-b border-[#C5A76D] shadow-sm">
              <p className="text-xs uppercase tracking-widest text-[#C5A76D] font-semibold mb-1">
                {lang === "AR" ? "الطلب المحدد" : "Selected Order"}
              </p>
              <h3 className="text-white text-sm font-bold truncate">
                {selectedOrder ? selectedOrder.orderHeaderOrderNumber : langText.selectOrder[lang]}
              </h3>
            </div>
            {renderCartContent()}
          </div>
        </div>
      </div>

      <motion.button
        id="mobile-cart-fab"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl lg:hidden"
        style={{ background: 'linear-gradient(135deg, #C5A76D 0%, #b08848 100%)' }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        onClick={() => setIsCartDrawerOpen(true)}
        aria-label={lang === 'AR' ? 'فتح سلة الطلب' : 'Open order cart'}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <FaShoppingCart className="text-white text-xl" />
        <AnimatePresence>
          {selectedOrder && detailsArray.length > 0 && (
            <motion.span key="fab-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 bg-[#49494A] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
            >
              {detailsArray.length}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isCartDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div key="cart-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsCartDrawerOpen(false)}
            />
            <motion.div key="cart-drawer-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute right-0 top-0 h-full w-[90vw] max-w-sm bg-white flex flex-col shadow-2xl overflow-hidden"
              style={{ borderRadius: '20px 0 0 20px' }}
            >
              <div className="px-4 py-3 flex items-center justify-between shrink-0"
                style={{ background: 'linear-gradient(135deg, #49494A 0%, #2e2e2f 100%)', borderBottom: '1px solid #C5A76D' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-[#C5A76D] font-semibold">
                    {lang === "AR" ? "الطلب المحدد" : "Selected Order"}
                  </p>
                  <h3 className="text-white text-sm font-bold truncate">
                    {selectedOrder ? selectedOrder.orderHeaderOrderNumber : langText.selectOrder[lang]}
                  </h3>
                </div>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setIsCartDrawerOpen(false)}
                  className="ml-3 flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  aria-label={lang === 'AR' ? 'إغلاق' : 'Close'}
                >
                  <IoMdClose size={18} />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col">
                {renderCartContent({ inDrawer: true })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home

export function RunningOrder({ order, selectedOrder, setSelectedOrder, setSelectedStation }) {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const { availableStations } = useStationStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedOrder?.orderHeaderId === order?.header?.orderHeaderId;

  useEffect(() => {
    if (isSelected) setIsExpanded(true);
  }, [isSelected]);

  const rawArrival = order?.header?.orderHeaderDeliveryDateTime;

  function parseDate(val) {
    if (!val) return null;
    const d = new Date(val);
    if (!isFinite(d.getTime())) return null;
    return d;
  }

  const arrivalDate = parseDate(rawArrival);
  const minutesUntil = arrivalDate !== null ? Math.round((arrivalDate.getTime() - Date.now()) / 60000) : null;
  const SHOW_MINS_IF_WITHIN = 50;
  const shouldShowPreset = minutesUntil === null || minutesUntil <= SHOW_MINS_IF_WITHIN;

  const isOrderDelay = new Date(order?.header?.orderHeaderDeliveryDateTime) < new Date();
  const isOrderOnHisWay = order?.header?.orderHeaderStatusID === 8;
  const isOrderDelivered = order?.header?.orderHeaderStatusID > 8;
  const isOrderPending = order?.header?.orderHeaderStatusID <= 5;

  function formatArrival(d) {
    if (!d) return "";
    return d.toLocaleString(lang === "AR" ? "ar-EG" : "en-GB", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
  }

  const displayText = isOrderOnHisWay
    ? (langText.onHisWay?.[lang] ?? langText.onHisWay)
    : isOrderDelay
      ? (langText.SorryForTheDelayWeWllNotifyYouAsSoonAsYourOrderIsOnTheWay?.[lang] ?? langText.SorryForTheDelayWeWllNotifyYouAsSoonAsYourOrderIsOnTheWay)
      : (isOrderPending && shouldShowPreset)
        ? (langText.orderPending?.[lang] ?? langText.orderPending)
        : shouldShowPreset
          ? (langText.mins35502?.[lang] ?? langText.mins35502)
          : formatArrival(arrivalDate);

  if (!order) return null;
  const h = order.header;
  const trackingSteps = order.tracking || [];
  let currentTrackingStatus = null;
  if (trackingSteps.length > 0) {
    const currentIndex = trackingSteps.findIndex(s => !s.completed);
    currentTrackingStatus = currentIndex !== -1 ? trackingSteps[currentIndex].name : (lang === "EN" ? "Completed" : "مكتمل");
  }
  console.log("header", h);


  const statusConfig = isOrderOnHisWay
    ? { color: "#2F7D46", bg: "#EEF6F0", pulse: true }
    : isOrderDelay
      ? { color: "#B54848", bg: "#FAECEC", pulse: false }
      : isOrderDelivered
        ? { color: "#2F7D46", bg: "#EEF6F0", pulse: false }
        : { color: "#B88E52", bg: "#F7F3EA", pulse: true };

  const infoPills = [
    h.orderHeaderFlightNumberName && { icon: "✈", label: h.orderHeaderFlightNumberName },
    h.orderHeaderOperatorName && { icon: "🏢", label: h.orderHeaderOperatorName },
    h.orderHeaderStationName && { icon: "📍", label: h.orderHeaderStationName },
    h.orderHeaderActypeName && { icon: "🛩", label: h.orderHeaderActypeName },
  ].filter(Boolean);

  function handleHeaderClick(e) {
    e.stopPropagation();
    setSelectedOrder(h);
    if (h.orderHeaderStationName) {
      const stationObj = availableStations?.find(
        (s) => (typeof s === 'object' ? s.stationName : s) === h.orderHeaderStationName
      );
      setSelectedStation(stationObj || h.orderHeaderStationName);
    }
    setIsExpanded(prev => !prev);
  }
  useEffect(() => {
    console.log("selectedOrder home", selectedOrder);

  }, [selectedOrder])

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

  function CardBody() {
    const isArrival = !!h?.orderHeaderIsArrival;
    const isDeparture = !!(h?.orderHeaderIsDeparture || h?.orderHeaderIsDepartur);

    return (
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-2.5 px-5 pt-3 pb-1">
          {/* Timing & Station */}
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
            {/* Arrival dates — only when isArrival */}
            {isArrival && (
              <>
                <InfoRow icon={<FiCalendar size={12} />} label={lang === "EN" ? "Arrival Time" : "وقت الوصول"} value={h?.orderHeaderFlightArrivalDatTime ? formatArrival(new Date(h?.orderHeaderFlightArrivalDatTime)) : null} />
                <InfoRow icon={<MdDeliveryDining size={12} />} label={lang === "EN" ? "Arr. Delivery" : "توصيل الوصول"} value={h?.orderHeaderArrivalDeliveryDate ? formatArrival(new Date(h?.orderHeaderArrivalDeliveryDate)) : null} />
              </>
            )}
            {/* Departure dates — only when isDeparture */}
            {isDeparture && (
              <>
                <InfoRow icon={<FiCalendar size={12} />} label={lang === "EN" ? "Departure Time" : "وقت المغادرة"} value={h?.orderHeaderDepatrialDateTime ? formatArrival(new Date(h?.orderHeaderDepatrialDateTime)) : null} />
                <InfoRow icon={<MdDeliveryDining size={12} />} label={lang === "EN" ? "Dep. Delivery" : "توصيل المغادرة"} value={h?.orderHeaderDeliveryDateTime ? formatArrival(new Date(h?.orderHeaderDeliveryDateTime)) : null} />
              </>
            )}
            {/* Station always shown */}
            <InfoRow icon={<FaMapMarkerAlt size={12} />} label={lang === "EN" ? "Station" : "المحطة"} value={h?.orderHeaderStationName} />
          </div>

          <div className="w-full h-px bg-[#E5E5E5] opacity-50 my-0.5" />

          {/* Flight Details & Entities */}
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
            <InfoRow icon={<FaPlane size={12} />} label={lang === "EN" ? "Flight Number" : "رقم الرحلة"} value={h?.orderHeaderFlightNumberName} />
            <InfoRow icon={<FaTag size={12} />} label={lang === "EN" ? "Registration" : "تسجيل الطائرة"} value={h?.orderHeaderAcregName} />
            <InfoRow icon={<FaPlane size={12} />} label={lang === "EN" ? "Aircraft Type" : "نوع الطائرة"} value={h?.orderHeaderActypeName} />
            <InfoRow icon={<FaBuilding size={12} />} label={lang === "EN" ? "Agent" : "الوكيل"} value={h?.orderHeaderAgentName} />
            <InfoRow icon={<FaBuilding size={12} />} label={lang === "EN" ? "Operator" : "المشغل"} value={h?.orderHeaderOperatorName} />
            <InfoRow icon={<FaBuilding size={12} />} label={lang === "EN" ? "Bill To" : "الفاتورة لـ"} value={h?.orderHeaderBillToName} />
          </div>
        </div>
        <div className="mt-auto">
          <div className="px-5 pt-2">
            <div className="flex justify-between items-center rounded-xl px-3 py-2 border" style={{ borderColor: "#E5E5E5" }}>
              <span className="text-[11px] text-[#9b9b9b] font-medium uppercase tracking-wider">
                {lang === "AR" ? "الإجمالي" : "Order Total"}
              </span>
              <span className="font-bold text-[#49494A] text-[15px]">${h.orderHeaderGrossUsd.toFixed(2)}</span>
            </div>
          </div>
          <div className="px-5 pt-3 pb-4">
            <motion.button
              whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl py-2.5 font-semibold text-white text-sm tracking-wide transition"
              style={{ background: "linear-gradient(135deg, #C5A76D 50%, #b08848 100%)" }}
              onClick={(e) => { e.stopPropagation(); navigate(`/order/${h.orderHeaderId}`); }}
            >
              {langText.ViewOrderDetails?.[lang] ?? "View Order Details"}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-4" style={{ flex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div
          className="rounded-3xl overflow-hidden shadow-lg border cursor-pointer transition-all duration-300 ease-in-out flex flex-col"
          style={{ borderColor: isSelected ? "#C5A76D" : "#E5E5E5", background: "#FFFFFF", boxShadow: isSelected ? "0 0 10px 5px #C5A76D" : "none", transform: isSelected ? "scale(1.02)" : "none", flex: 1 }}
          onClick={handleHeaderClick}
        >
          <div className="px-6 pt-5 pb-4 select-none"
            style={{ background: "linear-gradient(135deg, #49494A 0%, #2e2e2f 100%)" }}
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C5A76D] mb-2">
                {lang === "AR" ? "طلبك الجاري" : "Active Order"}
              </p>
              <div className="flex flex-col items-end gap-2 ml-3 shrink-0">
                {h?.orderHeaderCurrentStatus && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-primary text-white border border-primary/20">
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                      className="w-1.5 h-1.5 rounded-full inline-block bg-white"
                    />
                    {h?.orderHeaderCurrentStatus}
                  </span>
                )}
                {/* {h.orderHeaderAirCatringEndOrder && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold border"
                    style={{ backgroundColor: "rgb(250, 236, 236)", color: "#B54848", borderColor: "#B54848" }}
                  >
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                      className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: statusConfig.color }}
                    />
                    <FaLock /> {lang == "EN" ? "Order Closed" : "تم إغلاق الطلب"}
                  </span>
                )} */}
              </div>
            </div>

            <h2 className="text-white text-lg font-bold leading-tight whitespace-normal break-words mt-1">
              {h.orderHeaderOrderNumber || h.orderHeaderRefrance || "—"}
            </h2>

            <div className="flex justify-between items-end mt-2">
              {h.orderHeaderAirCatringCretionDate ? (
                <p className="text-[#9b9b9b] text-[10px]">
                  {formatArrival(new Date(h.orderHeaderAirCatringCretionDate))}
                </p>
              ) : (
                <div />
              )}
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}
                className="lg:hidden text-[#C5A76D]" aria-hidden="true"
              >
                <FaChevronDown size={14} />
              </motion.div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col flex-1"><CardBody /></div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div key="accordion-body-mobile"
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden lg:hidden flex flex-col flex-1"
              >
                <CardBody />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export function RunningNotification({ notification }) {
  const { getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();
  const { lang } = useLangStore();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: UpdateNotification,
    onSuccess: () => {
      // Refetch from server so notificationStatusId is up to date
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const handleMarkRead = () => {
    const id = notification.notificationId || notification.NotificationId || notification.id || notification._id;
    mutate(id);
  };

  return (
    <div className="flex justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl shadow-md border border-[#E5E5E5] p-6 text-center flex flex-col items-center bg-blue-50 h-[320px]"
      >
        <div className="relative mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-sm mb-4 shrink-0">
          <FaRegBell size={28} className="text-primary" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
              {unreadCount}
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold text-[#49494A] line-clamp-1 w-full shrink-0" title={notification.notificationSubject || notification.NotificationSubject}>
          <pre>{notification.notificationSubject || notification.NotificationSubject || "Notification"}</pre>
        </h2>
        <div className="mt-2 text-[#6b6b6b] text-sm flex-grow w-full overflow-y-auto custom-scrollbar px-1">
          <pre>{notification.notificationMessage || notification.NotificationMessage}</pre>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="w-full mt-4 py-2 rounded-xl font-medium text-white bg-primary text-sm shrink-0"
          onClick={handleMarkRead}
        >
          {langText.markAsRead?.[lang] || "Mark as Read"}
        </motion.button>
      </motion.div>
    </div>
  );
}
