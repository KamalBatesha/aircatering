import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";
import { useLangStore } from "../../assets/store/langStore";
import { langText } from "../../assets/constants/lang";
import { GetMySettings } from "../../assets/apis/auth/AuthApi";
import useAuthMutation from "../../assets/apis/auth/AuthMutation";
import { IoMdClose } from "react-icons/io";
import { HiEye, HiEyeOff, HiOutlineLockClosed } from "react-icons/hi";
import { FiUser, FiMail, FiEdit3, FiShield, FiBell, FiPhone, FiHash } from "react-icons/fi";
import { FaBuilding, FaUniversity, FaMoneyCheckAlt, FaBarcode } from "react-icons/fa";
import Loading from "../loading/Loading";
import CustomLookup from "../../components/HelperComponents/CustomLookup";
import {
  getMyFlightNumbers,
  getMyRegistrations,
  getMyAirCrafts,
  getMyAgent,
  getMyOperators,
  getMyBillTo
} from "../../assets/apis/order/OrderApi";
import { GetPayTypes } from "../../assets/apis/PurchasingAPI";
import { Box, ClickAwayListener, IconButton, InputAdornment, MenuItem, MenuList, Paper, Popper, TextField } from "@mui/material";
import { getMyGroundHandlerList } from "../../assets/apis/FinanceApi";

