import { useEffect, useRef, useState } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaArchive, FaClipboardList, FaRegBell, FaUser, FaQuestion } from "react-icons/fa";
import { FaBagShopping, FaMapLocationDot, FaRegUser } from "react-icons/fa6";
import { GiShoppingCart } from "react-icons/gi";
import { HiOutlineMenu } from "react-icons/hi";
import { IoIosLogOut, IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Login from "../../pages/login/Login";
import { UpdateNotification } from "../apis/notifications/Notifications";
import { langText, toArabicNumbers } from "../constants/lang";
import useAuthStore from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useLangStore } from "../store/langStore";
import { useNotificationStore } from "../store/notificationStore";
import { useProductStore } from "../store/productStore";
import { useScreenViewStore } from "../store/screenViewStore";
import { useStationStore } from "../store/stationStore";
import { GetStationsList } from "../apis/PurchasingAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiArchive } from "react-icons/fi";
import { LiaClipboardListSolid } from "react-icons/lia";
import { useGuide } from "../../context/GuideContext";

// Improved Navbar with redesigned notifications dropdown + notification details modal

function Navbar() {
  const { setNavBarHeight, forgetPassword } = useScreenViewStore();
  const ref = useRef(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const { lang, toggleLang } = useLangStore();
  const { guideEnabled, setGuideEnabled } = useGuide();
  const { user, logout } = useAuthStore();
  const { cart, getTotalItems, clearCart, getTotalPrice } = useCartStore();
  const userMenuRef = useRef(null);
  const countryMenuRef = useRef(null);
  const notificationRefDesktop = useRef(null);
  const notificationRefMobile = useRef(null);
  const { notifications, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { availableStations, selectedStation, setSelectedStation, setAvailableStations } = useStationStore();
  const { data: stations } = useQuery({ queryKey: ["stations", !!user], queryFn: GetStationsList, enabled: !!user });
  useEffect(() => {
    console.log("availableStations", stations);

    if (stations && stations?.length > 0) {
      setAvailableStations(stations);
      if (!selectedStation) {
        setSelectedStation(stations[0]);
      }
    }
  }, [stations]);


  const isLogin = user ? true : false;
  const [userPopUp, setUserPopUp] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false); // My Account submenu in mobile panel
  const navigate = useNavigate();

  // New: selected notification for modal
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  function closeAllPopups() {
    setIsCountryOpen(false);
    setUserPopUp(null);
    setMobileOpen(false);
    setAccountOpen(false);
    setNotificationOpen(false);
  }
  function handelLogOut() {
    logout();
    clearCart();
    setAvailableStations([]);
    setSelectedStation(null);
    go("/login");
  }

  // helper to navigate and close mobile menu
  const go = (path) => {
    navigate(path);
    closeAllPopups();
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        if (userPopUp == "menu") setUserPopUp(null);
      }

      if (countryMenuRef.current && !countryMenuRef.current.contains(e.target)) {
        setIsCountryOpen(false);
      }

      if (
        notificationRefDesktop.current &&
        !notificationRefDesktop.current.contains(e.target) &&
        (!notificationRefMobile.current || !notificationRefMobile.current.contains(e.target))
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [userPopUp]);

  useEffect(() => {
    if (!ref.current) return;
    setNavBarHeight(ref.current.offsetHeight);
  }, [ref, setNavBarHeight]);

  const queryClient = useQueryClient();

  // When user clicks a notification: close menus and open modal with details
  const handleNotificationClick = (item) => {
    const id = item.notificationId;

    // server update — then refetch so notificationStatusId is up to date
    if (item.notificationStatusId === 1) {
      UpdateNotification(id)
        .catch(() => { })
        .finally(() => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        });
    }

    // close other popups and show modal
    closeAllPopups();
    setSelectedNotification(item);
    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setSelectedNotification(null);
    setShowNotificationModal(false);
  };

  // Utility: friendly time string (basic)
  const getNotificationTime = (item) => {
    const date = item.notificationDate || item.NotificationDate || item.createdAt || item.created_at || item.date;
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    return d.toLocaleString();
  };

  return (
    <nav
      ref={ref}
      className={`bg-secondary  z-50  w-full ${mobileOpen ? "fixed " : "relative"}`}
    >
      <div className="container mx-auto ">
        <div className="flex items-center justify-between px-6 lg:px-16 py-3">
          {/* start area: hamburger (mobile) + logo (clickable) */}
          <div className="flex items-center gap-4">
            {/* Hamburger only on mobile */}
            <button
              onClick={() => {
                setMobileOpen((s) => !s);
                // close other popups when opening mobile menu
                setIsCountryOpen(false);
                setUserPopUp(null);
              }}
              className="md:hidden p-2 rounded text-primary"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <IoMdClose className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>

            <a
              onClick={() => {
                navigate("/home");
                setMobileOpen(false);
              }}
              className="cursor-pointer group relative hidden md:flex items-center"
            >
              <img
                src="/images/logo-dark.png"
                className="w-32 md:w-40"
                alt="logo"
              />
            </a>
          </div>

          {/* end actions */}
          <div className="flex items-center gap-4">
            {/* Desktop actions (hidden on mobile) */}
            <div className="hidden md:flex items-center justify-end gap-8">
              {/* {isLogin && (user.roles?.length > 1 ? true : user.roles?.at(0) != "User" ? true : false) &&
                <button
                  onClick={() => {
                    if (window?.location?.href?.toLowerCase()?.includes("stella")) {
                      window.location.href = "https://test.skyculinaire.com/login?stella=true";
                    } else {
                      window.location.href = "https://test.skyculinaire.com/login";
                    }
                  }}
                  className="bg-primary rounded-full flex items-center justify-center gap-3 text-white cursor-pointer py-2 px-4 h-10"
                >
                  <span className="text-xl font-semibold">{langText.dashboard[lang]}</span>
                </button>
              } */}
              {/* Guide Mode Toggle */}
              {isLogin && (
                <button
                  onClick={() => setGuideEnabled(!guideEnabled)}
                  title={lang === 'EN' ? 'Interactive Guide' : 'الدليل التفاعلي'}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm border ${guideEnabled
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[#FBFBFA] text-primary border-[#E5E5E5] hover:bg-gray-50'
                    }`}
                  aria-label={lang === 'EN' ? 'Guide' : 'الدليل'}
                >
                  <FaQuestion className={`text-sm transition-transform duration-300 ${guideEnabled ? 'scale-110' : 'scale-100'}`} />
                  {guideEnabled && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={toggleLang}
                className="bg-primary rounded-full flex items-center justify-center gap-3 text-white cursor-pointer py-2 px-4 h-10"
              >
                <span className="text-xl font-semibold">{lang}</span>
                <AiOutlineGlobal className="text-2xl" />
              </button>

              {isLogin && availableStations?.length > 0 && (
                <div id="guide-station-select" className="relative flex items-center">
                  <select
                    value={selectedStation?.stationName || selectedStation || ""}
                    onChange={(e) => {
                      const matched = availableStations?.find((station) =>
                        (typeof station === 'object' ? station?.stationName : station) === e.target.value
                      );
                      setSelectedStation(matched || e.target.value);
                    }}
                    className="bg-white text-primary border border-primary rounded-full pl-4 pr-10 h-10 text-sm font-semibold outline-none cursor-pointer appearance-none shadow-sm"
                  >
                    <option value="" disabled>
                      {lang === "EN" ? "Select Station" : "اختر المحطة"}
                    </option>
                    {availableStations.map((station) => {
                      const id = typeof station === 'object' ? station?.stationId : station;
                      const name = typeof station === 'object' ? station?.stationName : station;
                      return (
                        <option key={id || name} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* <button
                ref={countryMenuRef}
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setUserPopUp(null);
                }}
                className="bg-primary rounded-full flex items-center justify-center text-white cursor-pointer p-2 h-10 w-10 relative"
              >
                <img src="/images/flag-eg.webp" className="w-full" alt="egypt flag" />

                <div
                  className={`absolute bg-white w-70 top-14 py-6 flex flex-col gap-6 border text-black after:w-3 after:h-3 after:border-t after:border-l after:bg-white after:absolute after:top-0 after:start-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:rotate-45 cursor-auto transition duration-300 ${isCountryOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                  <div className="flex justify-between items-center  text-black px-5 py-3">
                    <p className="font-semibold ">{langText.selectCountry[lang]}</p>
                    <IoMdClose onClick={() => setIsCountryOpen(false)} className="text-xl cursor-pointer" />
                  </div>
                  <ul>
                    <li
                      onClick={() => setIsCountryOpen(false)}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <img src="/images/flag-eg.webp" className="w-9" alt="egypt flag" />
                      <span>{langText.egypt[lang]}</span>
                    </li>

                  </ul>
                </div>
              </button> */}

              {isLogin && (
                <div className="relative" ref={notificationRefDesktop}>
                  <button
                    onClick={() => {
                      setNotificationOpen((s) => !s);
                      setIsCountryOpen(false);
                      setUserPopUp(null);
                    }}
                    className="bg-primary rounded-full flex items-center justify-center text-white cursor-pointer relative p-2 h-10 w-10"
                    aria-haspopup="true"
                    aria-expanded={notificationOpen}
                  >
                    <FaRegBell className="text-xl" />
                    {unreadCount > 0 && (
                      <div className="absolute bottom-[65%] start-[65%] bg-red-500 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center border-2 border-secondary">
                        {lang == "EN"
                          ? unreadCount
                          : toArabicNumbers(unreadCount)}
                      </div>
                    )}
                  </button>

                  {/* Redesigned dropdown */}
                  <div
                    className={`absolute end-0 mt-3 w-[360px] bg-white rounded-lg shadow-lg border overflow-hidden transition-transform duration-200 transform origin-top-right ${{}.toString()}
                      ${notificationOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"}`}
                    style={{ zIndex: 60 }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-secondary">
                      <div className="flex items-center gap-3">
                        <FaRegBell className="text-primary text-xl" />
                        <h3 className="text-sm font-semibold text-white">
                          {langText.notifications[lang]}
                        </h3>
                        {unreadCount > 0 && (
                          <span className="ms-2 text-xs text-white bg-primary rounded-full px-2 py-0.5">
                            {lang == "EN"
                              ? unreadCount
                              : toArabicNumbers(unreadCount)}{" "}
                            {langText.new[lang]}
                          </span>
                        )}
                      </div>
                      {/* <button
                        onClick={() => {
                          // mark all as read (best-effort)
                          if (notifications && notifications.length) {
                            notifications.forEach((n) => {
                              const id = n.notificationId || n.NotificationId || n.id || n._id;
                              try { markAsRead(id); UpdateNotification(id); } catch (e) {}
                            });
                          }
                        }}
                        className="text-xs text-primary underline"
                      >
                        Mark all read
                      </button> */}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                      {notifications && notifications.length > 0 ? (
                        notifications.map((item, index) => {
                          const id =
                            item.notificationId ||
                            item.NotificationId ||
                            item.id ||
                            item._id;
                          const subject =
                            item.notificationSubject ||
                            item.NotificationSubject ||
                            item.title ||
                            "Notification";
                          const message =
                            item.notificationMessage ||
                            item.NotificationMessage ||
                            item.body ||
                            item.message ||
                            "";
                          const isRead = item.notificationStatusId !== 1;

                          return (
                            <button
                              key={id || index}
                              onClick={() => handleNotificationClick(item)}
                              className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 flex gap-3 items-start overflow-hidden ${!isRead ? "bg-blue-50" : ""}`}
                            >
                              <div className="shrink-0 mt-0.5">
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center ${!isRead ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                                >
                                  <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M12 2a7 7 0 00-7 7v3l-2 2v1h18v-1l-2-2V9a7 7 0 00-7-7z"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="font-semibold text-sm line-clamp-1">
                                    {subject}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {getNotificationTime(item)}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {message}
                                </p>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                          {langText?.noNotifications[lang]}
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-3 border-t flex justify-between items-center bg-gray-50">
                      {/* <button
                        onClick={() => { go('/notifications'); }}
                        className="text-sm text-primary underline"
                      >
                        View all
                      </button> */}
                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="text-sm text-gray-600"
                      >
                        {langText.close[lang]}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isLogin && (
                <button
                  onClick={() => {
                    navigate("/cart");
                  }}
                  className="relative bg-primary rounded-full flex items-center justify-center text-white cursor-pointer p-2 h-10 w-10"
                >
                  <FaBagShopping className="text-xl" />
                  {cart?.length > 0 && (
                    <div className="w-7 h-7 rounded-full bottom-[65%] start-[65%] absolute bg-white border border-secondary flex items-center justify-center aspect-square">
                      {lang == "EN"
                        ? getTotalItems()
                        : toArabicNumbers(getTotalItems())}
                    </div>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  setUserPopUp(
                    userPopUp == null ? (isLogin ? "menu" : "popup") : null,
                  );
                  setIsCountryOpen(false);
                }}
                className="bg-primary rounded-full flex items-center justify-center text-white cursor-pointer relative p-2 h-10 w-10"
              >
                <FaUser className="text-xl" />

                <div
                  ref={userMenuRef}
                  className={`absolute info-table bg-white w-70 top-14 py-6 flex flex-col gap-6 border text-black after:w-3 after:h-3 after:border-t after:border-l after:bg-white after:absolute after:top-0 after:start-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:border-primary  after:rotate-45 cursor-auto transition duration-300 rounded-2xl border-primary ${userPopUp == "menu"
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                    }`}
                >
                  <ul>
                    <li
                      onClick={() => {
                        navigate("/my-account/summary");
                        closeAllPopups();
                      }}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <FaRegUser className="text-primary text-2xl" />
                      <span>{langText.accountInfo[lang]}</span>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/my-account/orders");
                        closeAllPopups();
                      }}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <LiaClipboardListSolid className="text-primary text-2xl" />
                      <span>{langText.myOrders[lang]}</span>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/my-account/archive");
                        closeAllPopups();
                      }}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <FiArchive className="text-primary text-2xl" />
                      <span>{lang === "EN" ? "Archive" : "الأرشيف"}</span>
                    </li>
                    {/* <li
                      onClick={() => {
                        navigate("/my-account/savedaddr");
                        closeAllPopups();
                      }}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <FaMapLocationDot className="text-primary font-light text-2xl" />
                      <span>{langText.savedAddresses[lang]}</span>
                    </li> */}
                    {isLogin && (
                      <li
                        onClick={() => {
                          handelLogOut();
                        }}
                        className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                      >
                        <IoIosLogOut className="text-primary text-2xl" />
                        <span>{langText.logout[lang]}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </button>

              {/* {getTotalPrice() < 80 && isLogin && (
                <p className=" animate-flash-text text-sm text-center">
                  {langText.minOrder[lang]}
                  <br />
                  {langText.EGP80[lang]}
                </p>
              )} */}
            </div>

            {/* Mobile language & country shown always on right side */}
            <div className="flex items-center gap-2 md:hidden">
              {isLogin && availableStations?.length > 0 && (
                <div className="relative flex items-center">
                  <select
                    value={selectedStation?.stationName || selectedStation || ""}
                    onChange={(e) => {
                      const matched = availableStations?.find((station) =>
                        (typeof station === 'object' ? station?.stationName : station) === e.target.value
                      );
                      setSelectedStation(matched || e.target.value);
                    }}
                    className="bg-white text-primary border border-primary rounded-full pl-3 pr-7 h-8 text-xs font-semibold outline-none cursor-pointer appearance-none shadow-sm max-w-[100px] truncate"
                  >
                    <option value="" disabled>
                      {lang === "EN" ? "Station" : "المحطة"}
                    </option>
                    {availableStations.map((station) => {
                      const id = typeof station === 'object' ? station?.stationId : station;
                      const name = typeof station === 'object' ? station?.stationName : station;
                      return (
                        <option key={id || name} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              )}

              <button
                onClick={toggleLang}
                className="bg-primary rounded-full flex items-center justify-center gap-2 text-white px-3 py-1"
              >
                <span className="font-semibold">{lang}</span>
                <AiOutlineGlobal />
              </button>

              {/* <div className="relative">
                <button
                  onClick={() => {
                    setIsCountryOpen((s) => !s);
                    setUserPopUp(null);
                  }}
                  className="bg-primary rounded-full flex items-center justify-center text-white cursor-pointer p-2 h-10 w-10"
                >
                  <img src="/images/flag-eg.webp" className="w-full" alt="egypt flag" />
                </button>

                <div
                  className={`absolute end-0 mt-2 bg-white border text-black w-56 py-4 transition-opacity duration-200  ${isCountryOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                  <div className="px-4 flex justify-between items-center">
                    <p className="font-semibold">{langText.selectCountry[lang]}</p>
                    <IoMdClose onClick={() => setIsCountryOpen(false)} className="cursor-pointer" />
                  </div>
                  <ul className="mt-2">
                    <li
                      onClick={() => setIsCountryOpen(false)}
                      className="flex gap-3 items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <img src="/images/flag-eg.webp" className="w-8" alt="egypt" />
                      <span>{langText.egypt[lang]}</span>
                    </li>
                  </ul>
                </div>
              </div> */}

              {isLogin && (
                <div className="relative" ref={notificationRefMobile}>
                  <button
                    onClick={() => {
                      setNotificationOpen((s) => !s);
                      setIsCountryOpen(false);
                      setUserPopUp(null);
                    }}
                    className="bg-primary rounded-full flex items-center justify-center text-white cursor-pointer relative p-2 h-10 w-10"
                  >
                    <FaRegBell className="text-xl" />
                    {unreadCount > 0 && (
                      <div className="absolute bottom-[65%] start-[65%] bg-red-500 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center border-2 border-secondary">
                        {lang == "EN"
                          ? unreadCount
                          : toArabicNumbers(unreadCount)}
                      </div>
                    )}
                  </button>

                  {/* Redesigned dropdown for mobile */}
                  <div
                    className={`absolute end-0 mt-3 w-[calc(100vw-4rem)] max-w-[380px] bg-white rounded-lg shadow-lg border overflow-hidden transition-transform duration-200 transform origin-top-right
                      ${notificationOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"}`}
                    style={{ zIndex: 60 }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-secondary">
                      <div className="flex items-center gap-3">
                        <FaRegBell className="text-primary text-xl" />
                        <h3 className="text-sm font-semibold text-white">
                          {langText?.notifications[lang]}
                        </h3>
                        {unreadCount > 0 && (
                          <span className="ml-2 text-xs text-white bg-primary rounded-full px-2 py-0.5">
                            {lang == "EN"
                              ? unreadCount
                              : toArabicNumbers(unreadCount)}{" "}
                            {langText.new[lang]}
                          </span>
                        )}
                      </div>
                      <IoMdClose
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotificationOpen(false);
                        }}
                        className="text-xl cursor-pointer text-white"
                      />
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                      {notifications && notifications.length > 0 ? (
                        notifications
                          ?.sort(
                            (a, b) =>
                              new Date(b.notificationSendDateTime) -
                              new Date(a.notificationSendDateTime),
                          )
                          .map((item, index) => {
                            const id =
                              item.notificationId ||
                              item.NotificationId ||
                              item.id ||
                              item._id;
                            const subject =
                              item.notificationSubject ||
                              item.NotificationSubject ||
                              item.title ||
                              "Notification";
                            const message =
                              item.notificationMessage ||
                              item.NotificationMessage ||
                              item.body ||
                              item.message ||
                              "";
                            const isRead = item.notificationStatusId !== 1;

                            return (
                              <button
                                key={id || index}
                                onClick={() => handleNotificationClick(item)}
                                className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 flex gap-3 items-start overflow-hidden ${!isRead ? "bg-blue-50" : ""}`}
                              >
                                <div className="shrink-0 mt-0.5">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center ${!isRead ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M12 2a7 7 0 00-7 7v3l-2 2v1h18v-1l-2-2V9a7 7 0 00-7-7z"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="font-semibold text-sm line-clamp-1">
                                      {subject}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {getNotificationTime(item)}
                                  </p>
                                </div>
                              </button>
                            );
                          })
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                          {langText?.noNotifications[lang]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isLogin && (
                <button
                  onClick={() => {
                    navigate("/cart");
                  }}
                  className="relative bg-primary rounded-full flex items-center justify-center text-white cursor-pointer p-2 h-10 w-10"
                >
                  <FaBagShopping className="text-xl" />
                  {cart?.length > 0 && (
                    <div className="w-6 h-6 rounded-full bottom-[65%] start-[65%] absolute bg-white border border-secondary flex items-center justify-center aspect-square">
                      {lang == "EN"
                        ? getTotalItems()
                        : toArabicNumbers(getTotalItems())}
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU PANEL (appears under header, same bg-secondary) */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,min-height,height] duration-300 ease-in-out ${mobileOpen ? "h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]" : "h-0 max-h-0"}`}
      >
        <div className="px-6 pb-6 bg-secondary h-full">
          <ul className="flex flex-col gap-4 text-primary pt-4">
            <li>
              <button
                onClick={() => go("/home")}
                className="text-start w-full text-lg"
              >
                {langText.home && langText.home[lang]
                  ? langText.home[lang]
                  : "Home"}
              </button>
            </li>

            {/* {isLogin && availableStations?.length > 0 && (
              <li className="flex flex-col gap-2 mt-2 mb-2">
                <span className="text-sm opacity-90">{lang === "EN" ? "Station" : "المحطة"}</span>
                <div className="relative flex items-center">
                  <select
                    value={selectedStation || ""}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    className="bg-white text-primary rounded-lg pl-4 pr-10 py-2.5 w-full text-sm font-semibold outline-none cursor-pointer appearance-none shadow-sm"
                  >
                    <option value="" disabled>{lang === "EN" ? "Select Station" : "اختر المحطة"}</option>
                    {availableStations.map(station => (
                      <option key={station} value={station}>{station}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </li>
            )} */}

            {isLogin ? (
              <li>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setAccountOpen((s) => !s)}
                    className="text-start w-full text-lg flex items-center gap-2"
                  >
                    {langText.myAccount && langText.myAccount[lang]
                      ? langText.myAccount[lang]
                      : "My Account"}
                  </button>
                  <button
                    onClick={() => setAccountOpen((s) => !s)}
                    className="text-xl px-2"
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-300 ${accountOpen ? "rotate-45" : "rotate-0"}`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>

                <div
                  className={`mt-2 ps-6 overflow-hidden transition-[max-height] duration-300 ${accountOpen ? "max-h-60" : "max-h-0"}`}
                >
                  <ul className="flex flex-col gap-2 text-sm text-primary">
                    <li>
                      <button
                        onClick={() => go("/my-account/orders")}
                        className="w-full text-start"
                      >
                        {langText.myOrders[lang]}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => go("/my-account/summary")}
                        className="w-full text-start"
                      >
                        {langText.accountInfo[lang]}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => go("/my-account/savedaddr")}
                        className="w-full text-start"
                      >
                        {langText.savedAddresses[lang]}
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            ) : (
              <li
                className="text-start w-full text-lg"
                onClick={() => {
                  setUserPopUp("popup");
                }}
              >
                {langText.login[lang]}
              </li>
            )}

            {isLogin && (
              <li>
                <button
                  onClick={() => handelLogOut()}
                  className="text-start w-full text-sm text-primary"
                >
                  {langText.logout[lang]}
                </button>
              </li>
            )}
            {isLogin &&
              (user.roles?.length > 1
                ? true
                : user.roles?.at(0) != "User"
                  ? true
                  : false) && (
                <li>
                  <button
                    onClick={() => {
                      if (
                        window?.location?.href
                          ?.toLowerCase()
                          ?.includes("stella")
                      ) {
                        window.location.href =
                          "https://test.skyculinaire.com/login?stella=true";
                      } else {
                        window.location.href =
                          "https://test.skyculinaire.com/login";
                      }
                    }}
                    className="bg-primary rounded-full flex items-center justify-center gap-2 text-white px-3 py-1"
                  >
                    <span className="font-semibold">
                      {langText.dashboard[lang]}
                    </span>
                  </button>
                </li>
              )}
          </ul>
        </div>
      </div>

      {/* keep your login popup if used */}
      {userPopUp == "popup" && (
        <LoginPopup onClose={closeAllPopups} lang={lang} go={go} />
      )}

      {/* Notification detail modal */}
      {showNotificationModal && selectedNotification && (
        <NotificationModal
          item={selectedNotification}
          onClose={closeNotificationModal}
          lang={lang}
          toArabicNumbers={toArabicNumbers}
        />
      )}
    </nav>
  );
}

export default Navbar;


function LoginPopup({ lang, onClose, go }) {
  const { forgetPassword } = useScreenViewStore();

  return (
    <div className="fixed top-0 p-3 start-0 bg-[rgba(0,0,0,0.5)] h-screen w-screen  justify-center items-center flex z-[100]">
      <div className={`bg-white w-full ${!forgetPassword && "p-3"} lg:max-w-[500px] rounded-xl`}>
        <div className={`flex justify-end ${forgetPassword && "hidden"}`}>
          <IoMdClose onClick={() => onClose()} className="text-xl cursor-pointer" />
        </div>
        <div className="-mt-8">
          <Login onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

function NotificationModal({ item, onClose, lang, toArabicNumbers }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const { product } = useProductStore();
  useEffect(() => {
    console.log("product", product);
  }, [product])

  const id = item.notificationId || item.NotificationId || item.id || item._id;
  const subject = item.notificationSubject || item.NotificationSubject || item.title || "Notification";
  const message = item.notificationMessage || item.NotificationMessage || item.body || item.message || "";
  const time = item.notificationDate || item.NotificationDate || item.createdAt || item.created_at || item.date;
  const pictPath = item.notificationPictPath || item.NotificationPictPath || null;
  const linkedItem = product?.find((i) => i.FoodMenuItemId === item.notificationItemId);
  const linkedItemId = item.notificationItemId || item.NotificationItemId || null;
  const orderId = item.notificationToListId || null;

  console.log("linkedItem", linkedItem);

  const handleClose = () => {
    onClose();
  };

  const handleItemClick = () => {
    onClose();
    navigate("/home", {
      state: { scrollToItemId: linkedItem?.FoodMenuItemId }
    });
  };

  const handleViewOrder = () => {
    onClose();
    navigate(`/order/${orderId}`);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-[min(500px,95%)] mx-4 z-[101] max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
              <FaRegBell size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 leading-tight">{subject}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{time ? new Date(time).toLocaleString() : ''}</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors flex-shrink-0">
            <IoMdClose size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="text-sm text-gray-600 leading-relaxed">
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>{message}</pre>
          </div>

          {/* Notification image */}
          {pictPath && (
            <div className="mt-5 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={pictPath}
                alt="notification"
                className="w-full max-h-60 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Linked menu item card */}
          {linkedItem && (
            <div
              onClick={handleItemClick}
              className="mt-5 group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-3 flex gap-4 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {linkedItem?.FoodMenuItemImg && (
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-50">
                  <img
                    src={linkedItem?.FoodMenuItemImg}
                    alt={lang == "EN" ? linkedItem.FoodMenuItemName : linkedItem.FoodMenuItemNameAr ? linkedItem.FoodMenuItemNameAr : linkedItem.FoodMenuItemName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center flex-1 relative z-10">
                <p className="font-bold text-sm text-gray-800 line-clamp-1">{lang == "EN" ? linkedItem.FoodMenuItemName : linkedItem.FoodMenuItemNameAr ? linkedItem.FoodMenuItemNameAr : linkedItem.FoodMenuItemName}</p>
                <p className="text-sm font-semibold text-primary mt-1">
                  {lang == "EN" ? linkedItem.FoodMenuItemPrice : toArabicNumbers(linkedItem.FoodMenuItemPrice)} <span className="text-xs font-medium text-gray-500">{langText?.EGP?.[lang] || "EGP"}</span>
                </p>
              </div>
              <div className="flex items-center justify-center text-primary/0 group-hover:text-primary transition-colors pr-2 text-lg">
                {lang === "AR" ? "←" : "→"}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={handleClose} className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors">
            {langText?.close[lang]}
          </button>
          {orderId && (
            <button
              onClick={handleViewOrder}
              className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              {lang === "AR" ? "عرض الطلب" : "View Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}





