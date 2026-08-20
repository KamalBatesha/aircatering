import { createBrowserRouter, Navigate, Outlet, RouterProvider, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useLangStore } from "../store/langStore";
import { useScreenViewStore } from "../store/screenViewStore";
import { onlineOrderToast } from "../Helpers/onlineOrderToast";
import useAuth from "../apis/auth/useAuth";
import { langText } from "../constants/lang";
import { useCartStore } from "../store/cartStore";
import { useQuery } from "@tanstack/react-query";
import { useNotificationStore } from "../store/notificationStore";
import useGreetingStore from "../store/greetingStore";
import useAuthMutation from "../apis/auth/AuthMutation";
import useAuthStore from "../store/authStore";
import useUIStore from "../store/UI/UIState";
import { GetNotifications } from "../apis/notifications/Notifications"; // ❌ keep normal (not a component)
import AdminLayout from "../../pages/Admin/Layout/AdminLayout";
import RequestsPage from "../../pages/Admin/Users/Requests/RequestsPage";
import ClientDetails from "../../pages/Admin/Users/Details/ClientDetails";
import UsersModule from "../../pages/Admin/Users/UsersModule";
import DeliveredOrderPopup from "../../components/DeliveredOrderPopup";
import OrderCreationReminderPopup from "../../components/OrderCreationReminderPopup";
import ProfileCompletionPopup from "../../components/ProfileCompletionPopup";
import PageTitleTracker from "../../components/PageTitleTracker";

