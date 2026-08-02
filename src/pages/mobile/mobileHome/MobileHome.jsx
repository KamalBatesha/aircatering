// MobileHome.jsx
import React, { useEffect, useRef, useState } from "react";
import MobileHero from '../../../components/mobile/MobileHero'
import { FaBars, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useLangStore } from "../../../assets/store/langStore";
import { langText, toArabicNumbers } from "../../../assets/constants/lang";
import HorizontalScrollNav from "../../../components/mobile/HorizontalScrollNav";
import MobileMenu from "../../../components/mobile/MobileMenu";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetAllProducts } from "../../../assets/apis/product/PeoductApi";
import { useCartStore } from "../../../assets/store/cartStore";
import Loading from "../../loading/Loading";

import { AnimatePresence, motion } from "framer-motion";
import { FaClock } from "react-icons/fa";
import { getMyOrders } from "../../../assets/apis/order/OrderApi";
import useAuthStore from "../../../assets/store/authStore";
import { useProductStore } from "../../../assets/store/productStore";
import Review from "../../../components/Review";
import useReviewMutation from "../../../assets/apis/review/ReviewMutation";
import { MdDeliveryDining } from "react-icons/md";


function MobileHome() {
  const [reviewsIds, setReviewsIds] = useState([]);
  const [myOrders, setMyOrders] = useState(null);

  const { lang } = useLangStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems, getTotalPrice } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const { setProduct } = useProductStore();

  const { ReviewedMutation } = useReviewMutation();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: GetAllProducts,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 5,
    select: (data) => {
      if (!Array.isArray(data)) return data;
      return data.filter((group) => {
        const itemsFlat = (group?.mainGroup ?? []).flatMap(
          (mg) => mg?.itemDatas ?? []
        );
        return itemsFlat.length > 0;
      });
    },
  });

  useEffect(() => {
    if (data) console.log("data", data);
  }, [data]);
  useEffect(() => {
    if (data) {
      console.log("data", data);
      const AllItems = data.flatMap(item =>
        item?.mainGroup?.flatMap(mainGroup =>
          mainGroup?.itemDatas || []
        ) || []
      );
      setProduct(AllItems);


    }
  }, [data])

  const { data: orders, isLoading: orderLoading, refetch } = useQuery({
    queryKey: ['myOrders'],
    queryFn: getMyOrders,
    retry: 5,
    refetchInterval: 60000,
    enabled: !!user,
    // staleTime:Infinity,
    // cacheTime:Infinity,
    // select: (data) => {
    //    return data.filter((order) => order?.header?.orderHeaderStatusID<9);
    // },
  })

  useEffect(() => {
    if (myOrders) {
      console.log("myOrders", myOrders);
    }
  }, [myOrders]);

  useEffect(() => {
    user && refetch();
  }, [user]);

  useEffect(() => {
    if (orders && !orderLoading && orders?.length > 0) {
      setMyOrders(orders?.filter((order) => order?.header?.orderHeaderStatusID < 9));
      console.log("orders", orders);
      const notReviewedOrders = orders?.filter((order) => order?.header?.orderHeaderStatusID > 8 && order?.header?.orderHeaderreviewSeen == false && order?.header?.orderHeaderStatusID !== 10 && order?.header?.orderHeaderStatusID < 10);
      setReviewsIds(notReviewedOrders?.map((order) => order?.header?.orderHeaderId));
    }
  }, [orders, orderLoading]);


  // active index shared between nav and content
  const [activeIndex, setActiveIndex] = useState(0);

  // refs for each category section (grandGroup)
  // we'll fill them via callback in MobileMenu

  // ref to the nav so we can read its height to offset scrolls
  const navRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const itemRefs = useRef([]);
  const lastScrolledIdRef = useRef(null);

  // يتم استدعاؤه من HorizontalScrollNav
  const registerItemRef = (el, idx) => {
    itemRefs.current[idx] = el; // حتى لو el === null نحدث المصفوفة
  };
  useEffect(() => {
    if (data) {
      console.log("data", data);

      itemRefs.current = new Array(data.length).fill(null);
    }
  }, [data]);


  // مهم جدًا — scroll بعد حدوث التغيير
  useEffect(() => {
    if (selectedIndex !== null) {
      const el = itemRefs.current[selectedIndex];
      const navEl = navRef.current;
      const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
      window.scrollTo({ top: el.offsetTop - navHeight, behavior: "smooth" });

    }
  }, [selectedIndex]);

  // Handle scroll to item from notification
  useEffect(() => {
    const itemId = location.state?.scrollToItemId;
    if (itemId && data?.length > 0 && lastScrolledIdRef.current !== itemId) {
      const groupIndex = data.findIndex(grandGroup =>
        grandGroup.mainGroup?.some(mainGroup =>
          mainGroup.itemDatas?.some(item => item.FoodMenuItemId === itemId)
        )
      );

      if (groupIndex !== -1) {
        lastScrolledIdRef.current = itemId;
        // Scroll to the category first (this updates the HorizontalNav active state)
        onCategorySelect(groupIndex);

        // Then scroll specifically to the item after a delay (to allow the section scroll to finish)
        setTimeout(() => {
          const el = document.getElementById(`menu-item-${itemId}`);
          if (el) {
            const navEl = navRef.current;
            const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
            const rect = el.getBoundingClientRect();
            const absoluteTop = window.scrollY + rect.top - navHeight - 16;

            window.scrollTo({ top: absoluteTop, behavior: "smooth" });

            // Highlight flash
            el.style.transition = 'box-shadow 0.3s';
            el.style.boxShadow = '0 0 0 3px #B88E52';
            el.style.borderRadius = '1rem';
            setTimeout(() => { el.style.boxShadow = ''; }, 2000);
          }
        }, 800);
      }
    }
  }, [location.state, data]);

  function handleReview(id) {
    if (reviewsIds.includes(id)) {
      setReviewsIds(reviewsIds.filter((i) => i !== id));
      ReviewedMutation.mutate(id);
    } else {
      setReviewsIds([...reviewsIds, id]);
    }
  }


  // handler when tapping a category in nav
  const onCategorySelect = (idx) => {
    setActiveIndex(idx);
    const el = itemRefs.current[idx];
    const navEl = navRef.current;
    const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;

    if (!el) return;
    // calc absolute top, subtract navHeight to avoid being hidden under sticky nav
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top - navHeight - 8; // -8 for small gap
    window.scrollTo({ top: Math.max(0, absoluteTop), behavior: "smooth" });
  };

  // detect scroll and update active index based on which section is nearest the top (under nav)
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const navEl = navRef.current;
        const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
        if (!itemRefs.current || itemRefs.current.length === 0) return;

        let bestIdx = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        itemRefs.current.forEach((el, idx) => {
          if (!el) return;
          // distance from top of viewport (adjusted by navHeight)
          const top = el.getBoundingClientRect().top - navHeight;
          const dist = Math.abs(top);
          if (dist < bestDistance) {
            bestDistance = dist;
            bestIdx = idx;
          }
        });

        // only update if changed
        // if (bestIdx !== activeIndex) {
        //   setActiveIndex(bestIdx);
        // }
        setActiveIndex(prev => (prev !== bestIdx ? bestIdx : prev));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // run once to sync on mount
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [data]); // reattach when data changes (new sections)

  const [showAllRunningOrders, setShowAllRunningOrders] = useState(false);

  const [numberOfVisibleOrders, setNumberOfVisibleOrders] = useState(1);

  const visibleOrders = (myOrders && myOrders.length > 0)
    ? (showAllRunningOrders ? myOrders : myOrders.slice(0, numberOfVisibleOrders))
    : [];

  const hiddenCount = myOrders ? Math.max(0, myOrders.length - numberOfVisibleOrders) : 0;

  useEffect(() => {
    if (myOrders && myOrders.length > 0) {
      setNumberOfVisibleOrders(1);
      const timer = setTimeout(() => {
        setNumberOfVisibleOrders(0);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [myOrders?.length]);

  return (
    <div className="relative pb-24">
      <MobileHero />
      {myOrders && myOrders?.length > 0 && user &&

        <div className="md:hidden fixed top-18 left-4 right-4 z-30 pointer-events-none">
          <div className="flex flex-col gap-3 items-center">
            <AnimatePresence initial={false}>
              {visibleOrders && visibleOrders.length > 0 && visibleOrders.map((order, idx) => (
                <motion.div
                  key={order.header?.orderHeaderId || order.id || idx}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, delay: idx * 0.06 }}
                  className="w-full pointer-events-auto"
                >
                  <RunningOrderMobile order={order} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      }

      {/* Floating circular toggle button (right side) */}
      {myOrders && myOrders.length > 0 && !!user && (
        <button
          onClick={() => setShowAllRunningOrders(prev => !prev)}
          className="fixed end-4 bottom-28 z-30 flex items-center justify-center w-14 h-14 border-primary rounded-full shadow-lg bg-white border border-[#E5E5E5]"
          aria-label={showAllRunningOrders ? "Hide running orders" : "Show all running orders"}
        >
          <motion.div
            initial={false}
            animate={{ rotate: showAllRunningOrders ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="flex items-center gap-1"
          >
            {/* show hidden count as a small badge when collapsed */}
            {!showAllRunningOrders && hiddenCount > 0 ? (
              <div className="relative flex items-center justify-center">
                <div className="absolute -top-3 -end-4 bg-[#B88E52] text-white rounded-full text-xs w-6 h-6 flex items-center justify-center font-semibold">
                  +{hiddenCount}
                </div>
                <FaChevronDown className="text-[#49494A] text-lg" />              </div>
            ) : (
              <FaChevronDown className="text-[#49494A] text-lg" />
            )}
          </motion.div>
        </button>
      )}

      {isLoading ? (<Loading />) : (<>
        <HorizontalScrollNav
          ref={navRef}
          data={data}
          activeIndex={activeIndex}
          onSelect={onCategorySelect}
          onCategoryChange={(idx) => setSelectedIndex(idx)}

        />
        {/* pass register callback so MobileMenu attaches refs to each section */}
        <MobileMenu Menu data={data} registerItemRef={registerItemRef} />
        {!!user && <div className="py-4 fixed bottom-0 w-full bg-white flex flex-col items-center justify-center border-0 border-t border-t-light-gray ">
          {getTotalPrice() < 80 && <p className="text-center mb-2 text-gray"
            style={{
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >{langText.minOrder80[lang]}</p>}
          <button
            // HANDLE touch first, then click as fallback
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/cart");
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/cart");
            }}
            className={`w-4/5 h-12 rounded-full ${getTotalPrice() < 80 ? "bg-gray-300" : "bg-primary"} flex items-center justify-between px-3 text-white`}
            style={{
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
            aria-label={langText.viewCart[lang]}
          >
            <div className="flex items-center gap-2 h-full">
              <div className={`h-[70%] aspect-square rounded-full ${getTotalPrice() < 80 ? "bg-gray-400" : "bg-[#9e7946]"} flex items-center justify-center`}>
                {lang == "EN" ? getTotalItems() : toArabicNumbers(getTotalItems())}
              </div>
              <p className="text-nowrap">{langText.viewCart[lang]}</p>
            </div>
            <p>
              {lang == "EN" ? getTotalPrice() : toArabicNumbers(getTotalPrice())}{" "}
              {langText.EGP[lang]}
            </p>
          </button>
        </div>}
      </>)}
      {orders?.length > 0 && reviewsIds?.length > 0 &&
        // safer: build reviewOrders from orders (original full list)
        orders
          .filter(order => reviewsIds.includes(order?.header?.orderHeaderId))
          .map(order => {
            const id = order?.header?.orderHeaderId;
            return (
              <Review
                key={id}
                order={order}
                onClose={() => handleReview(id)}
              />
            );
          })}

    </div>
  );
}

export default MobileHome;



// RunningOrderMobile.jsx


export function RunningOrderMobile({ order }) {
  const navigate = useNavigate();
  const { lang } = useLangStore();

  // Safety: name exactly as in your object
  const rawArrival = order?.header?.orderHeaderDeliveryDateTime;

  // Helper: parse a value into a Date and return null if invalid
  function parseDate(val) {
    if (!val) return null;
    const d = new Date(val);
    if (!isFinite(d.getTime())) return null;
    return d;
  }

  // Compute minutes difference from now (arrival - now). Could be negative.
  const arrivalDate = parseDate(rawArrival);
  const minutesUntil =
    arrivalDate !== null
      ? Math.round((arrivalDate.getTime() - Date.now()) / 60000)
      : null;

  // Condition: show preset mins text if arrival is missing/invalid OR within 50 minutes
  const SHOW_MINS_IF_WITHIN = 50; // minutes threshold
  const shouldShowPreset =
    minutesUntil === null || minutesUntil <= SHOW_MINS_IF_WITHIN;

  // Format arrival date in 24-hour style. If you prefer a different format adjust options.
  function formatArrival(d) {
    if (!d) return "";
    // Use 24-hour format and show date + hour:minute
    return d.toLocaleString(lang == "AR" ? "ar-EG" : "en-GB"
      , {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
  }

  const isOrderDelay = new Date(order?.header?.orderHeaderDeliveryDateTime) < new Date();
  console.log("isOrderDelay", isOrderDelay);

  const isOrderOnHisWay = order?.header?.orderHeaderStatusID === 8;
  const isOrderDelivered = order?.header?.orderHeaderStatusID > 8;
  const isOrderPending = order?.header?.orderHeaderStatusID <= 5;

  const displayText = isOrderOnHisWay
    ? (langText.onHisWay?.[lang] ?? langText.onHisWay)
    : isOrderDelay
      ? (langText.SorryForTheDelayWeWllNotifyYouAsSoonAsYourOrderIsOnTheWay?.[lang] ?? langText.SorryForTheDelayWeWllNotifyYouAsSoonAsYourOrderIsOnTheWay)
      : (isOrderPending && shouldShowPreset)
        ? (langText.orderPending?.[lang] ?? langText.orderPending)
        : shouldShowPreset
          ? (langText.mins35502?.[lang] ?? langText.mins35502)
          : formatArrival(arrivalDate);

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -8, opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5E5] p-4 flex items-center gap-4">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
          className="w-12 h-12 rounded-full bg-[#FFF4E6] flex items-center justify-center flex-shrink-0"
        >
          <FaClock className="text-[#B88E52]" size={20} />
        </motion.div>

        <div className="flex-1">
          {/* <p className="text-sm font-semibold text-[#49494A]">{langText.orderInProgress[lang]}</p> */}
          {!isOrderOnHisWay &&
            <p className="text-xs text-[#6b6b6b] mt-0.5">{langText.estimatedDelivery[lang]}</p>
          }
          <p className="text-sm font-bold text-[#B88E52] mt-1">{displayText}</p>

          {isOrderOnHisWay ?
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: 30 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.75, ease: "easeInOut" }}
              className="flex items-center mt-1 text-xl font-bold text-[#B88E52]"
            >
              <MdDeliveryDining />
            </motion.div>
            :
            <div className="mt-2 h-1.5 w-full bg-[#E5E5E5] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#B88E52] rounded-full"
                initial={{ width: "20%" }}
                animate={{ width: "80%" }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          }
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#B88E52]"
          onClick={() => navigate(`/order/${order?.header?.orderHeaderId}`)}
        >
          {langText.view[lang]}
        </motion.button>
      </div>
    </motion.div>
  );
}
