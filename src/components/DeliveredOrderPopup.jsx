import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaTimes } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import useAuthStore from "../assets/store/authStore";
import useReviewMutation from "../assets/apis/review/ReviewMutation";
import { getMyOrders } from "../assets/apis/order/OrderApi";
import { useLangStore } from "../assets/store/langStore";

export default function DeliveredOrderPopup() {
  const { lang } = useLangStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { ReviewedMutation } = useReviewMutation();

  const [pendingOrders, setPendingOrders] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  const { data: myDeliveredOrders } = useQuery({
    queryKey: ["myOrders", "delivered"],
    queryFn: () => getMyOrders("delivered"),
    retry: 5,
    enabled: !!user,
    refetchInterval: 1000 * 60 * 1,
  });

  useEffect(() => {
    if (myDeliveredOrders?.length > 0) {
      const unseen = myDeliveredOrders.filter(
        (o) =>
          o?.header?.orderHeaderreviewSeen === false &&
          !dismissed.includes(o?.header?.orderHeaderId)
      );
      setPendingOrders(unseen);
    }
  }, [myDeliveredOrders]);

  const currentOrder = pendingOrders[0];
  const h = currentOrder?.header;

  function markReviewed(id) {
    ReviewedMutation.mutate(id);
    setDismissed((prev) => [...prev, id]);
    setPendingOrders((prev) => prev.filter((o) => o?.header?.orderHeaderId !== id));
  }

  function handleViewOrder() {
    const id = h?.orderHeaderId;
    if (id) {
      markReviewed(id);
      navigate(`/order/${id}`);
    }
  }

  function handleClose() {
    const id = h?.orderHeaderId;
    if (id) markReviewed(id);
  }

  return (
    <AnimatePresence>
      {!!h && (
        <motion.div
          key={h.orderHeaderId}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-6 right-6 z-[99999] w-[340px] max-w-[95vw]"
        >
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-white"
            style={{ border: "1.5px solid var(--color-light-gray)" }}
          >
            {/* Primary top bar */}
            <div className="h-1.5 w-full bg-primary" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray hover:text-secondary transition-colors z-10 cursor-pointer"
            >
              <FaTimes size={13} />
            </button>

            <div className="p-5">
              {/* Header row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <MdCheckCircle size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {lang === "AR" ? "تم التسليم" : "Order Delivered"}
                  </p>
                  <h3 className="text-secondary font-bold text-sm leading-tight mt-0.5">
                    {lang === "AR"
                      ? "شكراً لاختيارك Sky Culinaire! 🎉"
                      : "Thank you for choosing Sky Culinaire! 🎉"}
                  </h3>
                </div>
              </div>

              {/* Order info card */}
              <div
                className="rounded-xl p-3 mb-4 space-y-2"
                style={{
                  background: "rgba(197,167,109,0.06)",
                  border: "1px solid var(--color-light-gray)",
                }}
              >
                <div className="flex items-center gap-2">
                  <FaPlane size={11} className="text-primary" />
                  <span className="text-gray text-xs">
                    {lang === "AR" ? "رقم الطلب" : "Order Number"}
                  </span>
                  <span className="text-secondary font-semibold text-xs ml-auto">
                    {h.orderHeaderOrderNumber || h.orderHeaderRefrance || "—"}
                  </span>
                </div>

                {h.orderHeaderFlightNumberName && (
                  <div className="flex items-center gap-2">
                    <FaPlane size={11} className="text-primary" />
                    <span className="text-gray text-xs">
                      {lang === "AR" ? "رقم الرحلة" : "Flight"}
                    </span>
                    <span className="text-secondary font-semibold text-xs ml-auto">
                      {h.orderHeaderFlightNumberName}
                    </span>
                  </div>
                )}

                {h.orderHeaderStationName && (
                  <div className="flex items-center gap-2">
                    <FaPlane size={11} className="text-primary" />
                    <span className="text-gray text-xs">
                      {lang === "AR" ? "المحطة" : "Station"}
                    </span>
                    <span className="text-secondary font-semibold text-xs ml-auto">
                      {h.orderHeaderStationName}
                    </span>
                  </div>
                )}

                {h.orderHeaderStatusName && (
                  <div className="flex items-center gap-2">
                    <MdCheckCircle size={11} className="text-primary" />
                    <span className="text-gray text-xs">
                      {lang === "AR" ? "الحالة" : "Status"}
                    </span>
                    <span className="text-secondary font-semibold text-xs ml-auto">
                      {h.orderHeaderStatusName}
                    </span>
                  </div>
                )}
              </div>

              {/* Thank-you message */}
              <p className="text-gray text-xs text-center mb-5 leading-relaxed">
                {lang === "AR"
                  ? "نأمل أن تكون تجربتك معنا رائعة. يسعدنا دائماً خدمتك!"
                  : "We hope you had a wonderful experience. We're always happy to serve you!"}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80 cursor-pointer text-gray"
                  style={{
                    border: "1.5px solid var(--color-light-gray)",
                    background: "#FBFBFA",
                  }}
                >
                  {lang === "AR" ? "إغلاق" : "Close"}
                </button>
                <button
                  onClick={handleViewOrder}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 cursor-pointer text-white bg-primary"
                >
                  {lang === "AR" ? "عرض الطلب" : "View Order"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