// ✅ Lazy-loaded components
import GlobalTour from "../../components/guide/GlobalTour";
const Navbar = lazy(() => import("./Navbar"));
// const ERPNavbar = lazy(() => import("../../components/ERP/Navbar/Navbar"));
const Footer = lazy(() => import("./Footer"));
const Login = lazy(() => import("../../pages/login/Login"));
// const LoadingPage = lazy(() => import("../../pages/loading/Loading")); // renamed to avoid conflict
const OrderDetails = lazy(() => import("../../pages/orderDetails/OrderDetails"));
const OrderTracking = lazy(() => import("../../pages/orderTracking/OrderTracking"));
const AddFoodItem = lazy(() => import("../../pages/addFoodItem/AddFoodItem"));
const ResetPassword = lazy(() => import("../../pages/resetPassword/ResetPassword"));
const SkyInfo = lazy(() => import("../../pages/mobile/info/Info"));
const ErrorPage = lazy(() => import("../../pages/errorPage/ErrorPage"));
const TermsOfUse = lazy(() => import("../../pages/termsOfUse/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("../../pages/privacyPolicy/PrivacyPolicy"));
const GreetingModal = lazy(() => import("../../components/greeting/GreetingModal"));
// const Header = lazy(() => import("../../components/ERP/Header/Header"));
// const Online = lazy(() => import("../../components/ERP/online/Online"));
// const Dashboard = lazy(() => import("../../pages/ERP/Online/Dashbpard/Dashboard"));
// const Overview = lazy(() => import("../../pages/ERP/Online/Dashbpard/Overview"));
// const Quotations = lazy(() => import("../../components/ERP/Quotations/Quotations"));
// const OperationDashboard = lazy(() => import("../../pages/ERP/Online/Dashbpard/OnlineDashboard"));
// const IndividualOrders = lazy(() => import("../../pages/ERP/Online/IndividualOrders"));
// const IndividualOrdersList = lazy(() => import("../../pages/ERP/Online/IndividualOrdersList"));
// const CodingListView = lazy(() => import("../../components/ERP/Coding/CodingListView"));
// const OnlinePos = lazy(() => import("../../components/ERP/POS/OnlinePOS/OnlinePOS"));
// const Menu = lazy(() => import("../../pages/ERP/Menu/Menu"));
// const MenuDashboard = lazy(() => import("../../pages/ERP/Menu/MenuDashboard"));
// const ItemManagement = lazy(() => import("../../pages/ERP/Menu/ItemManagement/ItemManagement"));
// const UpdatePriceList = lazy(() => import("../../pages/ERP/Menu/ItemManagement/UpdatePriceList/UpdatePriceList"));
const Loading = lazy(() => import("../../pages/loading/Loading")); // second loading

// ⚠️ Named exports need special handling
// const IndListItemView = lazy(() =>
//   import("../../pages/ERP/Online/IndListItemView").then(module => ({
//     default: module.IndListItemView,
//   }))
// );

// const Coding = lazy(() =>
//   import("../../components/ERP/Coding/Coding").then(module => ({
//     default: module.Coding,
//   }))
// );

// const MenuFoodItems = lazy(() =>
//   import("../../pages/ERP/Menu/ItemManagement/FoodItems/FoodItems").then(module => ({
//     default: module.FoodItems,
//   }))
// );

// const MenuFoodItemsView = lazy(() =>
//   import("../../pages/ERP/Menu/ItemManagement/FoodItems/ListItemView").then(module => ({
//     default: module.ListItemView,
//   }))
// );

// const UpdatePriceListItemView = lazy(() =>
//   import("../../pages/ERP/Menu/ItemManagement/UpdatePriceList/ListItemView").then(module => ({
//     default: module.ListItemView,
//   }))
// );

const Home = lazy(() => import("../../pages/home/Home"));
const Entry = lazy(() => import("../../pages/entry/Entry"));
const MobileHome = lazy(() => import("../../pages/mobile/mobileHome/MobileHome"));
const Cart = lazy(() => import("../../pages/cart/Cart"));
const DeliveryMap = lazy(() => import("../../components/Map"));
const MobileCart = lazy(() => import("../../pages/mobile/mobileCart/MobileCart"));
const Register = lazy(() => import("../../pages/register/Register"));
const MyAccount = lazy(() => import("../../pages/myAccount/MyAccount"));
const Summary = lazy(() => import("../../pages/myAccount/Summary"));
const Orders = lazy(() => import("../../pages/myAccount/Orders"));
const SavedAddr = lazy(() => import("../../pages/myAccount/SavedAddr"));

// import Home from "../../pages/home/Home";
// import MobileHome from "../../pages/mobile/mobileHome/MobileHome";
// import Cart from "../../pages/cart/Cart";
// import DeliveryMap from "../../components/Map";
// import MobileCart from "../../pages/mobile/mobileCart/MobileCart";
// import Register from "../../pages/register/Register";
// import MyAccount from "../../pages/myAccount/MyAccount";
// import Summary from "../../pages/myAccount/Summary";
// import Orders from "../../pages/myAccount/Orders";
// import SavedAddr from "../../pages/myAccount/SavedAddr";

const checkTokenExpiration = (logout) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return;
  try {
    const user = JSON.parse(userStr);
    const token = user?.encodedPayload;
    if (token) {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        // Base64Url decode
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        
        // Expiration is in seconds
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          logout();
        }
      }
    }
  } catch (err) {
    console.error("Error decoding token:", err);
  }
};

function Main() {
  const { lang } = useLangStore();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    checkTokenExpiration(logout);
  }, [logout]);

  return (
    <>
      <PageTitleTracker />
      <main className={`min-h-screen flex flex-col ${lang === 'AR' && 'rtl'}`}>
        <Navbar />
        <div className="flex-1 relative h-full">
          <GlobalTour />
          <ProfileCompletionPopup />
          <Outlet />
          <GreetingModal />
        </div>
        <Footer />
      </main>
    </>
  );
}

function MobileMain() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    checkTokenExpiration(logout);
  }, [logout]);

  return (
    <>
      <PageTitleTracker />
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <GlobalTour />
          <ProfileCompletionPopup />
          <Outlet />
          <GreetingModal />
        </div>
      </main>
    </>
  );
}

