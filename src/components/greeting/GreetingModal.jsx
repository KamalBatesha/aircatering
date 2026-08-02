import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { HiHeart, HiEmojiHappy, HiMail } from "react-icons/hi";
import { useLangStore } from "../../assets/store/langStore";
import { langText } from "../../assets/constants/lang";
import useGreetingStore from "../../assets/store/greetingStore";
import { useNavigate } from "react-router-dom";

export default function GreetingModal() {
  const { lang } = useLangStore();
  const { isOpen, type, name, onConfirm, closeGreeting } = useGreetingStore();
  const isRTL = lang === "AR";
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isWelcome = type === "welcome";
  const isNewsletter = type === "newsletter";

  // Prepare message
  let message = "";
  if (isWelcome) {
    if (name) {
      message = langText.welcomeBackUser[lang].replace("{name}", name);
    } else {
      message = langText.welcomeBack[lang];
    }
  } else if (isNewsletter) {
    message = langText.newsletterSubscribeMessage[lang];
  } else {
    message = langText.thankYouForJoining[lang];
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={closeGreeting}
      />

      {/* Modal Container */}
      <div
        className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ease-out scale-100"
        style={{ animation: "greeting-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-linear-to-r from-primary via-primary/80 to-primary" />

        {/* Close Button */}
        <button
          onClick={() => {
            if (isNewsletter) {
              onConfirm(false);
            }
            closeGreeting();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 group"
          aria-label="Close"
        >
          <IoMdClose className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="px-8 pt-12 pb-10 flex flex-col items-center text-center gap-6">
          {/* Animated Icon */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 scale-150 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              {isWelcome ? (
                <HiEmojiHappy className="text-5xl text-white animate-bounce-slow" />
              ) : isNewsletter ? (
                <HiMail className="text-5xl text-white animate-bounce-slow" />
              ) : (
                <HiHeart className="text-5xl text-white animate-heart-beat" />
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isWelcome ? (lang === "AR" ? "أهلاً بك!" : "Welcome!") : isNewsletter ? (langText.newsletterSubscribeTitle[lang]) : (lang === "AR" ? "شكراً لك!" : "Thank You!")}
            </h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed px-2">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => {
                if (isNewsletter && onConfirm) {
                  onConfirm(true);
                } else if (!isNewsletter) {
                  navigate("/home");
                }
                closeGreeting();
              }}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xl transition-all duration-300 
                hover:bg-primary/90 hover:shadow-[0_8px_25px_-5px_rgba(232,35,42,0.4)] 
                active:scale-[0.97] shadow-xl"
            >
              {isNewsletter ? langText.confirm[lang] : (lang === "AR" ? "استكشاف الطعام" : "Explore Food")}
            </button>

            {isNewsletter && (
              <button
                onClick={() => { onConfirm(false); closeGreeting(); }}
                className="w-full py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold text-xl transition-all duration-300 
                  hover:bg-gray-200 active:scale-[0.97]"
              >
                {langText.cancel[lang]}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes greeting-slide-up {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-heart-beat {
          animation: heart-beat 1.5s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