const FreeTextLookup = ({
  label,
  options = [],
  valueId,
  valueName,
  onChange,
  getOptionLabel = (option) => option?.label || "",
  getOptionValue = (option) => option?.id,
  error,
  placeholder,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    setInputValue(valueName || "");
    setIsTyping(false);
  }, [valueName]);

  const filteredOptions = React.useMemo(() => {
    if (!isTyping) return options;

    const input = inputValue.trim().toLowerCase();
    if (!input) return options;

    return options
      .filter((opt) => getOptionLabel(opt).toLowerCase().includes(input))
      .sort((a, b) => {
        const aLabel = getOptionLabel(a).toLowerCase();
        const bLabel = getOptionLabel(b).toLowerCase();

        const aStarts = aLabel.startsWith(input);
        const bStarts = bLabel.startsWith(input);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return aLabel.localeCompare(bLabel);
      });
  }, [options, inputValue, getOptionLabel, isTyping]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);
    if (!newValue) {
      onChange(null, "");
    } else {
      const matchedOption = options.find(
        (opt) => getOptionLabel(opt).toLowerCase() === newValue.trim().toLowerCase()
      );
      if (matchedOption) {
        onChange(getOptionValue(matchedOption), getOptionLabel(matchedOption));
      } else {
        onChange(0, newValue);
      }
    }
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    onChange(getOptionValue(option), getOptionLabel(option));
    setInputValue(getOptionLabel(option));
    setIsTyping(false);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue("");
    setIsTyping(false);
    onChange(null, "");
    setIsOpen(false);
  };
  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div ref={containerRef} style={{ width: "100%" }}>
        <TextField
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={(e) => {
            if (!disabled) {
              setIsOpen(true);
              e.target.select();
            }
          }}
          size="small"
          error={error}
          disabled={disabled}
          placeholder={placeholder}
          fullWidth
          autoComplete="new-password"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "24px",
              backgroundColor: "var(--color-bg-box)",
              height: "38px",
              fontSize: "14px",
              paddingRight: inputValue ? "4px" : undefined,
            },
            "& .MuiInputBase-input": {
              color: "var(--color-primary) !important",
              padding: "0 12px",
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
              lineHeight: "14px",
              transform: "translate(14px, 12px) scale(1)",
              "&.Mui-focused, &.MuiInputLabel-shrink": {
                transform: "translate(14px, -12px) scale(0.75)",
              },
            },
          }}
          slotProps={{
            input: {
              endAdornment: inputValue ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    tabIndex={-1}
                    sx={{
                      padding: "5px",
                      color: "var(--color-primary)",
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <Popper
          open={isOpen}
          anchorEl={containerRef.current}
          placement="bottom-start"
          style={{
            zIndex: 20000000,
            width: containerRef.current?.offsetWidth,
          }}
          modifiers={[
            { name: "flip", enabled: true, options: { fallbackPlacements: ["top"] } },
            { name: "preventOverflow", enabled: true, options: { boundary: "viewport" } },
          ]}
        >
          <Paper
            className="popup-component"
            elevation={3}
            sx={{ mt: 0.5, width: "100%", height: "100%", maxHeight: 300, overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            <MenuList dense sx={{ overflowY: "auto", flex: 1, p: 0 }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <MenuItem
                    key={getOptionValue(option)}
                    onClick={() => handleSelect(option)}
                    sx={{ fontSize: "14px", py: 1.5 }}
                  >
                    {getOptionLabel(option)}
                  </MenuItem>
                ))
              ) : (
                <Box sx={{ p: 2, fontSize: "14px", color: "text.secondary", textAlign: "center" }}>No options</Box>
              )}
            </MenuList>
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

function Summary() {
  const { lang } = useLangStore();
  const queryClient = useQueryClient();
  const isRTL = lang === "AR";
  const [changePasswordPoup, setChangePasswordPoup] = useState(false);

  const { data: mySettings, isLoading } = useQuery({
    queryKey: ["mySettings"],
    queryFn: GetMySettings,
  });
  const { data: groundHandlerList } = useQuery({ queryKey: ["groundHandlerList"], queryFn: getMyGroundHandlerList });
  const { data: flightNumbers } = useQuery({ queryKey: ["flightNumbers"], queryFn: getMyFlightNumbers });
  const { data: registrations } = useQuery({ queryKey: ["registrations"], queryFn: getMyRegistrations });
  const { data: airCrafts } = useQuery({ queryKey: ["airCrafts"], queryFn: getMyAirCrafts });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: getMyAgent });
  const { data: operators } = useQuery({ queryKey: ["operators"], queryFn: getMyOperators });
  const { data: billTo } = useQuery({ queryKey: ["billTo"], queryFn: getMyBillTo });
  const { data: payTypes } = useQuery({ queryKey: ["payTypes"], queryFn: GetPayTypes });

  const { editMySettingsMutation } = useAuthMutation();

  function handleUpdateSettings(values) {
    const payload = {
      customerName: values.customerName,
      customerPersonalName: values.customerPersonalName,
      customerMobile: values.customerMobile,
      customerCountryCode: values.customerCountryCode,
      customerRemark: values.customerRemark,
      customerAddress: values.customerAddress,
      customerInstancePers: values.customerInstancePers,
      customerSubscribe: values.customerSubscribe,
      customerSubscribeDate: values.customerSubscribeDate,
      flightId: values.flightId || 0,
      registrationId: values.registrationId || 0,
      airCraftId: values.airCraftId || 0,
      paymentMethodId: values.paymentMethodId || 0,
      agentId: values.agentId || 0,
      // agentIsVisible: values.agentIsVisible,
      // agentIsRequired: values.agentIsRequired,
      operatorId: values.operatorId || 0,
      // operatorIsVisible: values.operatorIsVisible,
      // operatorIsRequired: values.operatorIsRequired,
      billToId: values.billToId || 0,
      invoicingEmail: values.invoicingEmail,
      cateringEmail: values.cateringEmail,
      paymentInfoAccountHolder: values.paymentInfoAccountHolder,
      paymentInfoIBan: values.paymentInfoIBan,
      paymentInfoSwiftCode: values.paymentInfoSwiftCode,
      groundHandlerIsVisible: values.groundHandlerIsVisible,
      groundHandlerId: values.groundHandlerId || 0,
      groundHandlerName: values.groundHandlerName,
      groundHandlerEmail: values.groundHandlerEmail,
      groundHandlerPhone: values.groundHandlerPhone,
    };
    editMySettingsMutation.mutate(payload, {
      onMutate: () => {
        onlineOrderToast.loading(langText.updatingProfile[lang], { id: "1" });
      },
      onSuccess: () => {
        onlineOrderToast.success(langText.yourProfileHasBeenUpdatedSuccessfully[lang], { id: "1" });
        queryClient.invalidateQueries(["mySettings"]);
      },
      onError: () => {
        onlineOrderToast.error(langText.failedToUpdateProfile?.[lang], { id: "1" });
      },
    });
  }

  const validationSchema = Yup.object({
    customerSubscribe: Yup.boolean(),
  });

  const [defaultDate] = useState(() => new Date().toISOString());

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      customerName: mySettings?.customerName || "",
      customerPersonalName: mySettings?.customerPersonalName || "",
      customerMobile: mySettings?.customerMobile || "",
      customerCountryCode: mySettings?.customerCountryCode || "",
      customerRemark: mySettings?.customerRemark || "",
      customerAddress: mySettings?.customerAddress || "",
      customerInstancePers: mySettings?.customerInstancePers || 0,
      customerSubscribe: mySettings?.customerSubscribe || false,
      customerSubscribeDate: mySettings?.customerSubscribeDate || defaultDate,
      flightId: mySettings?.flightId || 0,
      flightName: mySettings?.flightName || "",
      registrationId: mySettings?.registrationId || 0,
      registrationName: mySettings?.registrationName || "",
      airCraftId: mySettings?.airCraftId || 0,
      aircraftTypeName: mySettings?.airCraftTypeName || "",
      paymentMethodId: mySettings?.paymentMethodId || 0,
      paymentMethodName: mySettings?.paymentMethodName || "",
      agentId: mySettings?.agentId || 0,
      agentName: mySettings?.agentName || "",
      agentIsVisible: mySettings?.agentIsVisible ?? true,
      agentIsRequired: mySettings?.agentIsRequired ?? true,
      operatorId: mySettings?.operatorId || 0,
      operatorName: mySettings?.operatorName || "",
      operatorIsVisible: mySettings?.operatorIsVisible ?? true,
      operatorIsRequired: mySettings?.operatorIsRequired ?? true,
      billToId: mySettings?.billToId || 0,
      billToName: mySettings?.billToName || "",
      invoicingEmail: mySettings?.invoicingEmail || "",
      cateringEmail: mySettings?.cateringEmail || "",
      paymentInfoAccountHolder: mySettings?.paymentInfoAccountHolder || "",
      paymentInfoIBan: mySettings?.paymentInfoIBan || "",
      paymentInfoSwiftCode: mySettings?.paymentInfoSwiftCode || "",
      groundHandlerIsVisible: mySettings?.groundHandlerIsVisible ?? false,
      groundHandlerId: mySettings?.groundHandlerId || 0,
      groundHandlerName: mySettings?.groundHandlerName || "",
      groundHandlerEmail: mySettings?.groundHandlerEmail || "",
      groundHandlerPhone: mySettings?.groundHandlerPhone || "",
    },
    validationSchema,
    onSubmit: handleUpdateSettings,
  });

  if (isLoading) return <Loading blackText={true} />;

  return (
    <>
      <div style={{ direction: isRTL ? "rtl" : "ltr" }}>
        {/* Section heading */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(197,167,109,0.12)" }}
          >
            <FiUser size={16} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">{langText.accountInfo[lang]}</h3>
            <p className="text-xs text-gray-400">
              {lang === "AR" ? "تحديث إعدادات حسابك الشخصي" : "Update your personal account settings"}
            </p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Read-only info fields */}
            <div className="col-span-1 md:col-span-2">
              <div
                id="guide-summary-account"
                className="rounded-2xl p-5 flex flex-col gap-4 mb-2"
                style={{ border: "1px solid var(--color-light-gray)", background: "rgba(197,167,109,0.02)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-2"><FiUser size={12} /> User Name</label>
                    <input
                      disabled
                      className="px-4 py-2.5 rounded-xl text-sm outline-none text-gray-600 font-medium"
                      style={{ border: "1.5px solid var(--color-light-gray)", background: "#f3f4f6" }}
                      value={formik.values.customerName}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-2"><FaBuilding size={12} /> Company Name</label>
                    <input
                      disabled
                      className="px-4 py-2.5 rounded-xl text-sm outline-none text-gray-600 font-medium"
                      style={{ border: "1.5px solid var(--color-light-gray)", background: "#f3f4f6" }}
                      value={formik.values.customerName}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-2"><FiPhone size={12} /> Phone Number</label>
                    <input
                      disabled
                      className="px-4 py-2.5 rounded-xl text-sm outline-none text-gray-600 font-medium"
                      style={{ border: "1.5px solid var(--color-light-gray)", background: "#f3f4f6", direction: "ltr", textAlign: isRTL ? "right" : "left" }}
                      value={`${formik.values.customerCountryCode}${formik.values.customerMobile}`}
                    />
                  </div>
                </div>

                {/* Additional Editable Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-2">
                      <FiMail size={12} /> {lang === "AR" ? "بريد التموين الإلكتروني" : "Catering Email"}
                    </label>
                    <input
                      className="px-4 py-2.5 rounded-xl text-sm outline-none text-gray-600 font-medium transition-all duration-200"
                      style={{ border: "1.5px solid var(--color-light-gray)", background: "#fafafa" }}
                      onFocus={e => (e.target.style.borderColor = "var(--color-primary)")}
                      onBlur={e => (e.target.style.borderColor = "var(--color-light-gray)")}
                      {...formik.getFieldProps("cateringEmail")}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-2">
                      <FiMail size={12} /> {lang === "AR" ? "بريد الفواتير الإلكتروني" : "Invoicing Email"}
                    </label>
                    <input
                      className="px-4 py-2.5 rounded-xl text-sm outline-none text-gray-600 font-medium transition-all duration-200"
                      style={{ border: "1.5px solid var(--color-light-gray)", background: "#fafafa" }}
                      onFocus={e => (e.target.style.borderColor = "var(--color-primary)")}
                      onBlur={e => (e.target.style.borderColor = "var(--color-light-gray)")}
                      {...formik.getFieldProps("invoicingEmail")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Default Order Values Section */}
            <div id="guide-summary-default" className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1 md:col-span-2 mt-2 mb-1">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FiEdit3 size={14} style={{ color: "var(--color-primary)" }} />
                {lang === "AR" ? "القيم الافتراضية للطلب التالي" : "Default Values for Next Order"}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {lang === "AR"
                  ? "سيتم استخدام هذه الحقول كقيم افتراضية عند إنشاء طلب جديد."
                  : "These fields will be used as default values when creating a new order."}
              </p>
              <div className="w-full h-px mt-3" style={{ background: "linear-gradient(90deg, rgba(197,167,109,0.3) 0%, transparent 100%)" }}></div>
            </div>

            {/* Dropdowns */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {langText.flightNumber[lang]}
              </label>
              <FreeTextLookup
                options={flightNumbers || []}
                valueId={formik.values.flightId}
                valueName={formik.values.flightName}
                onChange={(id, name) => {
                  formik.setFieldValue("flightId", id);
                  formik.setFieldValue("flightName", name);
                }}
                getOptionLabel={(opt) => opt.flightNumberName}
                getOptionValue={(opt) => opt.flightNumberId}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {langText.registration[lang]}
              </label>
              <FreeTextLookup
                options={registrations || []}
                valueId={formik.values.registrationId}
                valueName={formik.values.registrationName}
                onChange={(id, name) => {
                  formik.setFieldValue("registrationId", id);
                  formik.setFieldValue("registrationName", name);
                }}
                getOptionLabel={(opt) => opt.registrationName}
                getOptionValue={(opt) => opt.registrationId}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {langText.aircraftType[lang]}
              </label>
              <FreeTextLookup
                options={airCrafts || []}
                valueId={formik.values.airCraftId}
                valueName={formik.values.aircraftTypeName}
                onChange={(id, name) => {
                  formik.setFieldValue("airCraftId", id);
                  formik.setFieldValue("aircraftTypeName", name);
                }}
                getOptionLabel={(opt) => opt.airCraftName}
                getOptionValue={(opt) => opt.airCraftId}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {langText.paymentMethod[lang]}
              </label>
              <CustomLookup
                options={payTypes || []}
                value={formik.values.paymentMethodId}
                onChange={(val) => {
                  formik.setFieldValue("paymentMethodId", val);
                  const selectedOpt = payTypes?.find(p => p.cashTransactionTypeId === val);
                  if (selectedOpt) formik.setFieldValue("paymentMethodName", selectedOpt.cashTransactionTypeName);
                }}
                getOptionLabel={(opt) => opt.cashTransactionTypeName}
                getOptionValue={(opt) => opt.cashTransactionTypeId}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {langText.billTo[lang]}
              </label>
              <FreeTextLookup
                options={billTo || []}
                valueId={formik.values.billToId}
                valueName={formik.values.billToName}
                onChange={(id, name) => {
                  formik.setFieldValue("billToId", id);
                  formik.setFieldValue("billToName", name);
                }}
                getOptionLabel={(opt) => opt.billToName}
                getOptionValue={(opt) => opt.billToId}
              />
            </div>

            {formik.values.operatorIsVisible && (
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {langText.operator[lang]}
                </label>
                <FreeTextLookup
                  options={operators || []}
                  valueId={formik.values.operatorId}
                  valueName={formik.values.operatorName}
                  onChange={(id, name) => {
                    formik.setFieldValue("operatorId", id);
                    formik.setFieldValue("operatorName", name);
                  }}
                  getOptionLabel={(opt) => opt.operatorName}
                  getOptionValue={(opt) => opt.operatorId}
                />
              </div>
            )}

            {formik.values.agentIsVisible && (
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {langText.agent[lang]}
                </label>
                <FreeTextLookup
                  options={agents || []}
                  valueId={formik.values.agentId}
                  valueName={formik.values.agentName}
                  onChange={(id, name) => {
                    formik.setFieldValue("agentId", id);
                    formik.setFieldValue("agentName", name);
                  }}
                  getOptionLabel={(opt) => opt.agentName}
                  getOptionValue={(opt) => opt.agentId}
                />
              </div>
            )}
            </div>

            {formik.values.groundHandlerIsVisible && (
              <div className="col-span-1 md:col-span-2 mt-2 border-t border-gray-100 pt-5" id="guide-summary-gh">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                  {lang === "EN" ? "Ground Handler Information" : "معلومات مزود الخدمة الأرضية"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === "EN" ? "Ground Handler Email" : "البريد الإلكتروني למزود الخدمة"}
                    </label>
                    <TextField
                      size="small"
                      fullWidth
                      value={formik.values.groundHandlerEmail || ""}
                      onChange={formik.handleChange("groundHandlerEmail")}
                      onBlur={formik.handleBlur("groundHandlerEmail")}
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
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === "EN" ? "Ground Handler Phone" : "هاتف مزود الخدمة الأرضية"}
                    </label>
                    <TextField
                      size="small"
                      fullWidth
                      value={formik.values.groundHandlerPhone || ""}
                      onChange={formik.handleChange("groundHandlerPhone")}
                      onBlur={formik.handleBlur("groundHandlerPhone")}
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
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bank Information Display */}
          {(mySettings?.paymentInfoAccountBankName || mySettings?.paymentInfoAccountNumber || mySettings?.paymentInfoIBan || mySettings?.paymentInfoSwiftCode) && (
            <div
              id="guide-summary-bank"
              className="rounded-2xl p-5 flex flex-col gap-4 mb-2"
              style={{ border: "1px solid var(--color-light-gray)", background: "rgba(197,167,109,0.02)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FaUniversity size={16} style={{ color: "var(--color-primary)" }} />
                <h4 className="text-sm font-bold text-gray-800">
                  {lang === "AR" ? "المعلومات البنكية" : "Bank Information"}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mySettings?.paymentInfoAccountBankName && (
                  <TextField
                    label={lang === "AR" ? "اسم البنك" : "Bank Name"}
                    value={mySettings.paymentInfoAccountBankName}
                    size="small"
                    disabled
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "var(--color-bg-box)",
                        height: "38px",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        color: "var(--color-primary) !important",
                        WebkitTextFillColor: "var(--color-primary) !important",
                        padding: "0 12px",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "14px",
                        lineHeight: "14px",
                        transform: "translate(14px, 12px) scale(1)",
                        "&.Mui-focused, &.MuiInputLabel-shrink": {
                          transform: "translate(14px, -12px) scale(0.75)",
                        },
                      },
                    }}
                  />
                )}
                {mySettings?.paymentInfoAccountNumber && (
                  <TextField
                    label={lang === "AR" ? "رقم الحساب" : "Account Number"}
                    value={mySettings.paymentInfoAccountNumber}
                    size="small"
                    disabled
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "var(--color-bg-box)",
                        height: "38px",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        color: "var(--color-primary) !important",
                        WebkitTextFillColor: "var(--color-primary) !important",
                        padding: "0 12px",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "14px",
                        lineHeight: "14px",
                        transform: "translate(14px, 12px) scale(1)",
                        "&.Mui-focused, &.MuiInputLabel-shrink": {
                          transform: "translate(14px, -12px) scale(0.75)",
                        },
                      },
                    }}
                  />
                )}
                {mySettings?.paymentInfoIBan && (
                  <TextField
                    label="IBAN"
                    value={mySettings.paymentInfoIBan}
                    size="small"
                    disabled
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "var(--color-bg-box)",
                        height: "38px",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        color: "var(--color-primary) !important",
                        WebkitTextFillColor: "var(--color-primary) !important",
                        padding: "0 12px",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "14px",
                        lineHeight: "14px",
                        transform: "translate(14px, 12px) scale(1)",
                        "&.Mui-focused, &.MuiInputLabel-shrink": {
                          transform: "translate(14px, -12px) scale(0.75)",
                        },
                      },
                    }}
                  />
                )}
                {mySettings?.paymentInfoSwiftCode && (
                  <TextField
                    label="Swift Code"
                    value={mySettings.paymentInfoSwiftCode}
                    size="small"
                    disabled
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "24px",
                        backgroundColor: "var(--color-bg-box)",
                        height: "38px",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        color: "var(--color-primary) !important",
                        WebkitTextFillColor: "var(--color-primary) !important",
                        padding: "0 12px",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "14px",
                        lineHeight: "14px",
                        transform: "translate(14px, 12px) scale(1)",
                        "&.Mui-focused, &.MuiInputLabel-shrink": {
                          transform: "translate(14px, -12px) scale(0.75)",
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Subscribe toggle */}
          <label
            id="guide-summary-newsletter"
            className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl select-none transition-colors mt-2"
            style={{
              border: `1.5px solid ${formik.values.customerSubscribe ? "var(--color-primary)" : "var(--color-light-gray)"}`,
              background: formik.values.customerSubscribe ? "rgba(197,167,109,0.07)" : "#fafafa",
            }}
          >
            {/* Custom toggle switch */}
            <div
              className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
              style={{ background: formik.values.customerSubscribe ? "var(--color-primary)" : "#d1d5db" }}
              onClick={() => formik.setFieldValue("customerSubscribe", !formik.values.customerSubscribe)}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                style={{ transform: formik.values.customerSubscribe ? "translateX(20px)" : "translateX(0)" }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiBell size={13} style={{ color: "var(--color-primary)" }} />
                {langText.subscribeToOurNewsletter[lang]}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {lang === "AR" ? "استلم آخر العروض والأخبار" : "Receive the latest offers and news"}
              </p>
            </div>
          </label>

          {/* Submit */}
          <div className="flex justify-between items-center mt-1">
            <button
              id="guide-summary-pwd-btn"
              type="button"
              onClick={() => setChangePasswordPoup(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-md active:scale-95"
              style={{
                border: "1.5px solid var(--color-primary)",
                color: "var(--color-primary)",
                background: "rgba(197,167,109,0.07)",
              }}
            >
              <FiShield size={14} />
              {langText.changePassword[lang]}
            </button>

            <button
              id="guide-summary-update-btn"
              type="submit"
              disabled={editMySettingsMutation.isPending}
              className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, var(--color-primary), #a8894f)", boxShadow: "0 4px 16px rgba(197,167,109,0.30)" }}
            >
              {editMySettingsMutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {lang === "AR" ? "جاري التحديث..." : "Updating..."}
                </>
              ) : (
                <>
                  <FiEdit3 size={14} />
                  {langText.update[lang]}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {changePasswordPoup && (
        <ChangePasswordPopup onClose={() => setChangePasswordPoup(false)} />
      )}
    </>
  );
}

export default Summary;

const PasswordField = ({ id, label, show, onToggle, fieldProps, error, touched, isRTL }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-medium text-gray-600">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        id={id}
        placeholder="••••••••"
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 pe-11"
        style={{
          border: `1.5px solid ${touched && error ? "#EF4444" : "var(--color-light-gray)"}`,
          background: touched && error ? "#fef2f2" : "#fafafa",
        }}
        onFocus={e => (e.target.style.borderColor = "var(--color-primary)")}
        onBlur={e => { fieldProps.onBlur(e); e.target.style.borderColor = touched && error ? "#EF4444" : "var(--color-light-gray)"; }}
        {...fieldProps}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
        style={{ [isRTL ? "left" : "right"]: "14px" }}
      >
        {show ? <HiEyeOff size={18} /> : <HiEye size={18} />}
      </button>
    </div>
    {touched && error && (
      <p className="text-red-500 text-xs flex items-start gap-1 leading-tight">
        <span className="w-1 h-1 rounded-full bg-red-500 shrink-0 mt-1.5 inline-block" />
        {error}
      </p>
    )}
  </div>
);

function ChangePasswordPopup({ onClose }) {
  const { editMutation } = useAuthMutation({ onClose });
  const { lang } = useLangStore();
  const isRTL = lang === "AR";

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function HandleChangePassword(values) {
    editMutation.mutate(
      { currentPassword: values?.currentPassword, newPassword: values?.password },
      {
        onSuccess: () => {
          onlineOrderToast.success(langText.PasswordUpdatedSuccessfully[lang]);
          formik.resetForm();
          onClose();
        },
        onError: () => {
          onlineOrderToast.error(langText.failedToUpdatePassword[lang]);
        },
      }
    );
  }

  const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required(langText.currentPasswordIsRequired[lang]),
    password: Yup.string()
      .required(langText.PasswordIsRequired[lang])
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/,
        langText.passwordMustContainAtLeast8CharactersOneUppercaseOneLowercaseOneNumberAndOneSpecialCharacter[lang]
      ),
    confirmPassword: Yup.string()
      .required(langText.confirmPasswordIsRequired[lang])
      .oneOf([Yup.ref("password"), null], langText.passwordsMustMatch[lang]),
  });

  const formik = useFormik({
    initialValues: { currentPassword: "", password: "", confirmPassword: "" },
    onSubmit: HandleChangePassword,
    validationSchema: changePasswordSchema,
  });



  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => { formik.resetForm(); onClose(); }}
      />

      {/* Modal */}
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "popup-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Gold accent top bar */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, var(--color-primary), #a8894f)" }} />

        {/* Close */}
        <button
          id="guide-pwd-close"
          onClick={() => { formik.resetForm(); onClose(); }}
          className="absolute top-4 p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
          style={{ [isRTL ? "left" : "right"]: "16px" }}
        >
          <IoMdClose size={20} />
        </button>

        <form onSubmit={formik.handleSubmit} className="px-7 pt-8 pb-7 flex flex-col gap-5" id="guide-pwd-form">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-1">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(197,167,109,0.12)", border: "2px solid var(--color-primary)" }}
            >
              <HiOutlineLockClosed size={24} style={{ color: "var(--color-primary)" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{langText.changePassword[lang]}</h2>
            <p className="text-xs text-gray-400 text-center">
              {lang === "AR"
                ? "يرجى إدخال كلمة المرور الحالية والجديدة لتأمين حسابك"
                : "Enter your current and new password to secure your account"}
            </p>
          </div>

          <PasswordField
            id="currentPassword"
            label={langText.currentPassword[lang]}
            show={showCurrent}
            onToggle={() => setShowCurrent(p => !p)}
            fieldProps={formik.getFieldProps("currentPassword")}
            error={formik.errors.currentPassword}
            touched={formik.touched.currentPassword}
            isRTL={isRTL}
          />
          <PasswordField
            id="password"
            label={langText.newPassword[lang]}
            show={showNew}
            onToggle={() => setShowNew(p => !p)}
            fieldProps={formik.getFieldProps("password")}
            error={formik.errors.password}
            touched={formik.touched.password}
            isRTL={isRTL}
          />
          <PasswordField
            id="confirmPassword"
            label={langText.confirmPassword[lang]}
            show={showConfirm}
            onToggle={() => setShowConfirm(p => !p)}
            fieldProps={formik.getFieldProps("confirmPassword")}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            isRTL={isRTL}
          />

          {/* Submit */}
          <button
            id="guide-pwd-update"
            type="submit"
            disabled={editMutation.isPending}
            className="w-full mt-1 py-3.5 rounded-full text-white font-bold text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, var(--color-primary), #a8894f)", boxShadow: "0 4px 16px rgba(197,167,109,0.28)" }}
          >
            {editMutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {lang === "AR" ? "جاري التحديث..." : "Updating..."}
              </>
            ) : langText.update[lang]}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes popup-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
