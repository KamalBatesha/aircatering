import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useLangStore } from '../../assets/store/langStore';
import { langText } from '../../assets/constants/lang';
import { useScreenViewStore } from '../../assets/store/screenViewStore';
import { FaChevronRight, FaUser, FaClipboardList, FaMapMarkerAlt, FaArchive } from 'react-icons/fa';

function MyAccount() {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const { navBarHeight, footerHeight } = useScreenViewStore();
  const isRTL = lang === "AR";
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 800);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { to: "/my-account/summary", label: langText.accountInfo[lang], icon: <FaUser size={14} /> },
    { to: "/my-account/orders", label: langText.myOrders[lang], icon: <FaClipboardList size={14} /> },
    { to: "/my-account/archive", label: lang === "EN" ? "Archive" : "الأرشيف", icon: <FaArchive size={14} /> },
    // { to: "/my-account/savedaddr", label: langText.savedAddresses[lang], icon: <FaMapMarkerAlt size={14} /> },
  ];

  return (
    <div
      className="container mx-auto py-8 px-3 md:px-6"
      style={{
        minHeight: !isLargeScreen ? "auto" : `calc(100vh - ${navBarHeight}px - ${footerHeight}px)`,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <button
          onClick={() => navigate("/home")}
          className="hover:text-primary transition-colors font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          {langText.home[lang]}
        </button>
        <FaChevronRight size={10} className="text-gray-400" style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
        <span className="text-gray-700 font-medium">{langText.myAccount[lang]}</span>
      </div>

      {/* Main card */}
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "#fff",
          boxShadow: "0 4px 32px rgba(197,167,109,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-light-gray)",
          minHeight: isLargeScreen ? "calc(100vh - 220px)" : "auto",
        }}
      >
        {/* Header bar */}
        <div
          className="flex items-center gap-4 px-8 py-5"
          style={{ background: "linear-gradient(135deg, var(--color-secondary) 0%, #2d2d2e 100%)", borderBottom: "3px solid var(--color-primary)" }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "rgba(197,167,109,0.18)", border: "2px solid var(--color-primary)" }}
          >
            <FaUser size={18} style={{ color: "var(--color-primary)" }} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">{langText.myAccount[lang]}</h2>
        </div>

        <div className="flex flex-col md:flex-row flex-1">
          {/* Sidebar nav */}
          <nav
            className="flex md:flex-col gap-1 md:gap-1 border-b md:border-b-0 md:border-e px-4 md:px-0 py-3 md:py-5 md:w-56 shrink-0"
            style={{ borderColor: "var(--color-light-gray)" }}
          >
            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mx-1 md:mx-3 ${isActive
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: "linear-gradient(135deg, var(--color-primary), #a8894f)", color: "#fff" }
                    : {}
                }
              >
                <span style={{ color: "inherit" }}>{icon}</span>
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden text-xs">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 p-5 md:p-8 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
