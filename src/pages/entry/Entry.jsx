import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLangStore } from "../../assets/store/langStore";
import { langText } from "../../assets/constants/lang";
import { HomeHero } from "../home/Home";
import { FaPlus, FaMinus, FaUtensils, FaShippingFast, FaStar, FaClock, FaRegBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { MdAirplanemodeActive, MdDeliveryDining } from "react-icons/md";
import { useScreenViewStore } from "../../assets/store/screenViewStore";

function Entry() {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const { navBarHeight, footerHeight } = useScreenViewStore();

  useEffect(() => {
    // Scroll to top when page is loaded
    window.scrollTo(0, 0);
  }, []);
  const features = [
    { icon: <MdAirplanemodeActive className="text-2xl" />, label: lang === "AR" ? "توصيل جوي" : "Air Delivery" },
    { icon: <FaUtensils className="text-2xl" />, label: lang === "AR" ? "أطباق فاخرة" : "Culinary Meals" },
    { icon: <FaStar className="text-2xl" />, label: lang === "AR" ? "جودة عالية" : "Premium Quality" },
    { icon: <FaShippingFast className="text-2xl" />, label: lang === "AR" ? "توصيل سريع" : "Fast Delivery" },
  ];

  return (
    <div style={{ minHeight: `calc(100vh - ${navBarHeight}px - ${footerHeight}px)` }}
      className={`bg-primary relative w-full overflow-hidden flex flex-col`}>

      <div className="home-hero-section flex-1">
        {/* Background Image */}
        <div
          className="home-hero-bg"
          style={{ backgroundImage: `url('/images/hero_bg_home.png')` }}
        />
        {/* Gradient Overlay */}
        <div className="home-hero-overlay" />

        {/* Floating particles */}
        <div className="home-hero-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="home-hero-particle" style={{ '--i': i }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ marginBottom: `${navBarHeight}px` }} className="home-hero-content">
          {/* Logo */}
          {/* <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="home-hero-logo-wrap"
          >
            <img src="/images/logo-dark.png" alt="Sky Culinaire" className="home-hero-logo" />
          </motion.div> */}

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="home-hero-title"
          >
            {lang === "AR" ? "سكاي كيولينير" : "Sky Culinaire"}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="home-hero-subtitle"
          >
            {lang === "AR"
              ? "تجربة طعام فاخرة على ارتفاعات شاهقة — أطباق شهية توصل مباشرة إليك"
              : "A premium culinary experience at altitude — exquisite dishes delivered straight to you"}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/home")}
            className="home-hero-cta"
          >
            <FaPlus className="text-sm" />
            <span>{langText.exploreOurMenu?.[lang] || "Explore Our Menu"}</span>
          </motion.button>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="home-hero-features"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="home-hero-feature-pill"
              >
                {f.icon}
                <span>{f.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom wave */}
        {/* <div className="home-hero-wave">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#C5A76D" />
          </svg>
        </div> */}
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col bg-secondary overflow-hidden">
      {/* Background Image with Overlay */}
      {window?.location?.href?.toLowerCase()?.includes("stella") ?
        <img
          src="images/landing_hero_bg.png"
          alt="Hero background"
          className="absolute inset-0 object-[85%_0] w-full h-full object-cover  z-0"
        />
        :
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
      }
      <div className="absolute inset-0 bg-black/65 z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="animate-scaleIn max-w-4xl mx-auto flex flex-col items-center">
          {/* Optional: We can add a larger logo here if requested */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg tracking-wide">
            {langText.SkyCulinaire?.[lang] || "Sky Culinaire"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl px-4 drop-shadow-md leading-relaxed">
            {lang === "AR"
              ? "اكتشف عالمًا من الأطباق الشهية والتوصيل السريع مباشرة إليك."
              : "Discover a world of delicious culinary meals and fast delivery straight to you."}
          </p>

          <button
            onClick={() => navigate("/home")}
            className="bg-primary hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 text-white font-semibold py-4 px-10 rounded-full text-xl shadow-[0_4px_14px_0_rgba(184,142,82,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] flex items-center gap-4 cursor-pointer"
          >
            {langText.exploreOurFood?.[lang] || "Explore Our Food"}
            <svg className={`w-6 h-6 ${lang === 'AR' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Entry;
