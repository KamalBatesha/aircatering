import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

export default function FinalConfirmationSuccessModal({ isOpen, onClose, lang }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary/10 border-b border-primary/20 p-5 flex items-center justify-between shrink-0">
            <h3 className="text-xl font-bold text-primary">
              {lang === "AR" ? "تم تأكيد الطلب بنجاح" : "Confirmation Received"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors bg-white rounded-full p-1.5 shadow-sm border border-gray-200 cursor-pointer shrink-0"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-5 text-gray-700 text-sm md:text-base leading-relaxed text-center overflow-y-auto cutom-scroll" style={{ direction: lang === "AR" ? "rtl" : "ltr" }}>
            <p className="font-semibold text-lg text-secondary">
              Thank you for providing your final confirmation. We have officially received your approval to proceed.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left" style={{ textAlign: lang === "AR" ? "right" : "left" }}>
              <p className="font-bold text-primary mb-2">What happens next?</p>
              <p className="mb-3">
                The catering operations and production for your order have now officially commenced to ensure everything is prepared to our highest standards for your flight.
              </p>
              <p className="text-sm text-gray-600 border-l-4 border-primary/40 pl-3 py-1 bg-white" style={lang === "AR" ? { borderLeft: "none", borderRightWidth: "4px", paddingLeft: 0, paddingRight: "0.75rem" } : {}}>
                Please note that because operations are underway, any subsequent adjustments to your schedule, items, or quantities from this point forward will be treated as a modification request and will be reviewed by the Sky Culinaire team based on operational feasibility.
              </p>
            </div>
            <p className="font-medium text-secondary pt-2">
              We look forward to delivering an exceptional dining experience.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-5 border-t border-gray-100 flex justify-center shrink-0">
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              {lang === "AR" ? "إغلاق" : "Close"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
