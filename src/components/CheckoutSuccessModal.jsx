import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

export default function CheckoutSuccessModal({ isOpen, onClose, lang }) {
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary/10 border-b border-primary/20 p-5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">
              {lang === "AR" ? "تم استلام الطلب" : "Order Received"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors bg-white rounded-full p-1.5 shadow-sm border border-gray-200 cursor-pointer"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-5 text-gray-700 text-sm md:text-base leading-relaxed text-center" style={{ direction: lang === "AR" ? "rtl" : "ltr" }}>
            <p className="font-semibold text-lg text-secondary">
              Thank you for choosing Sky Culinaire.
            </p>
            <p>
              We would like to acknowledge receipt of your catering request for your upcoming flight.
            </p>
            <p>
              Our team is currently reviewing the order details and verifying the availability of all requested items.
            </p>
            <p>
              A confirmation message will be sent to you shortly with the final operational status of your order, including a full confirmation of availability or any necessary item substitutions for your review.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-5 border-t border-gray-100 flex justify-center">
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
