import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLangStore } from "../assets/store/langStore";
import { langText } from "../assets/constants/lang";
import { GetMySettings } from "../assets/apis/auth/AuthApi";
import useAuthMutation from "../assets/apis/auth/AuthMutation";
import { GetPayTypes } from "../assets/apis/PurchasingAPI";
import {
  getMyFlightNumbers,
  getMyRegistrations,
  getMyAirCrafts,
  getMyAgent,
  getMyOperators,
  getMyBillTo
} from "../assets/apis/order/OrderApi";
import { getMyGroundHandlerList } from "../assets/apis/FinanceApi";
import CustomLookup from "./HelperComponents/CustomLookup";
import FreeTextLookup from "./HelperComponents/FreeTextLookup";
import { FiMail, FiAlertCircle } from "react-icons/fi";
import { FaMoneyCheckAlt, FaUniversity } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { TextField, IconButton } from "@mui/material";
import { onlineOrderToast } from "../assets/Helpers/onlineOrderToast";
import useAuthStore from "../assets/store/authStore";

export default function ProfileCompletionPopup() {
  const { lang, isRTL } = useLangStore();
  const { user } = useAuthStore();
  const isAuth = !!user;
  const queryClient = useQueryClient();
  const { editMySettingsMutation } = useAuthMutation();

  // Use sessionStorage so dismissal persists across page navigation,
  // but resets automatically when a different user logs in.
  const sessionKey = user ? `profilePopupDismissed_${user.customerId || user.userName || JSON.stringify(user)}` : null;

  const [isDismissed, setIsDismissed] = useState(() => {
    if (!sessionKey) return false;
    return sessionStorage.getItem(sessionKey) === "true";
  });

  // Sync state when sessionKey changes (e.g. after login) so we don't need a refresh
  useEffect(() => {
    if (sessionKey) {
      setIsDismissed(sessionStorage.getItem(sessionKey) === "true");
    } else {
      setIsDismissed(false);
    }
  }, [sessionKey]);

  const dismiss = () => {
    if (sessionKey) sessionStorage.setItem(sessionKey, "true");
    setIsDismissed(true);
  };

  // 1. Fetch Profile Settings
  const { data: mySettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["mySettings"],
    queryFn: GetMySettings,
    enabled: isAuth,
  });

  // 2. Fetch Lookups
  const { data: payTypes } = useQuery({ queryKey: ["payTypes"], queryFn: GetPayTypes, enabled: isAuth });
  const { data: groundHandlerList } = useQuery({ queryKey: ["groundHandlerList"], queryFn: getMyGroundHandlerList, enabled: isAuth });
  const { data: flightNumbers } = useQuery({ queryKey: ["flightNumbers"], queryFn: getMyFlightNumbers, enabled: isAuth });
  const { data: registrations } = useQuery({ queryKey: ["registrations"], queryFn: getMyRegistrations, enabled: isAuth });
  const { data: airCrafts } = useQuery({ queryKey: ["airCrafts"], queryFn: getMyAirCrafts, enabled: isAuth });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: getMyAgent, enabled: isAuth });
  const { data: operators } = useQuery({ queryKey: ["operators"], queryFn: getMyOperators, enabled: isAuth });
  const { data: billTo } = useQuery({ queryKey: ["billTo"], queryFn: getMyBillTo, enabled: isAuth });

  // 3. Determine Missing Fields
  const missing = useMemo(() => {
    if (!mySettings) return null;

    const obj = {
      paymentMethodId: !mySettings.paymentMethodId,
      cateringEmail: !mySettings.cateringEmail,
      invoicingEmail: !mySettings.invoicingEmail,
      flightId: !mySettings.flightId,
      registrationId: !mySettings.registrationId,
      airCraftId: !mySettings.airCraftId,
      billToId: !mySettings.billToId,
      agentId: mySettings.agentIsVisible && !mySettings.agentId,
      operatorId: mySettings.operatorIsVisible && !mySettings.operatorId,
      groundHandlerId: mySettings.groundHandlerIsVisible && !mySettings.groundHandlerId,
      groundHandlerEmail: mySettings.groundHandlerIsVisible && !mySettings.groundHandlerEmail,
      groundHandlerPhone: mySettings.groundHandlerIsVisible && !mySettings.groundHandlerPhone,
    };

    // Check if at least one field is missing
    const hasMissing = Object.values(obj).some(Boolean);

    if (!hasMissing) return null;
    return obj;
  }, [mySettings]);

  const shouldShow = isAuth && !settingsLoading && missing !== null && !isDismissed;

  // 4. Validation Schema
  const validationSchema = useMemo(() => {
    let schema = {};
    // Only enforce bank fields if bank payment method is currently selected inside the popup
    schema.paymentInfoAccountHolder = Yup.string().when("paymentMethodId", {
      is: (val) => val === 3 || val === 2,
      then: () => Yup.string().required(lang === "AR" ? "مطلوب" : "Required"),
      otherwise: () => Yup.string(),
    });
    schema.paymentInfoIBan = Yup.string().when("paymentMethodId", {
      is: (val) => val === 3 || val === 2,
      then: () => Yup.string().required(lang === "AR" ? "مطلوب" : "Required"),
      otherwise: () => Yup.string(),
    });
    schema.paymentInfoSwiftCode = Yup.string().when("paymentMethodId", {
      is: (val) => val === 3 || val === 2,
      then: () => Yup.string().required(lang === "AR" ? "مطلوب" : "Required"),
      otherwise: () => Yup.string(),
    });
    return Yup.object(schema);
  }, [lang]);

  // 5. Formik Setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      paymentMethodId: mySettings?.paymentMethodId || 0,
      paymentMethodName: mySettings?.paymentMethodName || "",
      cateringEmail: mySettings?.cateringEmail || "",
      invoicingEmail: mySettings?.invoicingEmail || "",
      flightId: mySettings?.flightId || 0,
      flightName: mySettings?.flightName || "",
      registrationId: mySettings?.registrationId || 0,
      registrationName: mySettings?.registrationName || "",
      airCraftId: mySettings?.airCraftId || 0,
      aircraftTypeName: mySettings?.airCraftTypeName || "",
      billToId: mySettings?.billToId || 0,
      billToName: mySettings?.billToName || "",
      agentId: mySettings?.agentId || 0,
      agentName: mySettings?.agentName || "",
      operatorId: mySettings?.operatorId || 0,
      operatorName: mySettings?.operatorName || "",
      groundHandlerId: mySettings?.groundHandlerId || 0,
      groundHandlerName: mySettings?.groundHandlerName || "",
      groundHandlerEmail: mySettings?.groundHandlerEmail || "",
      groundHandlerPhone: mySettings?.groundHandlerPhone || "",
      paymentInfoAccountHolder: mySettings?.paymentInfoAccountHolder || "",
      paymentInfoAccountBankName: mySettings?.paymentInfoAccountBankName || "",
      paymentInfoAccountNumber: mySettings?.paymentInfoAccountNumber || "",
      paymentInfoIBan: mySettings?.paymentInfoIBan || "",
      paymentInfoSwiftCode: mySettings?.paymentInfoSwiftCode || "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      // Build payload matching Summary.jsx
      const payload = {
        customerName: mySettings?.customerName || "",
        customerPersonalName: mySettings?.customerPersonalName || "",
        customerMobile: mySettings?.customerMobile || "",
        customerCountryCode: mySettings?.customerCountryCode || "",
        customerRemark: mySettings?.customerRemark || "",
        customerAddress: mySettings?.customerAddress || "",
        customerInstancePers: mySettings?.customerInstancePers || 0,
        customerSubscribe: mySettings?.customerSubscribe || false,
        customerSubscribeDate: mySettings?.customerSubscribeDate || new Date().toISOString(),

        flightId: values.flightId || 0,
        flightNumberName: values.flightName || null,
        registrationId: values.registrationId || 0,
        registrationName: values.registrationName || null,
        airCraftId: values.airCraftId || 0,
        acTypeName: values.aircraftTypeName || null,
        paymentMethodId: values.paymentMethodId || 0,
        agentId: values.agentId || 0,
        agentName: values.agentName || null,
        agentIsVisible: mySettings?.agentIsVisible ?? false,
        agentIsRequired: mySettings?.agentIsRequired ?? false,
        operatorId: values.operatorId || 0,
        operatorName: values.operatorName || null,
        operatorIsVisible: mySettings?.operatorIsVisible ?? false,
        operatorIsRequired: mySettings?.operatorIsRequired ?? false,
        billToId: values.billToId || 0,
        billToName: values.billToName || null,
        invoicingEmail: values.invoicingEmail,
        cateringEmail: values.cateringEmail,
        paymentInfoAccountHolder: values.paymentInfoAccountHolder,
        paymentInfoAccountBankName: values.paymentInfoAccountBankName,
        paymentInfoAccountNumber: values.paymentInfoAccountNumber,
        paymentInfoIBan: values.paymentInfoIBan,
        paymentInfoSwiftCode: values.paymentInfoSwiftCode,
        groundHandlerIsVisible: mySettings?.groundHandlerIsVisible ?? false,
        groundHandlerId: values.groundHandlerId || 0,
        groundHandlerName: values.groundHandlerName || null,
        groundHandlerIEmail: values.groundHandlerEmail || null,
        groundHandlerPhone: values.groundHandlerPhone || null,
      };

      editMySettingsMutation.mutate(payload, {
        onMutate: () => {
          onlineOrderToast.loading(langText.updatingProfile?.[lang] || "Updating profile...", { id: "profile-completion" });
        },
        onSuccess: (res) => {
          setSubmitting(false);
          onlineOrderToast.success(langText.savedSuccessfully?.[lang] || "Saved successfully!", { id: "profile-completion" });
          queryClient.invalidateQueries(["mySettings"]);
          dismiss();
        },
        onError: (err) => {
          console.error(err);
          setSubmitting(false);
          const errorMsg =
            err?.response?.data?.message ||
            err?.response?.data?.responseMessage ||
            err?.response?.data?.title ||
            (typeof err?.response?.data === "string" ? err?.response?.data : null) ||
            err?.message ||
            (lang === "AR" ? "فشل حفظ البيانات، يرجى المحاولة مرة أخرى" : "Failed to update profile. Please try again.");
          onlineOrderToast.error(errorMsg, { id: "profile-completion" });
        },
      });
    },
  });

  useEffect(() => {
    if (shouldShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col relative"
        style={{ direction: isRTL ? "rtl" : "ltr", maxHeight: "90vh" }}
      >
        <IconButton
          onClick={() => dismiss()}
          sx={{ position: "absolute", top: 12, right: isRTL ? undefined : 12, left: isRTL ? 12 : undefined, color: "gray" }}
        >
          <IoMdClose size={24} />
        </IconButton>

        <div className="bg-orange-50 border-b border-orange-100 px-5 py-3 flex items-center gap-3 shrink-0">
          <FiAlertCircle size={22} className="text-orange-400 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-gray-800 leading-tight">
              {lang === "AR" ? "إكمال الملف الشخصي" : "Profile Completion Suggestion"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {lang === "AR"
                ? "بعض المعلومات الافتراضية مفقودة. أكملها الآن لتسريع عملياتك المستقبلية."
                : "Some default values are missing. Fill them in to speed up future orders."}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 overflow-y-auto flex-1">
          <form id="profile-completion-form" onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {missing.cateringEmail && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === "AR" ? "بريد التموين الإلكتروني" : "Catering Email"}
                  </label>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="new-password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "var(--color-bg-box)",
                        height: "38px",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        color: "var(--color-primary) !important",
                        padding: "0 12px",
                      },
                    }}
                    {...formik.getFieldProps("cateringEmail")}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[\u0600-\u06FF]/g, "");
                      formik.handleChange(e);
                    }}
                  />
                </div>
              )}

              {missing.invoicingEmail && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === "AR" ? "بريد الفواتير الإلكتروني" : "Invoicing Email"}
                  </label>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="new-password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "var(--color-bg-box)",
                        height: "38px",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        color: "var(--color-primary) !important",
                        padding: "0 12px",
                      },
                    }}
                    {...formik.getFieldProps("invoicingEmail")}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[\u0600-\u06FF]/g, "");
                      formik.handleChange(e);
                    }}
                  />
                </div>
              )}

              {missing.flightId && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{langText.flightNumber[lang]}</label>
                  <FreeTextLookup
                    options={flightNumbers || []}
                    valueId={formik.values.flightId}
                    valueName={formik.values.flightName}
                    onChange={(id, name) => { formik.setFieldValue("flightId", id); formik.setFieldValue("flightName", name); }}
                    getOptionLabel={(opt) => {
                      const name = opt?.flightNumberName;
                      return typeof name === "object" ? (name?.flightNumberName ?? "") : (name ?? "");
                    }}
                    getOptionValue={(opt) => opt?.flightNumberId}
                    uppercase={true}
                  />
                </div>
              )}

              {missing.registrationId && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{langText.registration[lang]}</label>
                  <FreeTextLookup
                    options={registrations || []}
                    valueId={formik.values.registrationId}
                    valueName={formik.values.registrationName}
                    onChange={(id, name) => { formik.setFieldValue("registrationId", id); formik.setFieldValue("registrationName", name); }}
                    getOptionLabel={(opt) => opt.registrationName}
                    getOptionValue={(opt) => opt.registrationId}
                    uppercase={true}
                  />
                </div>
              )}

              {missing.airCraftId && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{langText.aircraftType[lang]}</label>
                  <FreeTextLookup
                    options={airCrafts || []}
                    valueId={formik.values.airCraftId}
                    valueName={formik.values.aircraftTypeName}
                    onChange={(id, name) => { formik.setFieldValue("airCraftId", id); formik.setFieldValue("aircraftTypeName", name); }}
                    getOptionLabel={(opt) => opt.airCraftName}
                    getOptionValue={(opt) => opt.airCraftId}
                    uppercase={true}
                  />
                </div>
              )}

              {missing.billToId && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{langText.billTo[lang]}</label>
                  <FreeTextLookup
                    options={billTo || []}
                    valueId={formik.values.billToId}
                    valueName={formik.values.billToName}
                    onChange={(id, name) => { formik.setFieldValue("billToId", id); formik.setFieldValue("billToName", name); }}
                    getOptionLabel={(opt) => opt.billToName}
                    getOptionValue={(opt) => opt.billToId}
                  />
                </div>
              )}

              {missing.operatorId && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{langText.operator[lang]}</label>
                  <FreeTextLookup
                    options={operators || []}
                    valueId={formik.values.operatorId}
                    valueName={formik.values.operatorName}
                    onChange={(id, name) => { formik.setFieldValue("operatorId", id); formik.setFieldValue("operatorName", name); }}
                    getOptionLabel={(opt) => opt.operatorName}
                    getOptionValue={(opt) => opt.operatorId}
                  />
                </div>
              )}

              {missing.agentId && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{langText.agent[lang]}</label>
                  <FreeTextLookup
                    options={agents || []}
                    valueId={formik.values.agentId}
                    valueName={formik.values.agentName}
                    onChange={(id, name) => { formik.setFieldValue("agentId", id); formik.setFieldValue("agentName", name); }}
                    getOptionLabel={(opt) => opt.agentName}
                    getOptionValue={(opt) => opt.agentId}
                  />
                </div>
              )}

              {missing.groundHandlerId && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === "EN" ? "Ground Handler Name" : "اسم مزود الخدمة الأرضية"}
                  </label>
                  <FreeTextLookup
                    options={groundHandlerList || []}
                    valueId={formik.values.groundHandlerId}
                    valueName={formik.values.groundHandlerName}
                    onChange={(id, name) => {
                      formik.setFieldValue("groundHandlerId", id);
                      formik.setFieldValue("groundHandlerName", name);
                      const matched = groundHandlerList?.find(g => g.groundHandlerId === id);
                      if (matched) {
                        formik.setFieldValue("groundHandlerEmail", matched.groundHandlerEmail || "");
                        formik.setFieldValue("groundHandlerPhone", matched.groundHandlerPhone || "");
                      }
                    }}
                    getOptionLabel={(opt) => opt.groundHandlerName}
                    getOptionValue={(opt) => opt.groundHandlerId}
                    uppercase={true}
                  />
                </div>
              )}

              {missing.groundHandlerEmail && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === "EN" ? "Ground Handler Email" : "البريد الإلكتروني لمزود الخدمة"}
                  </label>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="new-password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "var(--color-bg-box)",
                        height: "38px",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        color: "var(--color-primary) !important",
                        padding: "0 12px",
                      },
                    }}
                    {...formik.getFieldProps("groundHandlerEmail")}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[\u0600-\u06FF]/g, "").toUpperCase();
                      formik.handleChange(e);
                    }}
                  />
                </div>
              )}

              {missing.groundHandlerPhone && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === "EN" ? "Ground Handler Phone" : "هاتف مزود الخدمة الأرضية"}
                  </label>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="new-password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "var(--color-bg-box)",
                        height: "38px",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        color: "var(--color-primary) !important",
                        padding: "0 12px",
                      },
                    }}
                    {...formik.getFieldProps("groundHandlerPhone")}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^\d+]/g, "");
                      formik.handleChange(e);
                    }}
                  />
                </div>
              )}

              {missing.paymentMethodId && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langText.paymentMethod?.[lang] || "Payment Method"}
                  </label>
                  <CustomLookup
                    options={payTypes || []}
                    value={formik.values.paymentMethodId}
                    readOnly={true}
                    onChange={(val) => {
                      formik.setFieldValue("paymentMethodId", val);
                      const selectedOpt = payTypes?.find(p => p.cashTransactionTypeId === val);
                      if (selectedOpt) formik.setFieldValue("paymentMethodName", selectedOpt.cashTransactionTypeName);
                    }}
                    getOptionLabel={(opt) => opt.cashTransactionTypeName}
                    getOptionValue={(opt) => opt.cashTransactionTypeId}
                  />
                </div>
              )}
            </div>

            {missing.paymentMethodId && (formik.values.paymentMethodId === 3 || formik.values.paymentMethodId === 2) && (
              <div className="rounded-xl p-3 flex flex-col gap-3 mt-1" style={{ border: "1px solid var(--color-light-gray)", background: "rgba(197,167,109,0.02)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <FaUniversity size={14} style={{ color: "var(--color-primary)" }} />
                  <h4 className="text-sm font-bold text-gray-800">
                    {lang === "AR" ? "المعلومات البنكية" : "Bank Information"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { field: "paymentInfoAccountHolder", label: lang === "AR" ? "اسم صاحب الحساب" : "Account Holder Name" },
                    { field: "paymentInfoAccountBankName", label: lang === "AR" ? "اسم البنك" : "Bank Name" },
                    { field: "paymentInfoAccountNumber", label: lang === "AR" ? "رقم الحساب" : "Account Number", isNumber: true },
                    { field: "paymentInfoIBan", label: "IBAN" },
                    { field: "paymentInfoSwiftCode", label: "Swift Code" },
                  ].map(({ field, label, isNumber }) => (
                    <TextField
                      key={field}
                      label={label}
                      size="small"
                      fullWidth
                      {...formik.getFieldProps(field)}
                      onChange={(e) => {
                        if (isNumber) {
                          e.target.value = e.target.value.replace(/\D/g, "");
                        } else {
                          e.target.value = e.target.value.replace(/[\u0600-\u06FF]/g, "").toUpperCase();
                        }
                        formik.handleChange(e);
                      }}
                      error={formik.touched[field] && Boolean(formik.errors[field])}
                      helperText={formik.touched[field] && formik.errors[field]}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "white", height: "40px", fontSize: "14px" },
                        "& .MuiInputLabel-root": { fontSize: "13px", transform: "translate(14px, 11px) scale(1)", "&.Mui-focused, &.MuiInputLabel-shrink": { transform: "translate(14px, -9px) scale(0.75)" } },
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 gap-3">
          <button
            type="button"
            onClick={() => dismiss()}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
          >
            {lang === "AR" ? "إغلاق" : "Close"}
          </button>
          <button
            type="submit"
            form="profile-completion-form"
            disabled={formik.isSubmitting || editMySettingsMutation.isPending}
            className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            {formik.isSubmitting || editMySettingsMutation.isPending
              ? (lang === "AR" ? "جاري الحفظ..." : "Saving...")
              : (lang === "AR" ? "حفظ" : "Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