// function ErpMain() {
//   return (
//     <div className="h-screen overflow-hidden flex flex-col">
//       <Header />
//       <div className="flex flex-1 min-h-0 overflow-hidden">
//         <ERPNavbar />
//         <main style={{ overflowY: "hidden" }} className="flex-1 page-container" onContextMenu={(e) => e.preventDefault()}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { lang } = useLangStore();
  const { clearCart } = useCartStore();

  if (isLoading) {
    return <Loading fullScreen={true} />;
  }

  if (!user) {
    clearCart();
    onlineOrderToast.error(langText.pleaseLoginFirst[lang]);
    return <Navigate replace to="/login" />;
  }

  return children;
};


function AuthChecker() {
  const { lang, } = useLangStore();
  const { user } = useAuth();
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  // Track notified IDs to avoid duplicates during session
  const notifiedIdsRef = useRef(new Set());

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: GetNotifications,
    enabled: !!user,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const unreadCount = useNotificationStore(state => state.getUnreadCount());

  // Update Tab Title
  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Sky Culinaire`;
    } else {
      document.title = "Sky Culinaire";
    }
  }, [unreadCount]);

  // Register SW
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW Registered'))
        .catch(err => console.error('SW Registration failed', err));
    }
  }, []);

  useEffect(() => {
    if (user && typeof Notification !== "undefined") {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(perm => {
          console.log("Notification permission requested:", perm);
        });
      }
    }
  }, [user]);

  const { showGreeting } = useGreetingStore();
  const { subscribeMutation } = useAuthMutation();
  const { setUserData, logout } = useAuthStore();
  const hasCheckedNewsletter = useRef(false);
  const navigate = useNavigate();

  // Listen for forced logout triggered by axios when refresh token expires
  useEffect(() => {
    const handleForcedLogout = () => {
      logout();
      navigate("/login");
    };
    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, [logout, navigate]);

  // Re-check token expiry whenever the user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkTokenExpiration(logout);
      }
    };
    const handleFocus = () => checkTokenExpiration(logout);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [logout]);

  // Get current user data from store/localstorage
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      hasCheckedNewsletter.current = false;
      return;
    }
    if (currentUser && !hasCheckedNewsletter.current) {
      const { customerSubscibe, customerSubscibeDate } = currentUser;

      if (!customerSubscibe) {
        let shouldShow = false;
        if (!customerSubscibeDate) {
          const lastDate = new Date(customerSubscibeDate);
          const now = new Date();
          const diffTime = Math.abs(now - lastDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays >= 30) {
            shouldShow = true;
          }
        }

        if (shouldShow && !!currentUser && !customerSubscibe) {
          hasCheckedNewsletter.current = true;
          showGreeting("newsletter", null, (status) => {
            subscribeMutation.mutate(status, {
              onSuccess: () => {
                status && onlineOrderToast.success(langText.subscribedToNewsletterSuccessfully?.[lang] || "Subscribed successfully!");
                // Update local storage/store
                setUserData({ ...currentUser, customerSubscibe: true });
                localStorage.setItem("user", JSON.stringify({ ...currentUser, customerSubscibe: true }));
              },
              onError: () => {
                status && onlineOrderToast.error(langText.somethingWentWrongTryAgain[lang]);
              },
              onMutate: () => {
                status && onlineOrderToast.loading(langText.loading[lang]);
              },
            });
          });
        }
      }
      hasCheckedNewsletter.current = true;
    }
  }, [currentUser, showGreeting, subscribeMutation, setUserData, lang]);


  useEffect(() => {
    if (notificationsData) {
      const list = Array.isArray(notificationsData) ? notificationsData : (notificationsData.json || []);
      console.log("Checking for new notifications. Count:", list.length);

      list.forEach((n) => {
        const id = n.notificationId || n.NotificationId || n.id || n._id;
        const isUnread = n.notificationStatusId === 1;

        if (isUnread && !notifiedIdsRef.current.has(id)) {
          notifiedIdsRef.current.add(id);

          // Play sound (this is fine)
          try {
            const audio = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
            audio.volume = 1;
            audio.play().catch(e => console.log("Audio play prevented:", e));
          } catch (e) {
            console.error("Sound error:", e);
          }

          const canUseNotificationAPI = typeof Notification !== "undefined";

          if (canUseNotificationAPI && Notification.permission === "granted") {
            const title = "Sky Culinaire";
            const options = {
              body: n.notificationMessage || n.NotificationMessage || "New Notification",
              icon: "/images/login-logo.png",
              vibrate: [200, 100, 200],
              tag: id
            };

            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, options);
              }).catch(e => {
                console.error("SW showNotification failed, trying fallback", e);
                // fallback: try new Notification in try/catch
                try { new Notification(title, options); } catch (ex) { console.error("Notification fallback failed", ex); }
              });
            } else {
              try { new Notification(title, options); } catch (e) { console.error("new Notification failed", e); }
            }
          } else {
            // Fallback for devices/browsers without Notification API
            console.log("Browser notification skipped. Permission or API unavailable:", canUseNotificationAPI ? Notification.permission : "Notification API unavailable");
            // بديل عملي: أظهر toast داخل التطبيق بدلاً من إشعار المتصفح
            onlineOrderToast.info(n.notificationMessage || "لديك إشعار جديد");
          }
        }
      });

      setNotifications(list);
    }
  }, [notificationsData, setNotifications]);


  return (
    <>
      <DeliveredOrderPopup />
      <OrderCreationReminderPopup />
      <Outlet />
    </>
  );
}

function Layout() {
  const { lang } = useLangStore();
  const { setScreen, screen } = useScreenViewStore();

  // Use useAuthStore instead of useAuth() because Layout is outside RouterProvider, 
  // so any hook relying on useNavigate (like useAuth) will crash here.
  const user = useAuthStore((state) => state.user);

  const isNormalUser = (() => {
    return true;
    if (!user) return true;
    if (user?.userName == "bateshakamal00@gmail.com") return false;
    const roles = user?.roles;
    if (!roles || !Array.isArray(roles) || roles.length === 0) return true;
    return roles.length === 1 && roles[0] === "User";
  })();

  useEffect(() => {
    if (lang === 'AR') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [lang]);

  const isDarkMode = useUIStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isNormalUser) {
      document.body.classList.add('customer-layout');
      document.body.classList.remove('erp-layout');
    } else {
      document.body.classList.add('erp-layout');
      document.body.classList.remove('customer-layout');
    }
  }, [isNormalUser]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => {
      setScreen(window.innerWidth < 768 ? "mobile" : "desktop");
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const customerDesktopRoutes = [
    {
      path: "/",
      element: <Main />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <AuthChecker />,
          children: [
            {
              index: true,
              element: <Entry />,
            },
            {
              path: "/home",
              element: <Home />,
            },
            {
              path: "/register",
              element: <Register />,
            },
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/cart",
              element: <ProtectedRoute><Cart /></ProtectedRoute>
            },
            {
              path: "/termsOfUse",
              element: <TermsOfUse />
            },
            {
              path: "/privacyPolicy",
              element: <PrivacyPolicy />
            },
            {
              path: "/map",
              element: <ProtectedRoute><DeliveryMap /></ProtectedRoute>
            },
            {
              path: "/order/:id",
              element: <ProtectedRoute><OrderDetails /></ProtectedRoute>
            },
            {
              path: "/order/:id/tracking",
              element: <ProtectedRoute><OrderTracking /></ProtectedRoute>
            },
            {
              path: "/my-account",
              element: <ProtectedRoute><MyAccount /></ProtectedRoute>,
              children: [
                {
                  index: true,
                  element: <Summary />,
                },
                {
                  path: "summary",
                  element: <Summary />,
                },
                {
                  path: "orders",
                  element: <Orders />,
                },
                {
                  path: "archive",
                  element: <Orders status="archived" />,
                },
                // {
                //   path: "savedaddr",
                //   element: <SavedAddr />,
                // },
              ],
            },
            {
              path: "addFood",
              element: <ProtectedRoute><AddFoodItem /></ProtectedRoute>
            },
          ],
        },
      ],
    },
    {
      path: "/reset-password",
      element: <ResetPassword />
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "",
          element: <Navigate replace to="users" />
        },
        {
          path: "users",
          element: <UsersModule />,
          children: [
            {
              path: "",
              element: <Navigate replace to="requests" />
            },
            {
              path: ":tabType",
              element: <RequestsPage />
            },
            {
              path: ":tabType/:customerId",
              element: <ClientDetails />
            }
          ]
        },
        // {
        //   path: "dashboard",
        //   element: <div className="p-6 bg-white rounded-3xl border border-[#E5E5E5] shadow-sm">Dashboard Module (Coming Soon)</div>
        // },
        // {
        //   path: "erp",
        //   element: <div className="p-6 bg-white rounded-3xl border border-[#E5E5E5] shadow-sm">ERP Modules (Coming Soon)</div>
        // },
        // {
        //   path: "settings",
        //   element: <div className="p-6 bg-white rounded-3xl border border-[#E5E5E5] shadow-sm">Settings Module (Coming Soon)</div>
        // }
      ]
    }
  ];

  const customerMobileRoutes = [
    {
      path: "/",
      element: <MobileMain />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <AuthChecker />,
          children: [
            {
              index: true,
              element: <Entry />,
            },
            {
              path: "/home",
              element: <MobileHome />,
            },
            {
              path: "/register",
              element: <Register />,
            },
            {
              path: "/cart",
              element: <ProtectedRoute><MobileCart /></ProtectedRoute>,
            },
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/info",
              element: <SkyInfo />,
            },
            {
              path: "/termsOfUse",
              element: <TermsOfUse />
            },
            {
              path: "/privacyPolicy",
              element: <PrivacyPolicy />
            },
            {
              path: "/my-account",
              element: <ProtectedRoute><MyAccount /></ProtectedRoute>,
              children: [
                {
                  index: true,
                  element: <Summary />,
                },
                {
                  path: "summary",
                  element: <Summary />,
                },
                {
                  path: "orders",
                  element: <Orders />,
                },
                {
                  path: "savedaddr",
                  element: <SavedAddr />,
                },
              ],
            },
            {
              path: "addFood",
              element: <ProtectedRoute><AddFoodItem /></ProtectedRoute>
            }
          ],
        },
        {
          path: "/map",
          element: <ProtectedRoute><DeliveryMap /></ProtectedRoute>
        },
        {
          path: "/order/:id",
          element: <ProtectedRoute><OrderDetails /></ProtectedRoute>
        },
        //         {
        //   path:"/cv",
        //   element:<ApplyingForm/>
        // }
      ]
    },
    {
      path: "/resetPassword",
      element: <ResetPassword />
    },

  ];

  // const erpRoutes = [
  //   {
  //     path: "/",
  //     element: <ErpMain />,
  //     errorElement: <ErrorPage />,
  //     children: [
  //       {
  //         element: <AuthChecker />,
  //         children: [
  //           {
  //             index: true,
  //             element: (
  //               <ProtectedRoute>
  //                 <div className="flex items-center justify-center h-full text-2xl font-bold w-full">
  //                   ERP System
  //                 </div>
  //               </ProtectedRoute>
  //             ),
  //           },
  //           {
  //             path: "/login",
  //             element: <Login />,
  //           },
  //           // Additional ERP routes will go here
  //           , {
  //             // Online
  //             path: "Online",
  //             exact: true,
  //             element: <Online />,
  //             children: [
  //               {
  //                 // Online/Dashboard
  //                 path: "Dashboard",
  //                 element: <Dashboard />,
  //                 exact: true,
  //                 children: [
  //                   {
  //                     // Online/Dashboard/Overview
  //                     path: "Overview",
  //                     exact: true,
  //                     element: <Overview />,
  //                   },
  //                 ],
  //               },
  //               {
  //                 // Online/
  //                 path: "",
  //                 element: <OperationDashboard />,
  //               },
  //               {
  //                 // Online/Quotations
  //                 path: "Quotations",
  //                 exact: true,
  //                 element: <Quotations operation />,
  //                 children: [
  //                   {
  //                     // Online/Quotations/IndividualOrders
  //                     path: "IndividualOrders",
  //                     exact: true,
  //                     element: <IndividualOrders operation orderListStatus="" />,
  //                   },
  //                   {
  //                     // Online/Quotations/IndividualOrders/:id
  //                     path: "IndividualOrders/:id",
  //                     exact: true,
  //                     element: <IndListItemView operation orderListStatus="" />,
  //                   },

  //                 ],
  //               },
  //               {
  //                 // Online/OrdersManagement
  //                 path: "OrdersManagement",
  //                 exact: true,
  //                 element: <Quotations operation />,
  //                 children: [
  //                   {
  //                     // Online/OrdersManagement/IndividualOrders
  //                     path: "IndividualOrders",
  //                     exact: true,
  //                     element: <IndividualOrders kitchen orderListStatus="K" />,
  //                   },
  //                   {
  //                     // Online/OrdersManagement/IndividualOrders/:id
  //                     path: "IndividualOrders/:id",
  //                     exact: true,
  //                     element: (
  //                       <IndListItemView kitchen orderListStatus="K" Online />
  //                     ),
  //                   },
  //                 ],
  //               },
  //               {
  //                 // Online/Kitchen
  //                 path: "Kitchen",
  //                 exact: true,
  //                 element: <Quotations operation />,
  //                 children: [
  //                   // {
  //                   //   // Online/Kitchen/RunningOrders
  //                   //   path: "RunningOrders",
  //                   //   exact: true,
  //                   //   element: <IndividualList depId={1} KD />,
  //                   // },
  //                   // {
  //                   //   // Online/Kitchen/RunningOrders/:id
  //                   //   path: "RunningOrders/:id",
  //                   //   exact: true,
  //                   //   element: <QuotationListItemView depId={1} KD />,
  //                   // },
  //                   {
  //                     // Online/Kitchen/IndividualOrders
  //                     path: "IndividualOrders",
  //                     exact: true,
  //                     element: <IndividualOrdersList depId={1} KD />,
  //                   },
  //                   {
  //                     // Online/Kitchen/IndividualOrders/:id
  //                     path: "IndividualOrders/:id",
  //                     exact: true,
  //                     element: <IndListItemView online depId={1} KD />,
  //                   },

  //                 ],
  //               },
  //               {
  //                 // Online/Pickups
  //                 path: "Pickups",
  //                 exact: true,
  //                 element: <Quotations operation />,
  //                 children: [
  //                   {
  //                     // Online/Pickups/IndividualOrders
  //                     path: "IndividualOrders",
  //                     exact: true,
  //                     element: <IndividualOrders PD orderListStatus="DELIVERY" />,
  //                   },
  //                   {
  //                     // Online/Pickups/IndividualOrders/:id
  //                     path: "IndividualOrders/:id",
  //                     exact: true,
  //                     element: <IndListItemView PD orderListStatus="DELIVERY" />,
  //                   },
  //                 ],
  //               },
  //               {
  //                 // Online/Coding
  //                 path: "Coding",
  //                 exact: true,
  //                 element: <Coding />,
  //                 children: [
  //                   // Online - Coding
  //                   {
  //                     // Online/Coding/FoodItem
  //                     path: "FoodItem",
  //                     exact: true,
  //                     element: <CodingListView type="online Food Item" tabs />,
  //                   },
  //                   {
  //                     // Online/Coding/Client
  //                     path: "Client",
  //                     exact: true,
  //                     element: <CodingListView type="ClientOnline" />,
  //                   },
  //                   {
  //                     // Online/Coding/GrandGroup
  //                     path: "GrandGroup",
  //                     exact: true,
  //                     element: <CodingListView type="Grand Group" />,
  //                   },
  //                   {
  //                     // Online/Coding/Group
  //                     path: "Group",
  //                     exact: true,
  //                     element: <CodingListView type="Group" />,
  //                   },
  //                   {
  //                     // Online/Coding/SubGroup
  //                     path: "SubGroup",
  //                     exact: true,
  //                     element: <CodingListView type="Sub Group" />,
  //                   },
  //                   {
  //                     // Online/Coding/Unit
  //                     path: "Unit",
  //                     exact: true,
  //                     element: <CodingListView type="Unit" />,
  //                   },
  //                   {
  //                     // Online/Coding/Adds
  //                     path: "Adds",
  //                     exact: true,
  //                     element: <CodingListView type="Add-On" />,
  //                   },
  //                   {
  //                     // Online/Coding/AddsGroup
  //                     path: "AddsGroup",
  //                     exact: true,
  //                     element: <CodingListView type="AddsGroup" />,
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           {
  //             // Menu
  //             path: "Menu",
  //             exact: true,
  //             element: <Menu />,
  //             children: [
  //               {
  //                 // Menu/Dashboard
  //                 path: "Dashboard",
  //                 exact: true,
  //                 element: <MenuDashboard />,
  //               },
  //               {
  //                 // Menu/ItemManagement
  //                 path: "ItemManagement",
  //                 exact: true,
  //                 element: <ItemManagement />,
  //                 children: [
  //                   {
  //                     path: "FlightMenu",
  //                     exact: true,
  //                     element: <div></div>,
  //                   },
  //                   {
  //                     // Menu/ItemManagement/OnlineOrderMenu
  //                     path: "OnlineOrderMenu",
  //                     exact: true,
  //                     element: <MenuFoodItems menuType={3} />,
  //                   },
  //                   {
  //                     // Menu/ItemManagement/OnlineOrderMenu/:id
  //                     path: "OnlineOrderMenu/:id",
  //                     exact: true,
  //                     element: <MenuFoodItemsView />,
  //                   },
  //                   {
  //                     // Menu/ItemManagement/UpdatePriceList
  //                     path: "UpdatePriceList",
  //                     exact: true,
  //                     element: <UpdatePriceList />,
  //                   },
  //                   {
  //                     // Menu/ItemManagement/UpdatePriceList/:id
  //                     path: "UpdatePriceList/:id",
  //                     exact: true,
  //                     element: <UpdatePriceListItemView />,
  //                   },
  //                 ],
  //               },
  //               // {
  //               //   // /Menu/Reports/ClientSalesReport
  //               //   path: "Reports/ClientSalesReport",
  //               //   element: <SalesByItemList iSMenu />,
  //               // },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     // Online/Quotations/IndividualOrders/:id/POS
  //     path: "Online/Quotations/IndividualOrders/:id/POS", //done
  //     exact: true,
  //     element: <OnlinePos individual />,
  //   },

  // ];

  // const routes = (isNormalUser)
  //   ? (screen === 'desktop' ? customerDesktopRoutes : customerMobileRoutes)
  //   : erpRoutes;
  const routes = screen === 'desktop' ? customerDesktopRoutes : customerDesktopRoutes
  const handleRouterError = (error) => {
    console.error("Router encountered an error:", error);
    if (
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed")
    ) {
      window.location.reload();
    }
    // Optional: Implement additional error handling logic here
    // For example, redirect to a global error page:
    // window.location.href = "/error";
  };


  const router = createBrowserRouter(routes, {
    onError: handleRouterError,
  });

  return (
    <Suspense
      fallback={<Loading fullScreen={true} />}
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default Layout;