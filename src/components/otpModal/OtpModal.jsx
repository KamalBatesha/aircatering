import { useRef, useState, useEffect } from "react";
import { langText } from "../../assets/constants/lang";
import { useLangStore } from "../../assets/store/langStore";
import useGreetingStore from "../../assets/store/greetingStore";
import { useCartStore } from "../../assets/store/cartStore";
import { HiPhone } from "react-icons/hi";
import { useNavigate } from "react-router-dom";


export default function OtpModal({ email, phone, formData, verifyOtpMutation, onResend, onClose, isAfterRegister = false }) {
  const OTP_LENGTH = email ? 8 : 6;
  const RESEND_COUNTDOWN = 60;
  const { lang } = useLangStore();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const [showOtpInput, setShowOtpInput] = useState(!email);
  const { showGreeting } = useGreetingStore.getState();
  const { clearCart } = useCartStore();

  const navigate = useNavigate();


  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function handleChange(e, idx) {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    setErrorMsg("");
    if (val && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(e, idx) {
    if (e.key === "Backspace") {
      if (!otp[idx] && idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[idx] = "";
      setOtp(newOtp);
    }
    if (e.key === "ArrowLeft" && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleVerify() {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setErrorMsg(lang === "AR" ? "يرجى إدخال الرمز كاملاً" : "Please enter all 8 digits.");
      return;
    }
    setErrorMsg("");
    verifyOtpMutation.mutate(
      { otp: code, formData, isAfterRegister: isAfterRegister && phone, email, phone: phone ? phone() : "" },
      {
        onSuccess: () => {
          setSuccess(true);
          onClose();
        },
        onError: (err) => {
          const serverMsg = err?.response?.data;
          if (typeof serverMsg === "string" && serverMsg.toLowerCase().includes("invalid")) {
            setErrorMsg(langText.invalidOtp?.[lang] || "Invalid OTP. Please try again.");
          } else if (typeof serverMsg === "string" && serverMsg.toLowerCase().includes("expired")) {
            setErrorMsg(langText.otpExpiredOrInvalid?.[lang] || "OTP has expired.");
          } else {
            setErrorMsg(langText.invalidOtp?.[lang] || "Invalid OTP. Please try again.");
          }
          // Shake the inputs
          setOtp(Array(OTP_LENGTH).fill(""));
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
        },
      }
    );
  }

  function handleResend() {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setErrorMsg("");
    setCanResend(false);
    setCountdown(RESEND_COUNTDOWN);
    onResend?.(phone ? true : false);
  }

  const isPending = verifyOtpMutation.isPending;
  const isRTL = lang === "AR";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {/* Blur overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={success ? onClose : undefined}
      />

      {/* Modal card */}
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-[92vw] max-w-[520px] overflow-hidden"
        style={{ animation: "otp-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="px-8 py-7 flex flex-col items-center gap-5">
          {/* ---- Success State ---- */}
          {false ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative flex items-center justify-center w-20 h-20">
                <svg className="animate-otp-check" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                  <circle cx="26" cy="26" r="25" stroke="var(--color-primary, #e8232a)" strokeWidth="2" fill="none" />
                  <path d="M14 26l8 8 16-16" stroke="var(--color-primary, #e8232a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-gray-800 text-center">
                {langText.accountVerifiedSuccessfully?.[lang] || "Account verified!"}
              </p>
              <p className="text-sm text-gray-500 text-center">
                {lang === "AR" ? "جاري تسجيل الدخول..." : "Logging you in..."}
              </p>
            </div>
          ) : (
            <>
              {/* Icon + Title */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  {phone ?
                    <HiPhone className="w-7 h-7 text-primary" />
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center">
                  {phone ? (langText.verifyYourPhoneNumber?.[lang] || "Verify Your Phone Number") : (langText.verifyYourEmail?.[lang] || "Verify Your Email")}
                </h2>
                {showOtpInput && <p className="text-sm text-gray-500 text-center leading-relaxed">
                  {langText.enterTheOtpSentTo?.[lang] || "Enter the OTP sent to"}
                  <br />
                  <span className="font-medium text-gray-700 break-all">{phone ? phone() : email}</span>
                </p>}
              </div>

              {/* OTP Boxes */}
              {showOtpInput ? <div
                className="flex md:gap-2.5 gap-1.5"
                onPaste={handlePaste}
                style={{ direction: "ltr" }}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    disabled={isPending}
                    className={`
                      md:w-11 md:h-13 w-8 h-10 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
                      focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,35,42,0.12)]
                      ${digit ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-gray-50 text-gray-800"}
                      ${errorMsg ? "border-red-400 bg-red-50 animate-otp-shake" : ""}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    // style={{ width: "2.75rem", height: "3.25rem" }}
                    aria-label={`OTP digit ${idx + 1}`}
                  />
                ))}
              </div> :
                <div className="flex flex-col items-center gap-4 py-4 w-full">
                  <button
                    onClick={() => { setShowOtpInput(true); onResend?.(false); }}
                    className="w-full py-2.5 rounded-full bg-primary text-white font-semibold text-base transition-all duration-200
                  hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-none
                  flex items-center justify-center gap-2"
                  >
                    {langText.verifyMailNow?.[lang] || "Verify Mail Now"}
                  </button>
                  <button
                    onClick={() => {
                      // showGreeting("thankYou");
                      if (isAfterRegister) {
                        clearCart();
                        onClose();
                        navigate("/");
                        return;
                      }
                      onClose();
                    }}
                    className="text-primary font-medium hover:underline focus:underline transition"
                  >
                    {langText.skipThisStep?.[lang] || "Skip This Step"}
                  </button>
                </div>
              }

              {/* Error message */}
              {errorMsg && (
                <p className="text-red-500 text-sm font-medium text-center -mt-2 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errorMsg}
                </p>
              )}

              {/* Verify button */}
              {showOtpInput && <button
                onClick={handleVerify}
                disabled={isPending || otp.join("").length < OTP_LENGTH}
                className="w-full py-2.5 rounded-full bg-primary text-white font-semibold text-base transition-all duration-200
                  hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-none
                  flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {lang === "AR" ? "جاري التحقق..." : "Verifying..."}
                  </>
                ) : (
                  langText.verifyOtp?.[lang] || "Verify"
                )}
              </button>
              }

              {/* Resend */}
              {showOtpInput && <div className="flex items-center gap-1.5 text-sm">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-primary font-medium hover:underline focus:underline transition"
                  >
                    {langText.resendOtp?.[lang] || "Resend OTP"}
                  </button>
                ) : (
                  <p className="text-gray-400">
                    {langText.resendIn?.[lang] || "Resend in"}{" "}
                    <span className="font-semibold text-gray-600 tabular-nums">{countdown}</span>{" "}
                    {langText.seconds?.[lang] || "seconds"}
                  </p>
                )}
              </div>
              }
            </>
          )}
        </div>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes otp-slide-up {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes otp-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
        @keyframes otp-check-draw {
          from { stroke-dashoffset: 100; }
          to   { stroke-dashoffset: 0; }
        }
        .animate-otp-check path {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: otp-check-draw 0.6s ease-out 0.1s forwards;
        }
        .animate-otp-shake {
          animation: otp-shake 0.45s ease;
        }
      `}</style>
    </div>
  );
}
