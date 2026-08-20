import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLangStore } from "../assets/store/langStore";

/**
 * Maps pathname & language to an informative, professional page title with Air Catering branding
 */
export function getPageTitle(pathname, lang = "EN") {
  const isAr = lang === "AR";
  const brand = isAr ? "تموين الطيران" : "Air Catering";
  const suffix = ` | ${brand}`;

  const cleanPath = (pathname || "").toLowerCase().replace(/\/+$/, "") || "/";

  // 1. Root / Entry
  if (cleanPath === "/" || cleanPath === "") {
    return isAr ? `الرئيسية | ${brand}` : `VIP Flight Catering | ${brand}`;
  }

  // 2. Main Public & Customer Pages
  if (cleanPath === "/home") {
    return isAr ? `قائمة الطعام والطلبات${suffix}` : `Menu & Active Orders${suffix}`;
  }
  if (cleanPath === "/cart") {
    return isAr ? `سلة طلبات الطيران${suffix}` : `Flight Catering Cart${suffix}`;
  }
  if (cleanPath === "/login") {
    return isAr ? `تسجيل الدخول${suffix}` : `Login${suffix}`;
  }
  if (cleanPath === "/register") {
    return isAr ? `إنشاء حساب جديد${suffix}` : `Create Account${suffix}`;
  }
  if (cleanPath === "/reset-password" || cleanPath === "/resetpassword") {
    return isAr ? `إعادة تعيين كلمة المرور${suffix}` : `Reset Password${suffix}`;
  }
  if (cleanPath === "/map") {
    return isAr ? `خريطة التوصيل والمحطات${suffix}` : `Delivery & Stations Map${suffix}`;
  }
  if (cleanPath === "/info") {
    return isAr ? `معلومات المحطة والرحلة${suffix}` : `Station & Flight Information${suffix}`;
  }
  if (cleanPath === "/termsofuse") {
    return isAr ? `شروط الاستخدام${suffix}` : `Terms of Use${suffix}`;
  }
  if (cleanPath === "/privacypolicy") {
    return isAr ? `سياسة الخصوصية${suffix}` : `Privacy Policy${suffix}`;
  }
  if (cleanPath === "/addfood") {
    return isAr ? `إضافة صنف مخصص${suffix}` : `Add Custom Item${suffix}`;
  }

  // 3. User Account Section
  if (cleanPath === "/my-account" || cleanPath === "/my-account/summary") {
    return isAr ? `ملخص الحساب الشخصي${suffix}` : `Account Summary${suffix}`;
  }
  if (cleanPath === "/my-account/orders") {
    return isAr ? `طلباتي الجارية${suffix}` : `My Orders${suffix}`;
  }
  if (cleanPath === "/my-account/archive") {
    return isAr ? `أرشيف الطلبات المكتملة${suffix}` : `Archived Orders${suffix}`;
  }
  if (cleanPath === "/my-account/savedaddr") {
    return isAr ? `العناوين المحفوظة${suffix}` : `Saved Addresses${suffix}`;
  }

  // 4. Dynamic Order Pages (/order/:id/tracking & /order/:id)
  const trackingMatch = pathname.match(/^\/order\/([^/]+)\/tracking/i);
  if (trackingMatch) {
    const id = trackingMatch[1];
    return isAr ? `تتبع الطلب #${id}${suffix}` : `Tracking Order #${id}${suffix}`;
  }

  const orderMatch = pathname.match(/^\/order\/([^/]+)/i);
  if (orderMatch) {
    const id = orderMatch[1];
    return isAr ? `تفاصيل الطلب #${id}${suffix}` : `Order #${id} Details${suffix}`;
  }

  // 5. Admin Portal
  if (cleanPath.startsWith("/admin")) {
    const adminPortal = isAr ? ` | بوابة الإدارة - ${brand}` : ` | Admin Portal - ${brand}`;

    if (cleanPath.includes("/requests")) {
      const clientDetailMatch = pathname.match(/\/requests\/([^/]+)/i);
      if (clientDetailMatch) {
        return isAr ? `تفاصيل طلب العميل #${clientDetailMatch[1]}${adminPortal}` : `Client Request #${clientDetailMatch[1]}${adminPortal}`;
      }
      return isAr ? `طلبات تسجيل العملاء${adminPortal}` : `Client Registration Requests${adminPortal}`;
    }
    if (cleanPath.includes("/clients")) {
      const clientDetailMatch = pathname.match(/\/clients\/([^/]+)/i);
      if (clientDetailMatch) {
        return isAr ? `بيانات العميل #${clientDetailMatch[1]}${adminPortal}` : `Client Details #${clientDetailMatch[1]}${adminPortal}`;
      }
      return isAr ? `إدارة العملاء والشركات${adminPortal}` : `Client Management${adminPortal}`;
    }
    if (cleanPath.includes("/admins")) {
      return isAr ? `إدارة المشرفين والمسؤولين${adminPortal}` : `Administrators Management${adminPortal}`;
    }
    if (cleanPath.includes("/users")) {
      return isAr ? `إدارة المستخدمين${adminPortal}` : `Users Management${adminPortal}`;
    }
    return isAr ? `لوحة التحكم الإدارية${adminPortal}` : `Admin Dashboard${adminPortal}`;
  }

  // 6. Fallback Default
  return isAr ? `تموين الطيران - Air Catering` : `Air Catering | VIP Flight Catering`;
}

export default function PageTitleTracker() {
  const location = useLocation();
  const { lang } = useLangStore();

  useEffect(() => {
    const title = getPageTitle(location.pathname, lang);
    document.title = title;
  }, [location.pathname, lang]);

  return null;
}
