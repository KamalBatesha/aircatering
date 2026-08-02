import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaTimes, FaBell } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import useAuthStore from "../assets/store/authStore";
import { getMyOrders, CreateReminder } from "../assets/apis/order/OrderApi";
import { useLangStore } from "../assets/store/langStore";

/** Returns true when the reminder date is 3 or more months in the past */
function isOlderThanThreeMonths(dateValue) {
  if (!dateValue) return false;
  const reminderDate = new Date(dateValue);
  if (isNaN(reminderDate.getTime())) return false;
  const now = new Date();
  const threshold = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  return reminderDate <= threshold;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Single info row — mirrors the DeliveredOrderPopup row style */
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary shrink-0" style={{ fontSize: 11 }}>{icon}</span>
      <span className="text-gray text-xs">{label}</span>
      <span className="text-secondary font-semibold text-xs ml-auto text-right">{value}</span>
    </div>
  );
}

export default function OrderCreationReminderPopup() {
  const { lang } = useLangStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dismissed, setDismissed] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const { data: myOrders } = useQuery({
    queryKey: ["myOrders", "allOrders"],
    queryFn: () => getMyOrders(),
    enabled: !!user,
    retry: 5,
    refetchInterval: 1000 * 60 * 5,
  });

  const createReminderMutation = useMutation({
    mutationFn: (orderHeaderId) => CreateReminder(orderHeaderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });

  const notifiedIdsRef = useRef(new Set());

  useEffect(() => {
    if (!myOrders || myOrders.length === 0) return;

    const overdue = myOrders.filter((o) => {
      const id = o?.header?.orderHeaderId;
      if (!id || dismissed.includes(id)) return false;
      return isOlderThanThreeMonths(o?.header?.orderHeaderCreationReminder);
    });
    setPendingOrders(overdue);
  }, [myOrders, dismissed]);

  const currentOrder = pendingOrders[0];
  const h = currentOrder?.header;

  useEffect(() => {
    if (h?.orderHeaderId && !notifiedIdsRef.current.has(h.orderHeaderId)) {
      notifiedIdsRef.current.add(h.orderHeaderId);
      const playAudio = () => {
        try {
          const audio = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
          audio.volume = 1;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => console.log("Audio play prevented:", e));
          }
        } catch (e) {
          console.error("Sound error:", e);
        }
      };
      playAudio();
    }
  }, [h?.orderHeaderId]);

  function dismissOrder(id) {
    setDismissed((prev) => [...prev, id]);
    setPendingOrders((prev) => prev.filter((o) => o?.header?.orderHeaderId !== id));
  }

  function handleClose() {
    const id = h?.orderHeaderId;
    if (!id) return;
    createReminderMutation.mutate(id);
    dismissOrder(id);
  }

  function handleViewOrder() {
    const id = h?.orderHeaderId;
    if (!id) return;
    createReminderMutation.mutate(id);
    dismissOrder(id);
    navigate(`/order/${id}`);
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
          className="fixed bottom-6 right-6 z-[99998] w-[340px] max-w-[95vw]"
        >
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-white"
            style={{ border: "1.5px solid var(--color-light-gray)" }}
          >
            {/* Amber accent bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: "linear-gradient(90deg, var(--color-primary), #f59e0b)" }}
            />

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
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), #f59e0b)" }}
                >
                  <FaBell size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {lang === "AR" ? "تذكير بالطلب" : "Order Reminder"}
                  </p>
                  <h3 className="text-secondary font-bold text-sm leading-tight mt-0.5">
                    {lang === "AR"
                      ? "لديك طلب لم يُراجع منذ 3 أشهر"
                      : "You have an order pending review for 3+ months"}
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
                <InfoRow
                  icon={<FaPlane />}
                  label={lang === "AR" ? "رقم الطلب" : "Order Number"}
                  value={h.orderHeaderOrderNumber || h.orderHeaderRefrance}
                />

                <InfoRow
                  icon={<FaPlane />}
                  label={lang === "AR" ? "رقم الرحلة" : "Flight"}
                  value={h.orderHeaderFlightNumberName}
                />

                <InfoRow
                  icon={<FaPlane />}
                  label={lang === "AR" ? "المحطة" : "Station"}
                  value={h.orderHeaderStationName}
                />

                <InfoRow
                  icon={<FiCalendar />}
                  label={lang === "AR" ? "وقت الوصول" : "Arrival Time"}
                  value={h.orderHeaderFlightArrivalDatTime ? formatDate(h.orderHeaderFlightArrivalDatTime) : null}
                />

                <InfoRow
                  icon={<MdDeliveryDining />}
                  label={lang === "AR" ? "وقت توصيل الوصول" : "Arrival Delivery Time"}
                  value={h.orderHeaderArrivalDeliveryDate ? formatDate(h.orderHeaderArrivalDeliveryDate) : null}
                />

                <InfoRow
                  icon={<MdDeliveryDining />}
                  label={lang === "AR" ? "وقت توصيل المغادرة" : "Departure Delivery Time"}
                  value={h.orderHeaderDeliveryDateTime ? formatDate(h.orderHeaderDeliveryDateTime) : null}
                />

                <InfoRow
                  icon={<FiCalendar />}
                  label={lang === "AR" ? "وقت المغادرة" : "Departure Time"}
                  value={h.orderHeaderDepatrialDateTime ? formatDate(h.orderHeaderDepatrialDateTime) : null}
                />

                {h.orderHeaderCreationReminder && (
                  <InfoRow
                    icon={<FaBell />}
                    label={lang === "AR" ? "آخر تذكير" : "Last Reminder"}
                    value={new Date(h.orderHeaderCreationReminder).toLocaleDateString()}
                  />
                )}
              </div>

              {/* Subtitle message */}
              <p className="text-gray text-xs text-center mb-5 leading-relaxed">
                {lang === "AR"
                  ? "يُرجى مراجعة هذا الطلب أو إجراء التحديثات اللازمة عليه."
                  : "Please review this order or take any necessary actions."}
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
