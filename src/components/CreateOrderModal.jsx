
import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck, FaUniversity, FaQuestionCircle } from 'react-icons/fa';
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GetPayTypes } from "../assets/apis/PurchasingAPI";
import CustomLookup from './HelperComponents/CustomLookup';

const FormObserver = ({ currencyList, setFieldValue }) => {
   const didSetCurrency = useRef(false);
   useEffect(() => {
      if (!didSetCurrency.current && currencyList?.length) {
         // Case-insensitive USD match, fall back to first currency if not found
         const usd = currencyList?.find((c) => c.currencyName?.toUpperCase() === "USD")
            || currencyList[0];
         if (usd?.currencyId != null) {
            setFieldValue("paymentCurrency", usd.currencyId);
            didSetCurrency.current = true;
         }
      }
   }, [currencyList, setFieldValue]);

   return null;
};

// ─── Guest Draft Persistence ─────────────────────────────────────────────────
const GUEST_DRAFT_KEY = "guestCreateOrderDraft";

const serializeGuestDraft = (values, step, maxReachedStep) => {
   return JSON.stringify({
      values: {
         ...values,
         arrivalDate: values.arrivalDate?.isValid?.() ? values.arrivalDate.toISOString() : null,
         departureDate: values.departureDate?.isValid?.() ? values.departureDate.toISOString() : null,
         arrivalDeliveryDate: values.arrivalDeliveryDate?.isValid?.() ? values.arrivalDeliveryDate.toISOString() : null,
         departureDeliveryDate: values.departureDeliveryDate?.isValid?.() ? values.departureDeliveryDate.toISOString() : null,
      },
      step,
      maxReachedStep,
   });
};

const restoreGuestDraft = (stepsLength) => {
   try {
      const submitted = localStorage.getItem("GUEST_SUBMITTED_ORDER");
      const raw = submitted || sessionStorage.getItem(GUEST_DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.values) return null;
      const v = parsed.values;
      return {
         values: {
            ...v,
            arrivalDate: v.arrivalDate ? dayjs(v.arrivalDate) : null,
            departureDate: v.departureDate ? dayjs(v.departureDate) : null,
            arrivalDeliveryDate: v.arrivalDeliveryDate ? dayjs(v.arrivalDeliveryDate) : null,
            departureDeliveryDate: v.departureDeliveryDate ? dayjs(v.departureDeliveryDate) : null,
         },
         step: Math.min(Math.max(parsed.step ?? 0, 0), stepsLength - 1),
         maxReachedStep: Math.min(Math.max(parsed.maxReachedStep ?? 0, 0), stepsLength - 1),
      };
   } catch {
      return null;
   }
};

const GuestDraftSaver = ({ values, step, maxReachedStep, user }) => {
   useEffect(() => {
      if (!user) {
         sessionStorage.setItem(GUEST_DRAFT_KEY, serializeGuestDraft(values, step, maxReachedStep));
      }
   }, [values, step, maxReachedStep, user]);
   return null;
};

import {
   Box,
   ClickAwayListener,
   IconButton,
   InputAdornment,
   MenuItem,
   MenuList,
   Paper,
   Popper,
   TextField,
} from "@mui/material";

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
   uppercase = false,
   onBlur,
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
         ?.filter((opt) => String(getOptionLabel(opt) ?? "").toLowerCase().includes(input))
         ?.sort((a, b) => {
            const aLabel = String(getOptionLabel(a) ?? "").toLowerCase();
            const bLabel = String(getOptionLabel(b) ?? "").toLowerCase();

            const aStarts = aLabel.startsWith(input);
            const bStarts = bLabel.startsWith(input);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return aLabel.localeCompare(bLabel);
         });
   }, [options, inputValue, getOptionLabel, isTyping]);

   const handleInputChange = (e) => {
      let newValue = e.target.value.replace(/[\u0600-\u06FF]/g, "");
      if (uppercase) newValue = newValue.toUpperCase();
      setInputValue(newValue);
      setIsTyping(true);
      if (!newValue) {
         onChange(null, "");
      } else {
         const matchedOption = options?.find(
            (opt) => String(getOptionLabel(opt) ?? "").toLowerCase() === newValue.trim().toLowerCase()
         );
         if (matchedOption) {
            onChange(getOptionValue(matchedOption), String(getOptionLabel(matchedOption) ?? ""));
         } else {
            onChange(0, newValue);
         }
      }
      setIsOpen(true);
   };

   const handleSelect = (option) => {
      const label = String(getOptionLabel(option) ?? "");
      onChange(getOptionValue(option), label);
      setInputValue(label);
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
               onBlur={onBlur}
               size="small"
               error={error}
               disabled={disabled}
               placeholder={placeholder}
               fullWidth
               autoComplete="new-password"
               sx={{
                  "& .MuiOutlinedInput-root": {
                     borderRadius: "50px",
                     backgroundColor: "var(--color-bg-box)",
                     height: "30px",
                     fontSize: "12px",
                     paddingRight: inputValue ? "4px" : undefined,
                  },
                  "& .MuiInputBase-input": {
                     color: "var(--color-primary) !important",
                     padding: "0 12px",
                  },
                  "& .MuiInputLabel-root": {
                     fontSize: "12px",
                     lineHeight: "14px",
                     transform: "translate(14px, 8px) scale(1)",
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
                  {
                     name: "flip",
                     enabled: true,
                     options: {
                        fallbackPlacements: ["top"],
                     },
                  },
                  {
                     name: "preventOverflow",
                     enabled: true,
                     options: {
                        boundary: "viewport",
                     },
                  },
               ]}
            >
               <Paper
                  className="popup-component"
                  elevation={3}
                  sx={{
                     mt: 0.5,
                     width: "100%",
                     height: "100%",
                     maxHeight: 300,
                     overflow: "hidden",
                     display: "flex",
                     flexDirection: "column",
                  }}
               >
                  <MenuList dense sx={{ overflowY: "auto", flex: 1, p: 0 }}>
                     {filteredOptions?.length > 0 ? (
                        filteredOptions?.map((option) => (
                           <MenuItem
                              key={getOptionValue(option)}
                              onClick={() => handleSelect(option)}
                              sx={{ fontSize: "12px" }}
                           >
                              {String(getOptionLabel(option) ?? "")}
                           </MenuItem>
                        ))
                     ) : (
                        <Box
                           sx={{
                              p: 2,
                              fontSize: "12px",
                              color: "text.secondary",
                              textAlign: "center",
                           }}
                        >
                           No options
                        </Box>
                     )}
                  </MenuList>
               </Paper>
            </Popper>
         </div>
      </ClickAwayListener>
   );
};


import {
   GetHeaderPriceList,
   GetFlightNumbersList,
   GetRegisterationList,
   GetAirCraftList,
   GetAgentsList,
   GetOperatorsList,
   GetBillToList,
   GetInvoiceToList,
} from '../assets/apis/SalesAPI';

import { CurrencyListSales, getMyGroundHandlerList } from '../assets/apis/FinanceApi';
import { GetStationsList } from '../assets/apis/PurchasingAPI';
import { useLangStore } from '../assets/store/langStore';
import { langText } from '../assets/constants/lang';
import useProductMutation from '../assets/apis/product/ProductMutation';
import toast from 'react-hot-toast';
import { useStationStore } from '../assets/store/stationStore';
import { useCartStore } from '../assets/store/cartStore';
import { onlineOrderToast } from '../assets/Helpers/onlineOrderToast';
import { getMyAirCrafts, getMyBillTo, getMyFlightNumbers, getMyRegistrations, GetCustomerProfileSettings, UpdateCustomerProfileSettings, SaveOrderAgainAirCatering, getMyAgent, getMyOperators, SendGuestRequest } from '../assets/apis/order/OrderApi';
import { useNavigate } from 'react-router-dom';
import HelpTooltip from './HelpTooltip';
import { fieldDescriptions } from '../assets/constants/fieldDescriptions';
import useAuthStore, { clearGuestStorage } from '../assets/store/authStore';
import { GetCountriesCodes } from '../assets/apis/country/Country';

const createDateWithTime = (existingVal, newDate) => {
   if (!newDate || !newDate.isValid()) return null;
   const now = dayjs();
   const isExistingValid = existingVal && dayjs.isDayjs(existingVal) && existingVal.isValid();
   let hour = isExistingValid ? existingVal.hour() : now.hour();
   let minute = isExistingValid ? existingVal.minute() : now.minute();
   
   let updated = newDate.hour(hour).minute(minute).second(0).millisecond(0);
   if (updated.isBefore(now)) {
      updated = updated.hour(now.hour() + 4).minute(now.minute());
   }
   return updated;
};

const createTimeWithDate = (existingVal, newTime) => {
   if (!newTime || !newTime.isValid()) return existingVal;
   const base = existingVal && dayjs.isDayjs(existingVal) && existingVal.isValid() ? existingVal : dayjs().add(4, 'hour');
   return base.hour(newTime.hour()).minute(newTime.minute()).second(0).millisecond(0);
};

export default function CreateOrderModal({ isOpen, onClose, oldOrderId = null }) {
   const navigate = useNavigate();
   const [step, setStep] = useState(0);
   const [maxReachedStep, setMaxReachedStep] = useState(0);
   const [isGuestSubmitted, setIsGuestSubmitted] = useState(false);
   const [showGuestConfirmModal, setShowGuestConfirmModal] = useState(false);
   const [pendingGuestData, setPendingGuestData] = useState(null);
   const { user } = useAuthStore();
   const { cart, clearCart } = useCartStore((state) => state);

   const { lang } = useLangStore();

   const { data: profileSettings } = useQuery({
      queryKey: ["customerProfileSettings"],
      queryFn: GetCustomerProfileSettings,
      enabled: isOpen && !!user,
   });

   const GuestSchema = Yup.object().shape({
      mobil: Yup.string().required(langText.phoneNumberIsRequired[lang]),
      email: Yup.string().required(langText.emailIsRequired[lang]).email(langText.pleaseEnterAValidEmailAddress[lang]),
      contryID: Yup.number().required(langText.countryIsRequired[lang]),
      companyName: Yup.string().required(langText.companyNameIsRequired[lang]),
      companyPersonalName: Yup.string().required(langText.companyPersonalNameIsRequired[lang]),
      companyLink: Yup.string()
         .required(langText.companyLinkIsRequired[lang])
         .test(
            "is-valid-url",
            lang === "AR" ? "رابط غير صالح (مثل: example.com أو https://example.com)" : "Invalid URL format (e.g., example.com or https://example.com)",
            (val) => {
               if (!val) return false;
               const trimmed = val.trim();
               return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed);
            }
         ),
   });

   const Step1Schema = Yup.object().shape({
      station: Yup.number().required(langText.stationIsRequired[lang]),
      priceList: Yup.number().required(langText.priceListIsRequired[lang]),
      flightNumberName: Yup.string()
			.required(langText.flightNumberIsRequired[lang])
			.matches(/^[A-Za-z0-9/\s-]{1,30}$/, lang === "AR" ? "رقم الرحلة غير صالح" : "Invalid Flight Number format"),
		registrationName: profileSettings?.customerDataNotAplicable
			? Yup.string()
			: Yup.string()
				.required(langText.registrationIsRequired[lang])
				.matches(/^[A-Za-z0-9/\s-]{1,30}$/, lang === "AR" ? "رقم التسجيل غير صالح" : "Invalid Registration format"),
		aircraftTypeName: Yup.string()
			.required(langText.aircraftTypeIsRequired[lang])
			.matches(/^[A-Za-z0-9/\s-]{1,30}$/, lang === "AR" ? "نوع الطائرة غير صالح" : "Invalid Aircraft Type format"),
      orderHeaderArrivalPaxnum: Yup.number().when("orderHeaderFlightType", {
         is: (val) => val === "Arrival" || val === "Both",
         then: (schema) => schema.min(0, lang === "AR" ? "يجب أن يكون 0 أو أكثر" : "Must be at least 0").required(lang === "AR" ? "عدد ركاب الوصول مطلوب" : "Number of Arrival Passengers is required"),
         otherwise: (schema) => schema.nullable(),
      }),
      orderHeaderArrivalCrewNum: Yup.number().when("orderHeaderFlightType", {
         is: (val) => val === "Arrival" || val === "Both",
         then: (schema) => schema.min(0, lang === "AR" ? "يجب أن يكون 0 أو أكثر" : "Must be at least 0").required(lang === "AR" ? "عدد أفراد طاقم الوصول مطلوب" : "Number of Arrival Crew is required"),
         otherwise: (schema) => schema.nullable(),
      }),
      orderHeaderPaxnum: Yup.number().when("orderHeaderFlightType", {
         is: (val) => val === "Departure" || val === "Both",
         then: (schema) => schema.min(0, lang === "AR" ? "يجب أن يكون 0 أو أكثر" : "Must be at least 0").required(lang === "AR" ? "عدد ركاب المغادرة مطلوب" : "Number of Departure Passengers is required"),
         otherwise: (schema) => schema.nullable(),
      }),
      orderHeaderCrewNum: Yup.number().when("orderHeaderFlightType", {
         is: (val) => val === "Departure" || val === "Both",
         then: (schema) => schema.min(0, lang === "AR" ? "يجب أن يكون 0 أو أكثر" : "Must be at least 0").required(lang === "AR" ? "عدد أفراد طاقم المغادرة مطلوب" : "Number of Departure Crew is required"),
         otherwise: (schema) => schema.nullable(),
      }),
      orderHeaderFlightType: Yup.string().required(lang === "AR" ? "نوع الرحلة مطلوب" : "Flight Type is required"),
   });

   // Step 2: Date & Time + Delivery Dates (merged)
   const Step2Schema = Yup.object().shape({
      arrivalDate: Yup.mixed()
         .nullable()
         .when("orderHeaderFlightType", {
            is: (val) => val === "Arrival" || val === "Both",
            then: (schema) =>
               schema
                  .required(langText.arrivalDateIsRequired[lang])
                  .test(
                     'arrival-valid',
                     langText.arrivalDateIsRequired[lang],
                     (val) => Boolean(val && (dayjs.isDayjs(val) ? val.isValid() : true))
                  )
                  .test(
                     'arrival-future',
                     lang === "AR" ? "يجب أن يكون تاريخ الوصول في المستقبل" : "Arrival date must be in the future",
                     (val) => {
                        if (!val || !dayjs.isDayjs(val) || !val.isValid()) return true;
                        return val.isAfter(dayjs());
                     }
                  ),
            otherwise: (schema) => schema.nullable(),
         }),
      departureDate: Yup.mixed()
         .nullable()
         .when("orderHeaderFlightType", {
            is: (val) => val === "Departure" || val === "Both",
            then: (schema) =>
               schema
                  .required(langText.departureDateIsRequired[lang])
                  .test(
                     'departure-valid',
                     langText.departureDateIsRequired[lang],
                     (val) => Boolean(val && (dayjs.isDayjs(val) ? val.isValid() : true))
                  )
                  .test(
                     'departure-future',
                     lang === "AR" ? "يجب أن يكون تاريخ المغادرة في المستقبل" : "Departure date must be in the future",
                     (val) => {
                        if (!val || !dayjs.isDayjs(val) || !val.isValid()) return true;
                        return val.isAfter(dayjs());
                     }
                  )
                  .test(
                     'is-after-arrival',
                     langText.departureMustBeAfterArrival?.[lang] || "Departure must be after arrival",
                     function (val) {
                        const { orderHeaderFlightType, arrivalDate } = this.parent;
                        if (orderHeaderFlightType !== "Both") return true;
                        if (!val || !val.isValid() || !arrivalDate || !arrivalDate.isValid()) return true;
                        return val.isAfter(arrivalDate);
                     }
                  ),
            otherwise: (schema) => schema.nullable(),
         }),
      arrivalDeliveryDate: Yup.mixed()
         .nullable()
         .test(
            'depends-on-arrival',
            langText.arrivalReqForDelivery?.[lang] || 'Cannot add delivery date without arrival date',
            function (val) {
               const { orderHeaderFlightType, arrivalDate } = this.parent;
               if (orderHeaderFlightType === "Departure") return true;
               if (val && !arrivalDate) return false;
               return true;
            }
         )
         .test(
            'after-arrival',
            lang === 'AR' ? 'تاريخ توصيل الوصول يجب أن يكون بعد تاريخ الوصول' : 'Arrival Delivery must be after Arrival Date',
            function (val) {
               const { orderHeaderFlightType, arrivalDate } = this.parent;
               if (orderHeaderFlightType === "Departure") return true;
               if (!val || !val.isValid() || !arrivalDate || !arrivalDate.isValid()) return true;
               return val.isAfter(arrivalDate);
            }
         )
         .test(
            'future-date',
            lang === 'AR' ? 'يجب أن يكون بعد 4 ساعات من الآن على الأقل' : 'Must be at least 4 hours from now',
            function (val) {
               if (!val || !val.isValid()) return true;
               return val.isAfter(dayjs().add(4, 'hour'));
            }
         ),
      departureDeliveryDate: Yup.mixed()
         .nullable()
         .test(
            'depends-on-departure',
            langText.departureReqForDelivery?.[lang] || 'Cannot add delivery date without departure date',
            function (val) {
               const { orderHeaderFlightType, departureDate } = this.parent;
               if (orderHeaderFlightType === "Arrival") return true;
               if (val && !departureDate) return false;
               return true;
            }
         )
         .test(
            'after-arrival-delivery',
            lang === 'AR' ? 'يجب أن يكون بعد تاريخ توصيل الوصول' : 'Must be after Arrival Delivery Date',
            function (val) {
               const { orderHeaderFlightType, arrivalDeliveryDate } = this.parent;
               if (orderHeaderFlightType !== "Both") return true;
               if (!val || !val.isValid() || !arrivalDeliveryDate || !arrivalDeliveryDate.isValid()) return true;
               return val.isAfter(arrivalDeliveryDate);
            }
         )
         .test(
            'before-departure',
            lang === 'AR' ? 'تاريخ توصيل المغادرة يجب أن يكون قبل تاريخ المغادرة' : 'Departure Delivery must be before Departure Date',
            function (val) {
               const { orderHeaderFlightType, departureDate } = this.parent;
               if (orderHeaderFlightType === "Arrival") return true;
               if (!val || !val.isValid() || !departureDate || !departureDate.isValid()) return true;
               return val.isBefore(departureDate);
            }
         )
         .test(
            'future-date',
            lang === 'AR' ? 'يجب أن يكون بعد 4 ساعات من الآن على الأقل' : 'Must be at least 4 hours from now',
            function (val) {
               if (!val || !val.isValid()) return true;
               return val.isAfter(dayjs().add(4, 'hour'));
            }
         )
   });

   // Step 3: Client & Payment + Ground Handler (merged)
   const Step3Schema = Yup.object().shape({
      billToName: Yup.string().required(langText.billToIsRequired[lang]),
      invoiceTo: Yup.number().required(langText.invoiceToIsRequired[lang]),
      paymentMethod: Yup.number().required(langText.paymentMethodIsRequired[lang]),
      paymentCurrency: Yup.number().required(langText.paymentCurrencyIsRequired[lang]),
      orderHeadearGroundHandlerName: profileSettings?.groundHandlerIsRequired === true
         ? Yup.string().required(lang === "AR" ? "مزود الخدمة الأرضية مطلوب" : "Ground Handler Name is required")
         : Yup.string(),
      orderHeadearGroundHandlerEmail: Yup.string().email(lang === "AR" ? "البريد الإلكتروني غير صالح" : "Invalid email format"),
      orderHeadearGroundHandlerPhone: Yup.string(),
      agentName: (!user || profileSettings?.agentIsRequired === true)
         ? Yup.string().required(lang === "AR" ? "الوكيل مطلوب" : "Agent Name is required")
         : Yup.string(),
      operatorName: (!user || profileSettings?.operatorIsRequired === true)
         ? Yup.string().required(lang === "AR" ? "المشغل مطلوب" : "Operator Name is required")
         : Yup.string(),
   });

   const { createOrderByClientMutation } = useProductMutation();
   const { setSelectedOrder } = useCartStore();
   const queryClient = useQueryClient();

   const orderAgainMutation = useMutation({
      mutationFn: SaveOrderAgainAirCatering,
   });

   const guestMutation = useMutation({
      mutationFn: SendGuestRequest,
   });

   const isGroundHandlerVisible = profileSettings?.groundHandlerIsVisible === true;

   // 3 steps: Order Details → Date & Time → Client & Payment
   const baseStepsConfig = [
      { id: 'orderDetail', label: langText.orderDetail[lang].replace(/^\d+\.\s*/, ''), schema: Step1Schema },
      { id: 'dateTime', label: langText.dateTime[lang].replace(/^\d+\.\s*/, ''), schema: Step2Schema },
      { id: 'clientAndPayment', label: langText.clientAndPayment[lang].replace(/^\d+\.\s*/, ''), schema: Step3Schema },
   ];

   const stepsConfig = user ? baseStepsConfig : [
      { id: 'guestInfo', label: lang === "AR" ? "بيانات طلب التسجيل" : "Registration Request Data", schema: GuestSchema },
      ...baseStepsConfig
   ];

   const validationSchemas = stepsConfig?.map(s => s.schema);
   const { data: countries } = useQuery({ queryKey: ["countries"], queryFn: GetCountriesCodes, enabled: isOpen && !user });
   const { data: stations } = useQuery({ queryKey: ["stations"], queryFn: GetStationsList, enabled: isOpen });
   const { data: priceLists } = useQuery({ queryKey: ["priceLists"], queryFn: GetHeaderPriceList, enabled: isOpen });
   const { data: flightNumbers } = useQuery({ queryKey: ["flightNumbers"], queryFn: getMyFlightNumbers, enabled: isOpen });
   const { data: registrations } = useQuery({ queryKey: ["registrations"], queryFn: getMyRegistrations, enabled: isOpen });
   const { data: airCrafts } = useQuery({ queryKey: ["airCrafts"], queryFn: getMyAirCrafts, enabled: isOpen });
   const { data: billTo } = useQuery({ queryKey: ["billTo"], queryFn: getMyBillTo, enabled: isOpen });
   const { data: invoiceTo } = useQuery({ queryKey: ["invoiceTo"], queryFn: GetInvoiceToList, enabled: isOpen });
   const { data: agentsList } = useQuery({ queryKey: ["agentsList"], queryFn: getMyAgent, enabled: isOpen, select: (data) => data?.filter(item => !!item?.agentName) });
   const { data: operatorsList } = useQuery({ queryKey: ["operatorsList"], queryFn: getMyOperators, enabled: isOpen, select: (data) => data?.filter(item => !!item?.operatorName) });
   const { data: payTypes } = useQuery({ queryKey: ["payTypes"], queryFn: GetPayTypes, enabled: isOpen });
   const { data: currencyList } = useQuery({ queryKey: ["currencyListSales"], queryFn: CurrencyListSales, enabled: isOpen });
   const { data: groundHandlerList } = useQuery({ queryKey: ["groundHandlerList"], queryFn: getMyGroundHandlerList, enabled: isOpen });
   const { selectedStation } = useStationStore();
   useEffect(() => {
      console.log("groundHandlerList", groundHandlerList);

   }, [groundHandlerList])
   useEffect(() => {
      console.log("cart", cart);

   }, [cart])

   const originalProfileSettings = useRef(null);

   // const updateProfileSettingsMutation = useMutation({
   //    mutationFn: UpdateCustomerProfileSettings,
   // });

   useEffect(() => {
      if (!isOpen) {
         originalProfileSettings.current = null;
         setShowGuestConfirmModal(false);
         setPendingGuestData(null);
      } else {
         if (!user) {
            const hasSubmitted = !!localStorage.getItem("GUEST_SUBMITTED_ORDER");
            setIsGuestSubmitted(hasSubmitted);
            
            const draft = restoreGuestDraft(stepsConfig.length);
            if (draft) {
               const computedType = cart?.length > 0
                  ? (cart.every((item) => item.orderDetailsIsArrival) && !cart.every((item) => item.orderDetailsIsDepartur) ? "Arrival"
                    : cart.every((item) => item.orderDetailsIsDepartur) && !cart.every((item) => item.orderDetailsIsArrival) ? "Departure"
                    : "Both")
                  : "Both";
                  
               const testValues = {
                   ...draft.values,
                   orderHeaderFlightType: computedType,
                   orderHeaderIsDepartur: computedType === "Departure" || computedType === "Both",
                   orderHeaderIsArrival: computedType === "Arrival" || computedType === "Both",
               };

               let targetStep = draft.step;
               let targetMax = draft.maxReachedStep;

               for (let i = 0; i <= draft.maxReachedStep; i++) {
                   try {
                       validationSchemas[i].validateSync(testValues);
                   } catch (err) {
                       targetStep = i;
                       targetMax = i;
                       break;
                   }
               }
               
               setStep(targetStep);
               setMaxReachedStep(targetMax);
            } else {
               setStep(0);
               setMaxReachedStep(0);
            }
         } else {
            setIsGuestSubmitted(false);
            clearGuestStorage();
            setStep(0);
            setMaxReachedStep(0);
         }
      }
   }, [isOpen, user, cart]);

   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }
      return () => { document.body.style.overflow = ""; };
   }, [isOpen]);

   useEffect(() => {
      if (isOpen && profileSettings && !originalProfileSettings.current) {
         originalProfileSettings.current = { ...profileSettings };
      }
   }, [isOpen, profileSettings]);

   if (!isOpen) return null;

   const currentValidationSchema = validationSchemas[step];

   const handleConfirmGuestSubmit = () => {
      if (!pendingGuestData) return;
      const { guestPayload, values, step: currentStep, maxReachedStep: currentMaxStep, actions } = pendingGuestData;
      setShowGuestConfirmModal(false);

      onlineOrderToast.loading(lang == "EN" ? "Sending Request..." : "...جاري إرسال الطلب", { id: "creatingOrder" });
      guestMutation.mutate(guestPayload, {
         onSuccess: () => {
            onlineOrderToast.success(lang == "EN" ? "Request sent successfully" : "تم إرسال الطلب بنجاح", { id: "creatingOrder" });
            localStorage.setItem("GUEST_SUBMITTED_ORDER", serializeGuestDraft(values, currentStep, currentMaxStep));
            sessionStorage.removeItem(GUEST_DRAFT_KEY);
            setIsGuestSubmitted(true);
            // clearCart();
            actions?.setSubmitting(false);
            setPendingGuestData(null);
            if (onClose) onClose();
         },
         onError: (error) => {
            const errorMsg = error?.response?.data?.message?.toLowerCase() || "";
            console.log("error", errorMsg);
            if (errorMsg === "email already registered") { onlineOrderToast.error(lang == "EN" ? "email is already registered" : "البريد الإلكتروني مسجل بالفعل", { id: "creatingOrder" }); }
            else if (errorMsg === "mobile number already registered.") { onlineOrderToast.error(lang == "EN" ? "mobile number is already registered" : "رقم الهاتف مسجل بالفعل", { id: "creatingOrder" }); }
            else if (errorMsg === "company website already registered.") { onlineOrderToast.error(lang == "EN" ? "company website is already registered" : "الموقع الإلكتروني مسجل بالفعل", { id: "creatingOrder" }); }
            else if (errorMsg.includes("you have already registered and placed an order with us")) { 
                onlineOrderToast.error(
                    lang == "EN" 
                        ? "You have already registered and placed an order with us. Please log in to your account to access your order details." 
                        : "لقد قمت بالتسجيل مسبقاً وطلب أوردر معنا. يرجى تسجيل الدخول إلى حسابك للوصول إلى تفاصيل طلبك.", 
                    { id: "creatingOrder", duration: 30000 }
                ); 
            }
            else { onlineOrderToast.error(lang == "EN" ? (error?.response?.data?.message || "Failed to send request") : "فشل إرسال الطلب", { id: "creatingOrder" }); }
            actions?.setSubmitting(false);
            setPendingGuestData(null);
         }
      });
   };

   const handleCancelGuestSubmit = () => {
      if (pendingGuestData?.actions) {
         pendingGuestData.actions.setSubmitting(false);
      }
      setShowGuestConfirmModal(false);
      setPendingGuestData(null);
   };

   const handleSubmit = (values, actions) => {
      const maxSteps = stepsConfig.length - 1;

      if (step < maxSteps) {
         setStep(step + 1);
         setMaxReachedStep(prev => Math.max(prev, step + 1));
         actions.setTouched({});
         actions.setSubmitting(false);
      } else {
         let evaluatedGroundHandlerId = 0;
         if (values.orderHeadearGroundHandlerId) {
            const matchedObj = groundHandlerList?.find(g => g.groundHandlerId === values.orderHeadearGroundHandlerId);
            if (
               matchedObj &&
               matchedObj.groundHandlerName === values.orderHeadearGroundHandlerName &&
               (matchedObj.groundHandlerEmail || "") === (values.orderHeadearGroundHandlerEmail || "") &&
               (matchedObj.groundHandlerPhone || "") === (values.orderHeadearGroundHandlerPhone || "")
            ) {
               evaluatedGroundHandlerId = matchedObj.groundHandlerId;
            }
         }

         const orderHeaderPayload = {
            orderHeaderId: 0,
            orderHeaderCutomerId: 0,
            orderHeaderBillToID: values.billTo || 0,
            orderHeaderBillToName: values.billToName || "",
            orderHeaderOperatorID: values.operator || 0,
            orderHeaderOperatorName: values.operatorName || "",
            orderHeaderAgentId: values.agent || 0,
            orderHeaderAgentName: values.agentName || "",

            orderHeaderFlightArrivalDatTime: values.arrivalDate ? values.arrivalDate.format('YYYY-MM-DDTHH:mm:ss') : null,
            orderHeaderArrivalDeliveryDate: values.arrivalDeliveryDate ? values.arrivalDeliveryDate.format('YYYY-MM-DDTHH:mm:ss') : null,
            orderHeaderDepatrialDateTime: values.departureDate ? values.departureDate.format('YYYY-MM-DDTHH:mm:ss') : null,
            orderHeaderDeliveryDateTime: values.departureDeliveryDate ? values.departureDeliveryDate.format('YYYY-MM-DDTHH:mm:ss') : null,

            orderHeaderPaxnum: values.orderHeaderFlightType !== "Arrival" ? values.orderHeaderPaxnum : 0,
            orderHeaderCrewNum: values.orderHeaderFlightType !== "Arrival" ? values.orderHeaderCrewNum : 0,
            orderHeaderArrivalPaxnum: values.orderHeaderFlightType !== "Departure" ? values.orderHeaderArrivalPaxnum : 0,
            orderHeaderArrivalCrewNum: values.orderHeaderFlightType !== "Departure" ? values.orderHeaderArrivalCrewNum : 0,
            orderHeaderType: values.orderHeaderFlightType,
            orderHeaderStationID: values.station,
            orderHeaderPriceListId: values.priceList,
            orderHeaderAcregId: values.registration || 0,
            orderHeaderAcregName: values.registrationName || "",
            orderHeaderInvoiceToId: values.invoiceTo,
            orderHeaderPaymentMethodId: values.paymentMethod,
            orderHeaderPaymentCurrencyId: values.paymentCurrency,
            orderHeaderActypeId: values.aircraftType || 0,
            orderHeaderActypeName: values.aircraftTypeName || "",
            orderHeaderFlightNumberId: values.flightNumber || 0,
            orderHeaderFlightNumberName: values.flightNumberName || "",
            orderHeaderOrderdByID: null,
            orderHeaderTransportationPercent: 0.05,
            orderHeaderHasTransportaion: true,
            orderHeaderAddPercent: 0,
            orderHeaderDiscountPercent: 0,
            orderHeaderHasAirportFees: false,
            orderHeaderBelongToId: null,
            orderHeaderHasRamTransportation: false,
            orderHeaderHasHightLoader: false,
            orderHeaderApplyMinmumFees: true,
            orderHeaderCurrencyId: 2,

            paymentInfoAccountBankName: profileSettings?.paymentInfoAccountBankName || "",
            paymentInfoAccountNumber: profileSettings?.paymentInfoAccountNumber || "",
            paymentInfoIBan: profileSettings?.paymentInfoIBan || "",
            paymentInfoSwiftCode: profileSettings?.paymentInfoSwiftCode || "",
            orderHeaderIsDepartur: values.orderHeaderFlightType === "Departure" || values.orderHeaderFlightType === "Both",
            orderHeaderIsArrival: values.orderHeaderFlightType === "Arrival" || values.orderHeaderFlightType === "Both",

            orderHeadearGroundHandlerPhone: values.orderHeadearGroundHandlerPhone || "",
            orderHeadearGroundHandlerEmail: values.orderHeadearGroundHandlerEmail || "",
            orderHeadearGroundHandlerName: values.orderHeadearGroundHandlerName || "",
            orderHeadearGroundHandlerId: evaluatedGroundHandlerId,
         };

         const handleSuccess = (response) => {
            onlineOrderToast.success(lang == "EN" ? "Order created successfully" : "تم إنشاء الطلب بنجاح", { id: "creatingOrder" });

            const newOrderData = response?.data?.[0]?.header || response?.[0]?.header;
            if (newOrderData) {
               setSelectedOrder(newOrderData);
            }

            queryClient.invalidateQueries({ queryKey: ["myOrders"] });


            onClose();
            actions.resetForm();
            setStep(0);
            actions.setSubmitting(false);
         };

         const handleError = () => {
            onlineOrderToast.error(lang == "EN" ? "Failed to create order" : "فشل إنشاء الطلب", { id: "creatingOrder" });
            actions.setSubmitting(false);
         };

         if (!user) {
            let normalizedWebsite = (values.companyLink || "").trim();
            if (normalizedWebsite && !/^https?:\/\//i.test(normalizedWebsite)) {
               normalizedWebsite = "https://" + normalizedWebsite;
            }
            const guestPayload = {
               mobil: values.mobil,
               password: "Sky@1234",
               email: values.email,
               contryID: values.contryID,
               companyName: values.companyName,
               companyPersonalName: values.companyPersonalName,
               subscribe: true,
               companyAddetionalInfo: "",
               companyWebSite: normalizedWebsite,
               quatationVM: orderHeaderPayload,
               _detailsQT: cart?.map((item) => ({
                  orderDetailsId: 0,
                  orderDetailsItemId: item.orderDetailsItemId || 0,
                  orderDetailsReplacingItemId: 0,
                  orderDetailsName: item.orderDetailsName || "",
                  orderDetailsPcking: "Standard Packing",
                  orderDetailsQty: item.orderDetailsQty || 1,
                  orderDetailsDescription: item.orderDetailsDescription || "",
                  orderDetailsUnitName: item.OrderDetailsUnitName || "",
                  orderDetailsPrintedQty: item.orderDetailsQty || 1,
                  orderDetailsIsArrival: Boolean(item.orderDetailsIsArrival),
                  orderDetailsIsDepartur: Boolean(item.orderDetailsIsDepartur),
                  orderDetailsFoodMenuItemFromPos: false,
                  orderHeaderClientMenuHeaderId: 0,
               })) || []
            };

            setPendingGuestData({ guestPayload, values, step, maxReachedStep, actions });
            setShowGuestConfirmModal(true);
            actions.setSubmitting(false);
         } else {
            onlineOrderToast.loading(lang == "EN" ? "Creating Order..." : "...جاري إنشاء الطلب", { id: "creatingOrder" });

            if (oldOrderId) {
               orderAgainMutation.mutate(
                  { oldOrderHeaderId: oldOrderId, newHeader: orderHeaderPayload },
                  {
                     onSuccess: (response) => {
                        handleSuccess(response);
                        const newOrderData = response?.data?.[0]?.header || response?.[0]?.header;
                        if (newOrderData?.orderHeaderId) {
                           navigate(`/order/${newOrderData.orderHeaderId}`);
                        }
                     },
                     onError: handleError
                  }
               );
            } else {
               createOrderByClientMutation.mutate(orderHeaderPayload, {
                  onSuccess: handleSuccess,
                  onError: handleError,
               });
            }
         }
      }
   };

   // Restore guest draft from sessionStorage (guest mode only)
   const restoredGuestDraft = !user ? restoreGuestDraft(stepsConfig.length) : null;

   const computedFlightType = cart?.length > 0
      ? (cart.every((item) => item.orderDetailsIsArrival) && !cart.every((item) => item.orderDetailsIsDepartur) ? "Arrival"
        : cart.every((item) => item.orderDetailsIsDepartur) && !cart.every((item) => item.orderDetailsIsArrival) ? "Departure"
        : "Both")
      : "Both";

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[75vh] max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center bg-primary text-white p-5">
               <h2 className="text-xl font-bold">
                  {langText.createNewOrder[lang]}
               </h2>
               <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
               >
                  <FaTimes size={20} />
               </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
               <Formik
                  enableReinitialize={true}
                  initialValues={{
                     station:
                        stations?.length > 0
                           ? stations?.find((s) => s.stationName === selectedStation?.stationName)
                              ?.stationId
                           : null,
                     priceList:
                        stations?.length > 0
                           ? stations?.find((s) => s.stationName === selectedStation?.stationName)
                              ?.stationDefualtPriceHeaderId
                           : null,
                     flightNumber: profileSettings?.flightId ?? null,
                     flightNumberName: profileSettings?.flightName ?? "",
                     registration: profileSettings?.registrationId ?? null,
                     registrationName: profileSettings?.registrationName ?? "",
                     aircraftType: profileSettings?.airCraftId ?? null,
                     aircraftTypeName: profileSettings?.airCraftTypeName ?? "",
                     agent: profileSettings?.agentId ?? null,
                     agentName: profileSettings?.agentName ?? "",
                     operator: profileSettings?.operatorId ?? null,
                     operatorName: profileSettings?.operatorName ?? "",
                     billTo: profileSettings?.billToId ?? null,
                     billToName: profileSettings?.billToName ?? "",
                     invoiceTo: null,
                     paymentMethod: profileSettings?.paymentMethodId ?? null,
                     paymentCurrency: currencyList?.find((c) => c.currencyName?.toUpperCase() === "USD")?.currencyId ?? null,
                     arrivalDate: null,
                     departureDate: null,
                     arrivalDeliveryDate: null,
                     departureDeliveryDate: null,
                     isStationHasVisa: false,
                     companyPersonalName: "",
                     companyName: "",
                     contryID: "",
                     mobil: "",
                     email: "",
                     companyLink: "",
                     orderHeaderPaxnum: "",
                     orderHeaderCrewNum: "",
                     orderHeaderArrivalPaxnum: "",
                     orderHeaderArrivalCrewNum: "",
                     paymentInfoAccountBankName: profileSettings?.paymentInfoAccountBankName || "",
                     paymentInfoAccountNumber: profileSettings?.paymentInfoAccountNumber || "",
                     paymentInfoIBan: profileSettings?.paymentInfoIBan || "",
                     paymentInfoSwiftCode: profileSettings?.paymentInfoSwiftCode || "",

                     orderHeadearGroundHandlerId: profileSettings?.groundHandlerId ?? 0,
                     orderHeadearGroundHandlerName: profileSettings?.groundHandlerName ?? "",
                     orderHeadearGroundHandlerEmail: profileSettings?.groundHandlerEmail ?? "",
                     orderHeadearGroundHandlerPhone: profileSettings?.groundHandlerPhone ?? "",
                     // Restore guest draft values (takes priority over defaults)
                     ...(restoredGuestDraft?.values ?? {}),
                     orderHeaderFlightType: computedFlightType,
                     orderHeaderIsDepartur: computedFlightType === "Departure" || computedFlightType === "Both",
                     orderHeaderIsArrival: computedFlightType === "Arrival" || computedFlightType === "Both",
                  }}
                  validationSchema={currentValidationSchema}
                  onSubmit={handleSubmit}
               >
                  {({
                     values,
                     errors,
                     touched,
                     setFieldValue,
                     setFieldTouched,
                     isSubmitting,
                     submitForm,
                     validateForm,
                     setTouched
                  }) => (
                     <>
                        <div className="flex justify-evenly bg-gray-50 border-b border-gray-100 p-4 shrink-0">
                           {stepsConfig?.map((s, idx) => {
                              const isCurrent = step === idx;
                              const isPast = idx < step;
                              const isNext = idx === step + 1;
                              const isReached = idx <= maxReachedStep;

                              return (
                                 <div
                                    key={s.id}
                                    onClick={() => {
                                       if (isCurrent) return;
                                       if (isPast) {
                                          setStep(idx);
                                       } else if (isReached || isNext) {
                                          validateForm().then(errors => {
                                             if (Object.keys(errors).length === 0) {
                                                setStep(idx);
                                                setMaxReachedStep(prev => Math.max(prev, idx));
                                             } else {
                                                setTouched(Object.keys(errors).reduce((acc, key) => { acc[key] = true; return acc; }, {}));
                                             }
                                          });
                                       }
                                    }}
                                    className={`text-center font-semibold text-sm transition-colors ${isCurrent
                                       ? "text-primary cursor-default"
                                       : isReached || isNext
                                          ? "text-gray-500 hover:text-primary cursor-pointer"
                                          : "text-gray-300 cursor-not-allowed"
                                       }`}
                                 >
                                    {idx + 1}. {s.label}
                                 </div>
                              );
                           })}
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                           <Form id={`guide-modal-step-${step}`} className="flex flex-col h-full relative p-1">
                              <FormObserver currencyList={currencyList} setFieldValue={setFieldValue} />
                              <GuestDraftSaver values={values} step={step} maxReachedStep={maxReachedStep} user={user} />

                              <div className={isGuestSubmitted ? "pointer-events-none opacity-80" : ""}>
                              {stepsConfig[step]?.id === 'guestInfo' && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          {lang === 'AR' ? 'الاسم الشخصي' : 'Personal Name'}
                                       </label>
                                       <TextField
                                          name="companyPersonalName"
                                          value={values.companyPersonalName}
                                          onChange={(e) => { setFieldValue("companyPersonalName", e.target.value); }}
                                          onBlur={() => setFieldTouched("companyPersonalName", true)}
                                          error={touched.companyPersonalName && Boolean(errors.companyPersonalName)}
                                          helperText={touched.companyPersonalName && errors.companyPersonalName}
                                          fullWidth
                                          size="small"
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", backgroundColor: "var(--color-bg-box)", height: "30px", fontSize: "12px" }, "& .MuiInputBase-input": { color: "var(--color-primary) !important", padding: "0 12px" } }}
                                       />
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          {lang === 'AR' ? 'اسم الشركة' : 'Company Name'}
                                       </label>
                                       <TextField
                                          name="companyName"
                                          value={values.companyName}
                                          onChange={(e) => { setFieldValue("companyName", e.target.value); }}
                                          onBlur={() => setFieldTouched("companyName", true)}
                                          error={touched.companyName && Boolean(errors.companyName)}
                                          helperText={touched.companyName && errors.companyName}
                                          fullWidth
                                          size="small"
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", backgroundColor: "var(--color-bg-box)", height: "30px", fontSize: "12px" }, "& .MuiInputBase-input": { color: "var(--color-primary) !important", padding: "0 12px" } }}
                                       />
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          {langText.email[lang]}
                                       </label>
                                       <TextField
                                          name="email"
                                          type="email"
                                          value={values.email}
                                          onChange={(e) => { setFieldValue("email", e.target.value); }}
                                          onBlur={() => setFieldTouched("email", true)}
                                          error={touched.email && Boolean(errors.email)}
                                          helperText={touched.email && errors.email}
                                          fullWidth
                                          size="small"
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", backgroundColor: "var(--color-bg-box)", height: "30px", fontSize: "12px" }, "& .MuiInputBase-input": { color: "var(--color-primary) !important", padding: "0 12px" } }}
                                       />
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          {langText.companyLink[lang]}
                                       </label>
                                       <TextField
                                          name="companyLink"
                                          value={values.companyLink}
                                          onChange={(e) => { setFieldValue("companyLink", e.target.value); }}
                                          onBlur={() => setFieldTouched("companyLink", true)}
                                          error={touched.companyLink && Boolean(errors.companyLink)}
                                          helperText={touched.companyLink && errors.companyLink}
                                          fullWidth
                                          size="small"
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", backgroundColor: "var(--color-bg-box)", height: "30px", fontSize: "12px" }, "& .MuiInputBase-input": { color: "var(--color-primary) !important", padding: "0 12px" } }}
                                       />
                                    </div>
                                    <div className="col-span-1 ">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          {lang === 'AR' ? 'البلد' : 'Country'}
                                       </label>
                                       <TextField
                                          select
                                          name="contryID"
                                          value={values.contryID}
                                          onChange={(e) => { setFieldValue("contryID", e.target.value); }}
                                          onBlur={() => setFieldTouched("contryID", true)}
                                          error={touched.contryID && Boolean(errors.contryID)}
                                          helperText={touched.contryID && errors.contryID}
                                          fullWidth
                                          size="small"
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", backgroundColor: "var(--color-bg-box)", height: "30px", fontSize: "12px" }, "& .MuiInputBase-input": { color: "var(--color-primary) !important", padding: "0 12px" } }}
                                       >
                                          {countries?.map((item) => (
                                             <MenuItem key={item.countryID} value={item.countryID} sx={{ fontSize: "12px" }}>
                                                {item.countryName + " (" + item.countryCode + ")"}
                                             </MenuItem>
                                          ))}
                                       </TextField>
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          {langText.phoneNumber[lang]}
                                       </label>
                                       <TextField
                                          name="mobil"
                                          value={values.mobil}
                                          onChange={(e) => { setFieldValue("mobil", e.target.value); }}
                                          onBlur={() => setFieldTouched("mobil", true)}
                                          error={touched.mobil && Boolean(errors.mobil)}
                                          helperText={touched.mobil && errors.mobil}
                                          fullWidth
                                          size="small"
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", backgroundColor: "var(--color-bg-box)", height: "30px", fontSize: "12px" }, "& .MuiInputBase-input": { color: "var(--color-primary) !important", padding: "0 12px" } }}
                                       />
                                    </div>
                                 </div>
                              )}

                              {stepsConfig[step]?.id === 'orderDetail' && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          Station * <HelpTooltip text={fieldDescriptions.station[lang]} />
                                       </label>
                                       <CustomLookup
                                          options={stations || []}
                                          value={values.station}
                                          compact={true}
                                          onChange={(val) => {
                                             setFieldValue("station", val);
                                             const found = stations?.find(
                                                (s) => s.stationId === val,
                                             );
                                             setFieldValue("isStationHasVisa", !!found?.hasVisaPayment);
                                             if (found?.stationDefualtPriceHeaderId) {
                                                setFieldValue(
                                                   "priceList",
                                                   found.stationDefualtPriceHeaderId,
                                                );
                                             }
                                             }}
                                          getOptionLabel={(opt) => opt.stationName}
                                          getOptionValue={(opt) => opt.stationId}
														 error={touched.station && Boolean(errors.station) && !values.station}
                                          onBlur={() => setFieldTouched("station", true)}
                                       />
													 {touched.station && errors.station && !values?.station && (
                                          <div className="text-red-500 text-xs mt-1">
                                             {errors.station}
                                          </div>
                                       )}
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          {lang === "AR" ? "نوع الرحلة *" : "Flight Type *"} <HelpTooltip text={fieldDescriptions.flightType[lang]} />
                                       </label>
                                       <div className="relative">
                                          <select
                                             disabled={!user}
                                             value={values.orderHeaderFlightType}
                                             onChange={(e) => {
                                                setFieldValue("orderHeaderFlightType", e.target.value)
                                                if (e.target.value === "Arrival") {
                                                   setFieldValue("orderHeaderIsDepartur", false)
                                                   setFieldValue("orderHeaderIsArrival", true)
                                                   setFieldValue("orderHeaderPaxnum", "")
                                                   setFieldValue("orderHeaderCrewNum", "")
                                                } else if (e.target.value === "Departure") {
                                                   setFieldValue("orderHeaderIsDepartur", true)
                                                   setFieldValue("orderHeaderIsArrival", false)
                                                   setFieldValue("orderHeaderArrivalPaxnum", "")
                                                   setFieldValue("orderHeaderArrivalCrewNum", "")
                                                } else if (e.target.value === "Both") {
                                                   setFieldValue("orderHeaderIsDepartur", true)
                                                   setFieldValue("orderHeaderIsArrival", true)
                                                }
                                                }}
                                             onBlur={() => setFieldTouched("orderHeaderFlightType", true)}
                                             className={`w-full h-[30px] px-3 border rounded-[50px] focus:outline-none focus:border-primary appearance-none text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] border-gray-300 font-medium ${!user ? "opacity-80 cursor-not-allowed" : ""}`}
                                          >
                                             <option value="Arrival">{lang === "AR" ? "وصول" : "Arrival"}</option>
                                             <option value="Departure">{lang === "AR" ? "مغادرة" : "Departure"}</option>
                                             <option value="Both">{lang === "AR" ? "كلاهما" : "Both"}</option>
                                          </select>
                                       </div>
                                       {touched.orderHeaderFlightType && errors.orderHeaderFlightType && (
                                          <div className="text-red-500 text-xs mt-1">
                                             {errors.orderHeaderFlightType}
                                          </div>
                                       )}
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                          Flight Number * <HelpTooltip text={fieldDescriptions.flightNumber[lang]} />
                                       </label>
                                       <FreeTextLookup
                                          options={flightNumbers || []}
                                          valueId={values.flightNumber}
                                          valueName={values.flightNumberName}
                                          onChange={(id, name) => {
                                             setFieldValue("flightNumber", id);
                                             setFieldValue("flightNumberName", name);
                                             }}
                                          getOptionLabel={(opt) => {
                                             const name = opt?.flightNumberName;
                                             return typeof name === "object" ? (name?.flightNumberName ?? "") : (name ?? "");
                                          }}
                                          getOptionValue={(opt) => opt?.flightNumberId}
                                          uppercase={true}
                                          error={
                                             touched.flightNumberName && Boolean(errors.flightNumberName)
                                          }
                                          onBlur={() => setFieldTouched("flightNumberName", true)}
                                       />
                                       {touched.flightNumberName && errors.flightNumberName && (
                                          <div className="text-red-500 text-xs mt-1">
                                             {errors.flightNumberName}
                                          </div>
                                       )}
                                    </div>
                                    {!(profileSettings?.customerDataNotAplicable || profileSettings?.CustomerDataNotAplicable) && (
                                       <div className="col-span-1">
                                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                             Registration * <HelpTooltip text={fieldDescriptions.registration[lang]} />
                                          </label>
                                          <FreeTextLookup
                                             options={registrations || []}
                                             valueId={values.registration}
                                             valueName={values.registrationName}
                                             onChange={(id, name) => {
                                                setFieldValue("registration", id);
                                                setFieldValue("registrationName", name.replace(/[\u0600-\u06FF]/g, ""));
                                                }}
                                             getOptionLabel={(opt) => opt.registrationName}
                                             getOptionValue={(opt) => opt.registrationId}
                                             uppercase={true}
                                             error={
                                                touched.registrationName && Boolean(errors.registrationName)
                                             }
                                             onBlur={() => setFieldTouched("registrationName", true)}
                                          />
                                          {touched.registrationName && errors.registrationName && (
                                             <div className="text-red-500 text-xs mt-1">
                                                {errors.registrationName}
                                             </div>
                                          )}
                                       </div>
                                    )}
                                    {values.orderHeaderFlightType !== "Departure" && (
                                       <>
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">{lang === "AR" ? "عدد ركاب الوصول *" : "Number of Arrival Passengers *"} <HelpTooltip text={fieldDescriptions.arrivalPassengers[lang]} /></label>
                                             <TextField
                                                type="number"
                                                value={values.orderHeaderArrivalPaxnum}
                                                onChange={(e) => { setFieldValue("orderHeaderArrivalPaxnum", e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value))); }}
                                                onBlur={() => setFieldTouched("orderHeaderArrivalPaxnum", true)}
                                                size="small"
                                                fullWidth
                                                error={touched.orderHeaderArrivalPaxnum && Boolean(errors.orderHeaderArrivalPaxnum)}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", fontSize: "12px" } }}
                                             />
                                             {touched.orderHeaderArrivalPaxnum && errors.orderHeaderArrivalPaxnum && (
                                                <div className="text-red-500 text-xs mt-1">
                                                   {errors.orderHeaderArrivalPaxnum}
                                                </div>
                                             )}
                                          </div>

                                       </>
                                    )}
                                    {values.orderHeaderFlightType !== "Arrival" && (
                                       <>
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">{lang === "AR" ? "عدد ركاب المغادرة *" : "Number of Departure Passengers *"} <HelpTooltip text={fieldDescriptions.departurePassengers[lang]} /></label>
                                             <TextField
                                                type="number"
                                                value={values.orderHeaderPaxnum}
                                                onChange={(e) => { setFieldValue("orderHeaderPaxnum", e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value))); }}
                                                onBlur={() => setFieldTouched("orderHeaderPaxnum", true)}
                                                size="small"
                                                fullWidth
                                                error={touched.orderHeaderPaxnum && Boolean(errors.orderHeaderPaxnum)}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", fontSize: "12px" } }}
                                             />
                                             {touched.orderHeaderPaxnum && errors.orderHeaderPaxnum && (
                                                <div className="text-red-500 text-xs mt-1">
                                                   {errors.orderHeaderPaxnum}
                                                </div>
                                             )}
                                          </div>
                                       </>
                                    )}
                                    {values.orderHeaderFlightType !== "Departure" && (
                                       <>
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">{lang === "AR" ? "عدد أفراد طاقم الوصول *" : "Number of Arrival Crew *"} <HelpTooltip text={fieldDescriptions.arrivalCrew[lang]} /></label>
                                             <TextField
                                                type="number"
                                                value={values.orderHeaderArrivalCrewNum}
                                                onChange={(e) => { setFieldValue("orderHeaderArrivalCrewNum", e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value))); }}
                                                onBlur={() => setFieldTouched("orderHeaderArrivalCrewNum", true)}
                                                size="small"
                                                fullWidth
                                                error={touched.orderHeaderArrivalCrewNum && Boolean(errors.orderHeaderArrivalCrewNum)}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", fontSize: "12px" } }}
                                             />
                                             {touched.orderHeaderArrivalCrewNum && errors.orderHeaderArrivalCrewNum && (
                                                <div className="text-red-500 text-xs mt-1">
                                                   {errors.orderHeaderArrivalCrewNum}
                                                </div>
                                             )}
                                          </div>
                                       </>
                                    )}
                                    {values.orderHeaderFlightType !== "Arrival" && (
                                       <>
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">{lang === "AR" ? "عدد أفراد طاقم المغادرة *" : "Number of Departure Crew *"} <HelpTooltip text={fieldDescriptions.departureCrew[lang]} /></label>
                                             <TextField
                                                type="number"
                                                value={values.orderHeaderCrewNum}
                                                onChange={(e) => { setFieldValue("orderHeaderCrewNum", e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value))); }}
                                                onBlur={() => setFieldTouched("orderHeaderCrewNum", true)}
                                                size="small"
                                                fullWidth
                                                error={touched.orderHeaderCrewNum && Boolean(errors.orderHeaderCrewNum)}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", fontSize: "12px" } }}
                                             />
                                             {touched.orderHeaderCrewNum && errors.orderHeaderCrewNum && (
                                                <div className="text-red-500 text-xs mt-1">
                                                   {errors.orderHeaderCrewNum}
                                                </div>
                                             )}
                                          </div>
                                       </>
                                    )}
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Aircraft Type * <HelpTooltip text={fieldDescriptions.aircraftType[lang]} /></label>
                                       <FreeTextLookup
                                          options={airCrafts || []}
                                          valueId={values.aircraftType}
                                          valueName={values.aircraftTypeName}
                                          onChange={(id, name) => {
                                             setFieldValue("aircraftType", id);
                                             setFieldValue("aircraftTypeName", name.replace(/[\u0600-\u06FF]/g, ""));
                                             }}
                                          getOptionLabel={(opt) => opt.airCraftName}
                                          getOptionValue={(opt) => opt.airCraftId}
                                          uppercase={true}
                                          error={touched.aircraftTypeName && Boolean(errors.aircraftTypeName)}
                                          onBlur={() => setFieldTouched("aircraftTypeName", true)}
                                       />
                                       {touched.aircraftTypeName && errors.aircraftTypeName && (
                                          <div className="text-red-500 text-xs mt-1">
                                             {errors.aircraftTypeName}
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              )}

                              {stepsConfig[step]?.id === 'clientAndPayment' && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {(profileSettings?.agentIsVisible || !user) && (
                                       <div className="col-span-1">
                                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Agent {profileSettings?.agentIsRequired ? "*" : ""} <HelpTooltip text={fieldDescriptions.agent?.[lang] || "Agent"} /></label>
                                          <FreeTextLookup
                                             options={agentsList || []}
                                             valueId={values.agent}
                                             valueName={values.agentName}
                                             onChange={(id, name) => {
                                                setFieldValue("agent", id);
                                                setFieldValue("agentName", name.replace(/[\u0600-\u06FF]/g, ""));
                                                }}
                                             getOptionLabel={(opt) => opt.agentName}
                                             getOptionValue={(opt) => opt.agentId}
                                             error={touched.agentName && Boolean(errors.agentName)}
                                             onBlur={() => setFieldTouched("agentName", true)}
                                          />
                                          {touched.agentName && errors.agentName && (
                                             <div className="text-red-500 text-xs mt-1">
                                                {errors.agentName}
                                             </div>
                                          )}
                                       </div>
                                    )}
                                    {(profileSettings?.operatorIsVisible || !user) && (
                                       <div className="col-span-1">
                                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Operator {profileSettings?.operatorIsRequired ? "*" : ""} <HelpTooltip text={fieldDescriptions.operator?.[lang] || "Operator"} /></label>
                                          <FreeTextLookup
                                             options={operatorsList || []}
                                             valueId={values.operator}
                                             valueName={values.operatorName}
                                             onChange={(id, name) => {
                                                setFieldValue("operator", id);
                                                setFieldValue("operatorName", name.replace(/[\u0600-\u06FF]/g, ""));
                                                }}
                                             getOptionLabel={(opt) => opt.operatorName}
                                             getOptionValue={(opt) => opt.operatorId}
                                             error={touched.operatorName && Boolean(errors.operatorName)}
                                             onBlur={() => setFieldTouched("operatorName", true)}
                                          />
                                          {touched.operatorName && errors.operatorName && (
                                             <div className="text-red-500 text-xs mt-1">
                                                {errors.operatorName}
                                             </div>
                                          )}
                                       </div>
                                    )}
                                    {/* )} */}
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Bill To * <HelpTooltip text={fieldDescriptions.billTo[lang]} /></label>
                                       <FreeTextLookup
                                          options={billTo || []}
                                          valueId={values.billTo}
                                          valueName={values.billToName}
                                          onChange={(id, name) => {
                                             setFieldValue("billTo", id);
                                             setFieldValue("billToName", name.replace(/[\u0600-\u06FF]/g, ""));
                                             }}
                                          getOptionLabel={(opt) => opt.billToName}
                                          getOptionValue={(opt) => opt.billToId}
                                          error={touched.billToName && Boolean(errors.billToName)}
                                          onBlur={() => setFieldTouched("billToName", true)}
                                       />
                                       {touched.billToName && errors.billToName && <div className="text-red-500 text-xs mt-1">{errors.billToName}</div>}
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Invoice To * <HelpTooltip text={fieldDescriptions.invoiceTo[lang]} /></label>
                                       <div className="relative">
                                          <select
                                             value={values.invoiceTo ?? ""}
                                             onChange={(e) => { setFieldValue("invoiceTo", e.target.value ? Number(e.target.value) : null); }}
                                             onBlur={() => setFieldTouched("invoiceTo", true)}
                                             className={`w-full h-[30px] px-3 border rounded-[50px] focus:outline-none focus:border-primary appearance-none text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${touched.invoiceTo && errors.invoiceTo ? "border-red-400" : "border-gray-300"}`}
                                          >
                                             <option value="" disabled hidden />
                                             {(invoiceTo || []).map((opt) => (
                                                <option key={opt.invoicingToId} value={opt.invoicingToId}>
                                                   {opt.invoicingToName}
                                                </option>
                                             ))}
                                          </select>
                                       </div>
                                       {touched.invoiceTo && errors.invoiceTo && <div className="text-red-500 text-xs mt-1">{errors.invoiceTo}</div>}
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Payment Method * <HelpTooltip text={fieldDescriptions.paymentMethod[lang]} /></label>
                                       <div className="relative">
                                          <select
                                             value={values.paymentMethod ?? ""}
                                             onChange={(e) => { setFieldValue("paymentMethod", e.target.value ? Number(e.target.value) : null); }}
                                             onBlur={() => setFieldTouched("paymentMethod", true)}
                                             className={`w-full h-[30px] px-3 border rounded-[50px] focus:outline-none focus:border-primary appearance-none text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${touched.paymentMethod && errors.paymentMethod ? "border-red-400" : "border-gray-300"}`}
                                          >
                                             <option value="" disabled hidden />
                                             {(!values?.isStationHasVisa
                                                ? payTypes?.filter((p) => p?.cashTransactionTypeId != 4)
                                                : payTypes || []
                                             )?.map((p) => (
                                                <option key={p.cashTransactionTypeId} value={p.cashTransactionTypeId}>
                                                   {p.cashTransactionTypeName}
                                                </option>
                                             ))}
                                          </select>
                                       </div>
                                       {touched.paymentMethod && errors.paymentMethod && <div className="text-red-500 text-xs mt-1">{errors.paymentMethod}</div>}
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Currency * <HelpTooltip text={fieldDescriptions.currency[lang]} /></label>
                                       <div className="relative">
                                          <select
                                             value={values.paymentCurrency ?? ""}
                                             onChange={(e) => { setFieldValue("paymentCurrency", e.target.value ? Number(e.target.value) : null); }}
                                             onBlur={() => setFieldTouched("paymentCurrency", true)}
                                             className={`w-full h-[30px] px-3 border rounded-[50px] focus:outline-none focus:border-primary appearance-none text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${touched.paymentCurrency && errors.paymentCurrency ? "border-red-400" : "border-gray-300"}`}
                                          >
                                             <option value="" disabled hidden />
                                             {currencyList?.filter((c) => c.currencyName?.toUpperCase() === "USD")?.map((c) => (
                                                <option key={c.currencyId} value={c.currencyId}>{c.currencyName}</option>
                                             ))}
                                          </select>
                                       </div>
                                       {touched.paymentCurrency && errors.paymentCurrency && <div className="text-red-500 text-xs mt-1">{errors.paymentCurrency}</div>}
                                    </div>

                                    {/* Ground Handler (merged into Client & Payment step) */}
                                    {isGroundHandlerVisible && (
                                       <>
                                          <div className="col-span-2 mt-2 border-t border-gray-100 pt-3">
                                             <h4 className="text-sm font-bold text-gray-700">
                                                {lang === "EN" ? "Ground Handler" : "مزود الخدمة الأرضية"}
                                             </h4>
                                          </div>
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                {lang === "EN" ? "Ground Handler Name" : "اسم مزود الخدمة الأرضية"} {profileSettings?.groundHandlerIsRequired !== false ? "*" : ""} <HelpTooltip text={fieldDescriptions.groundHandlerName[lang]} />
                                             </label>
                                             <FreeTextLookup
                                                options={groundHandlerList || []}
                                                valueId={values.orderHeadearGroundHandlerId}
                                                valueName={values.orderHeadearGroundHandlerName}
                                                onChange={(id, name) => {
                                                   setFieldValue("orderHeadearGroundHandlerId", id);
                                                   setFieldValue("orderHeadearGroundHandlerName", name.replace(/[\u0600-\u06FF]/g, ""));
                                                   const matched = groundHandlerList?.find(g => g.groundHandlerId === id);
                                                   if (matched) {
                                                      setFieldValue("orderHeadearGroundHandlerEmail", matched.groundHandlerEmail || "");
                                                      setFieldValue("orderHeadearGroundHandlerPhone", matched.groundHandlerPhone || "");
                                                   }
                                                   }}
                                                getOptionLabel={(opt) => opt.groundHandlerName}
                                                getOptionValue={(opt) => opt.groundHandlerId}
                                                error={touched.orderHeadearGroundHandlerName && Boolean(errors.orderHeadearGroundHandlerName)}
                                                onBlur={() => setFieldTouched("orderHeadearGroundHandlerName", true)}
                                             />
                                             {touched.orderHeadearGroundHandlerName && errors.orderHeadearGroundHandlerName && (
                                                <div className="text-red-500 text-xs mt-1">{errors.orderHeadearGroundHandlerName}</div>
                                             )}
                                          </div>
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                {lang === "EN" ? "Ground Handler Email" : "البريد الإلكتروني لمزود الخدمة"} <HelpTooltip text={fieldDescriptions.groundHandlerEmail[lang]} />
                                             </label>
                                             <input
                                                type="email"
                                                className={`w-full h-[30px] px-3 border rounded-[50px] focus:outline-none focus:border-primary text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${errors.orderHeadearGroundHandlerEmail && touched.orderHeadearGroundHandlerEmail ? "border-red-500" : "border-gray-300"}`}
                                                value={values.orderHeadearGroundHandlerEmail || ""}
                                                onChange={(e) => setFieldValue("orderHeadearGroundHandlerEmail", e.target.value.replace(/[\u0600-\u06FF]/g, ""))}
                                                onBlur={() => setFieldTouched("orderHeadearGroundHandlerEmail", true)}
                                             />
                                             {touched.orderHeadearGroundHandlerEmail && errors.orderHeadearGroundHandlerEmail && (
                                                <div className="text-red-500 text-xs mt-1">{errors.orderHeadearGroundHandlerEmail}</div>
                                             )}
                                          </div>
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                {lang === "EN" ? "Ground Handler Phone" : "هاتف مزود الخدمة الأرضية"} <HelpTooltip text={fieldDescriptions.groundHandlerPhone[lang]} />
                                             </label>
                                             <input
                                                type="text"
                                                className={`w-full h-[30px] px-3 border rounded-[50px] focus:outline-none focus:border-primary text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${errors.orderHeadearGroundHandlerPhone && touched.orderHeadearGroundHandlerPhone ? "border-red-500" : "border-gray-300"}`}
                                                value={values.orderHeadearGroundHandlerPhone || ""}
                                                onChange={(e) => setFieldValue("orderHeadearGroundHandlerPhone", e.target.value.replace(/[\u0600-\u06FF]/g, ""))}
                                                onBlur={() => setFieldTouched("orderHeadearGroundHandlerPhone", true)}
                                             />
                                             {touched.orderHeadearGroundHandlerPhone && errors.orderHeadearGroundHandlerPhone && (
                                                <div className="text-red-500 text-xs mt-1">{errors.orderHeadearGroundHandlerPhone}</div>
                                             )}
                                          </div>
                                       </>
                                    )}
                                 </div>
                              )}

                               {/* STEP 4: Main Dates & Delivery Dates */}
                               {stepsConfig[step]?.id === 'dateTime' && (
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div className="col-span-1">
                                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                             {lang === "EN" ? "Arrival Date (UTC)" : "تاريخ الوصول (UTC)"} <HelpTooltip text={fieldDescriptions.arrivalDate[lang]} />
                                          </label>
                                          <div className="[&_.MuiOutlinedInput-root]:!rounded-[50px] [&_fieldset]:!rounded-[50px] [&_.MuiOutlinedInput-root]:!min-h-[30px] [&_.MuiOutlinedInput-root]:!h-[30px] [&_.MuiOutlinedInput-root]:!text-[12px]">
                                             <DatePicker
                                                format="DD/MM/YYYY"
                                                value={values.arrivalDate}
                                                onChange={(newDate) => {
                                                   const updated = createDateWithTime(values.arrivalDate, newDate);
                                                   setFieldValue("arrivalDate", updated);
                                                }}
                                                onClose={() => setFieldTouched("arrivalDate", true)}
                                                slotProps={{
                                                   textField: {
                                                      size: "small",
                                                      fullWidth: true,
                                                      error: touched.arrivalDate && Boolean(errors.arrivalDate),
                                                      sx: {
                                                         backgroundColor: "white",
                                                         "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", fontSize: "12px", "& fieldset": { borderRadius: "50px" } },
                                                         "& .MuiPickersOutlinedInput-root": { height: "30px" },
                                                      },
                                                   },
                                                }}
                                             />
                                          </div>
                                          {errors.arrivalDate && touched.arrivalDate && typeof errors.arrivalDate === "string" && (
                                             <div className="text-red-500 text-xs mt-1">{errors.arrivalDate}</div>
                                          )}
                                       </div>

                                       {/* Arrival Time */}
                                       <div className="col-span-1">
                                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                             {lang === "EN" ? "Arrival Time (UTC)" : "وقت الوصول (UTC)"}
                                          </label>
                                          <div className="[&_.MuiOutlinedInput-root]:!rounded-[50px] [&_fieldset]:!rounded-[50px] [&_.MuiOutlinedInput-root]:!min-h-[30px] [&_.MuiOutlinedInput-root]:!h-[30px] [&_.MuiOutlinedInput-root]:!text-[12px]">
                                             <TimePicker
                                                ampm={false}
                                                format="HH:mm"
                                                value={values.arrivalDate}
                                                onChange={(newTime) => {
                                                   const updated = createTimeWithDate(values.arrivalDate, newTime);
                                                   setFieldValue("arrivalDate", updated);
                                                }}
                                                onClose={() => setFieldTouched("arrivalDate", true)}
                                                slotProps={{
                                                   textField: {
                                                      size: "small",
                                                      fullWidth: true,
                                                      error: touched.arrivalDate && Boolean(errors.arrivalDate),
                                                      sx: {

                                                         backgroundColor: "white",
                                                         "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", fontSize: "12px", "& fieldset": { borderRadius: "50px" } },
                                                         "& .MuiPickersOutlinedInput-root": { height: "30px" },

                                                      },
                                                   },
                                                }}
                                             />
                                          </div>
                                       </div>

                                       {/* Arrival Delivery Date */}
                                       {values.orderHeaderFlightType !== "Departure" && (
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                {lang === "EN" ? "Arrival Delivery Date" : "تاريخ تسليم الوصول"} <HelpTooltip text={fieldDescriptions.arrivalDelivery[lang]} />
                                             </label>
                                             <div className="[&_.MuiOutlinedInput-root]:!rounded-[50px] [&_fieldset]:!rounded-[50px] [&_.MuiOutlinedInput-root]:!min-h-[30px] [&_.MuiOutlinedInput-root]:!h-[30px] [&_.MuiOutlinedInput-root]:!text-[12px]">
                                                <DatePicker
                                                   disabled={!values.arrivalDate}
                                                   format="DD/MM/YYYY"
                                                   value={values.arrivalDeliveryDate}
                                                   onChange={(newDate) => {
                                                      const updated = createDateWithTime(values.arrivalDeliveryDate, newDate);
                                                      setFieldValue("arrivalDeliveryDate", updated);
                                                   }}
                                                   onClose={() => setFieldTouched("arrivalDeliveryDate", true)}
                                                   slotProps={{
                                                      textField: {
                                                         size: "small",
                                                         fullWidth: true,
                                                         error: touched.arrivalDeliveryDate && Boolean(errors.arrivalDeliveryDate),
                                                         sx: {
                                                            // backgroundColor: !values.arrivalDate ? "#f3f4f6" : "white",

                                                            "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", minHeight: "30px", maxHeight: "30px", fontSize: "12px", "& fieldset": { borderRadius: "50px" } },
                                                            "& .MuiPickersOutlinedInput-root": { height: "30px" },

                                                         },
                                                      },
                                                   }}
                                                />
                                             </div>
                                             {errors.arrivalDeliveryDate && touched.arrivalDeliveryDate && typeof errors.arrivalDeliveryDate === "string" && (
                                                <div className="text-red-500 text-xs mt-1">{errors.arrivalDeliveryDate}</div>
                                             )}
                                          </div>
                                       )}

                                       {/* Arrival Delivery Time */}
                                       {values.orderHeaderFlightType !== "Departure" && (
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                {lang === "EN" ? "Arrival Delivery Time" : "وقت تسليم الوصول"}
                                             </label>
                                             <div className="[&_.MuiOutlinedInput-root]:!rounded-[50px] [&_fieldset]:!rounded-[50px] [&_.MuiOutlinedInput-root]:!min-h-[30px] [&_.MuiOutlinedInput-root]:!h-[30px] [&_.MuiOutlinedInput-root]:!text-[12px]">
                                                <TimePicker
                                                   disabled={!values.arrivalDate}
                                                   ampm={false}
                                                   format="HH:mm"
                                                   value={values.arrivalDeliveryDate}
                                                   onChange={(newTime) => {
                                                      const updated = createTimeWithDate(values.arrivalDeliveryDate, newTime);
                                                      setFieldValue("arrivalDeliveryDate", updated);
                                                   }}
                                                   onClose={() => setFieldTouched("arrivalDeliveryDate", true)}
                                                   slotProps={{
                                                      textField: {
                                                         size: "small",
                                                         fullWidth: true,
                                                         error: touched.arrivalDeliveryDate && Boolean(errors.arrivalDeliveryDate),
                                                         sx: {
                                                            // backgroundColor: !values.arrivalDate ? "#f3f4f6" : "white",

                                                            "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", minHeight: "30px", maxHeight: "30px", fontSize: "12px", "& fieldset": { borderRadius: "50px" } },
                                                            "& .MuiPickersOutlinedInput-root": { height: "30px" },

                                                         },
                                                      },
                                                   }}
                                                />
                                             </div>
                                          </div>
                                       )}
                                       {/* Departure Delivery Date */}
                                       {values.orderHeaderFlightType !== "Arrival" && (
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                {lang === "EN" ? "Departure Delivery Date" : "تاريخ تسليم المغادرة"} <HelpTooltip text={fieldDescriptions.departureDelivery[lang]} />
                                             </label>
                                             <div className="[&_.MuiOutlinedInput-root]:!rounded-[50px] [&_fieldset]:!rounded-[50px] [&_.MuiOutlinedInput-root]:!min-h-[30px] [&_.MuiOutlinedInput-root]:!h-[30px] [&_.MuiOutlinedInput-root]:!text-[12px]">
                                                <DatePicker
                                                   disabled={!values.departureDate}
                                                   format="DD/MM/YYYY"
                                                   value={values.departureDeliveryDate}
                                                   onChange={(newDate) => {
                                                      const updated = createDateWithTime(values.departureDeliveryDate, newDate);
                                                      setFieldValue("departureDeliveryDate", updated);
                                                   }}
                                                   onClose={() => setFieldTouched("departureDeliveryDate", true)}
                                                   slotProps={{
                                                      textField: {
                                                         size: "small",
                                                         fullWidth: true,
                                                         error: touched.departureDeliveryDate && Boolean(errors.departureDeliveryDate),
                                                         sx: {
                                                            // backgroundColor: !values.arrivalDate ? "#f3f4f6" : "white",

                                                            "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", minHeight: "30px", maxHeight: "30px", fontSize: "12px", "& fieldset": { borderRadius: "50px" } },
                                                            "& .MuiPickersOutlinedInput-root": { height: "30px" },
                                                         },
                                                      },
                                                   }}
                                                />
                                             </div>
                                             {errors.departureDeliveryDate && touched.departureDeliveryDate && typeof errors.departureDeliveryDate === "string" && (
                                                <div className="text-red-500 text-xs mt-1">{errors.departureDeliveryDate}</div>
                                             )}
                                          </div>
                                       )}

                                       {/* Departure Delivery Time */}
                                       {values.orderHeaderFlightType !== "Arrival" && (
                                          <div className="col-span-1">
                                             <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                {lang === "EN" ? "Departure Delivery Time" : "وقت تسليم المغادرة"}
                                             </label>
                                             <div className="[&_.MuiOutlinedInput-root]:!rounded-[50px] [&_fieldset]:!rounded-[50px] [&_.MuiOutlinedInput-root]:!min-h-[30px] [&_.MuiOutlinedInput-root]:!h-[30px] [&_.MuiOutlinedInput-root]:!text-[12px]">
                                                <TimePicker
                                                   disabled={!values.departureDate}
                                                   ampm={false}
                                                   format="HH:mm"
                                                   value={values.departureDeliveryDate}
                                                   onChange={(newTime) => {
                                                      const updated = createTimeWithDate(values.departureDeliveryDate, newTime);
                                                      setFieldValue("departureDeliveryDate", updated);
                                                   }}
                                                   onClose={() => setFieldTouched("departureDeliveryDate", true)}
                                                   slotProps={{
                                                      textField: {
                                                         size: "small",
                                                         fullWidth: true,
                                                         error: touched.departureDeliveryDate && Boolean(errors.departureDeliveryDate),
                                                         sx: {
                                                            // backgroundColor: !values.arrivalDate ? "#f3f4f6" : "white",

                                                            "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", minHeight: "30px", maxHeight: "30px", fontSize: "12px", "& fieldset": { borderRadius: "50px" } },
                                                            "& .MuiPickersOutlinedInput-root": { height: "30px" },
                                                         },
                                                      },
                                                   }}
                                                />
                                             </div>
                                          </div>
                                       )}

                                       {/* Departure Date */}
                                       <div className="col-span-1">
                                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                             {lang === "EN" ? "Departure Date (UTC)" : "تاريخ المغادرة (UTC)"} <HelpTooltip text={fieldDescriptions.departureDate[lang]} />
                                          </label>
                                          <div className="[&_.MuiOutlinedInput-root]:!rounded-[50px] [&_fieldset]:!rounded-[50px] [&_.MuiOutlinedInput-root]:!min-h-[30px] [&_.MuiOutlinedInput-root]:!h-[30px] [&_.MuiOutlinedInput-root]:!text-[12px]">
                                             <DatePicker
                                                format="DD/MM/YYYY"
                                                disablePast={false}
                                                value={values.departureDate}
                                                onChange={(newDate) => {
                                                   const updated = createDateWithTime(values.departureDate, newDate);
                                                   setFieldValue("departureDate", updated);
                                                }}
                                                onClose={() => setFieldTouched("departureDate", true)}
                                                slotProps={{
                                                   textField: {
                                                      size: "small",
                                                      fullWidth: true,
                                                      error: touched.departureDate && Boolean(errors.departureDate),
                                                      sx: {
                                                         backgroundColor: "white",
                                                         "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", fontSize: "12px", "& fieldset": { borderRadius: "50px" } },
                                                         "& .MuiPickersOutlinedInput-root": { height: "30px" },

                                                      },
                                                   },
                                                }}
                                             />
                                          </div>
                                          {errors.departureDate && touched.departureDate && typeof errors.departureDate === "string" && (
                                             <div className="text-red-500 text-xs mt-1">{errors.departureDate}</div>
                                          )}
                                       </div>

                                       {/* Departure Time */}
                                       <div className="col-span-1">
                                          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                             {lang === "EN" ? "Departure Time (UTC)" : "وقت المغادرة (UTC)"}
                                          </label>
                                          <div className="[&_.MuiOutlinedInput-root]:!rounded-[50px] [&_fieldset]:!rounded-[50px] [&_.MuiOutlinedInput-root]:!min-h-[30px] [&_.MuiOutlinedInput-root]:!h-[30px] [&_.MuiOutlinedInput-root]:!text-[12px]">
                                             <TimePicker
                                                ampm={false}
                                                format="HH:mm"
                                                value={values.departureDate}
                                                onChange={(newTime) => {
                                                   const updated = createTimeWithDate(values.departureDate, newTime);
                                                   setFieldValue("departureDate", updated);
                                                }}
                                                onClose={() => setFieldTouched("departureDate", true)}
                                                slotProps={{
                                                   textField: {
                                                      size: "small",
                                                      fullWidth: true,
                                                      error: touched.departureDate && Boolean(errors.departureDate),
                                                      sx: {

                                                         backgroundColor: "white",
                                                         "& .MuiOutlinedInput-root": { borderRadius: "50px", height: "30px", fontSize: "12px", "& fieldset": { borderRadius: "50px" } },
                                                         "& .MuiPickersOutlinedInput-root": { height: "30px" },

                                                      },
                                                   },
                                                }}
                                             />
                                          </div>
                                        </div>



                                    </div>
                                 </LocalizationProvider>
                              )}

                              </div>

                              {/* Navigation Footer (Extremely important for form flow) */}
                              <div className="mt-auto pt-5 mt-6 border-t border-gray-100 flex items-center justify-between">
                                 <button
                                    type="button"
                                    onClick={() => setStep(Math.max(0, step - 1))}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${step === 0
                                       ? "opacity-0 pointer-events-none"
                                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                       }`}
                                 >
                                    <FaArrowLeft size={14} /> {langText.back?.[lang] || "Back"}
                                 </button>

                                 <button
                                    type="button"
                                    onClick={(e) => {
                                       if (isGuestSubmitted && step === stepsConfig.length - 1) {
                                          e.preventDefault();
                                          onlineOrderToast.error(lang === "AR" ? "لقد تم إرسال الطلب إلى المبيعات، يرجى الانتظار حتى يتم التواصل معك" : "The order has been sent to our sales. Please wait until they reach you.", { duration: 5000 });
                                       } else {
                                          submitForm();
                                       }
                                    }}
                                    disabled={isSubmitting}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-md ${isGuestSubmitted && step === stepsConfig.length - 1
                                       ? "bg-gray-400 text-white cursor-pointer hover:bg-gray-500" 
                                       : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"}`}
                                 >
                                    {isGuestSubmitted && step === stepsConfig.length - 1 ? (
                                       <>
                                          <FaCheck size={14} />{" "}
                                          {lang === "AR" ? "تم إرسال الطلب" : "Order Sent"}
                                       </>
                                    ) : step === stepsConfig.length - 1 ? (
                                       <>
                                          <FaCheck size={14} />{" "}
                                          {langText.submit?.[lang] || "Submit Order"}
                                       </>
                                    ) : (
                                       <>
                                          {langText.next?.[lang] || "Next"}{" "}
                                          <FaArrowRight size={14} className={`${lang == "AR" ? 'rotate-180' : ''}`} />
                                       </>
                                    )}
                                 </button>
                              </div>
                           </Form>
                        </div>
                     </>
                  )}
               </Formik>
            </div>
         </div>

         {/* Guest Confirmation Popup */}
         {showGuestConfirmModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
               <div 
                  dir={lang === "AR" ? "rtl" : "ltr"}
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center border border-gray-100"
               >
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                     <FaQuestionCircle size={28} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                     {lang === "AR" ? "تأكيد إرسال الطلب" : "Confirm Order Submission"}
                  </h3>

                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                     {lang === "AR" 
                        ? "هل أنت متأكد من إرسال الطلب الآن، أم ترغب في مراجعة البيانات التي أدخلتها أولاً؟" 
                        : "Are you sure you want to submit the order now, or would you like to review what you entered before submitting?"}
                  </p>

                  <div className="flex items-center justify-center gap-3">
                     <button
                        type="button"
                        onClick={handleCancelGuestSubmit}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                     >
                        <FaArrowLeft size={13} className={lang === "AR" ? "rotate-180" : ""} />
                        {lang === "AR" ? "مراجعة الطلب" : "Review Details"}
                     </button>
                     <button
                        type="button"
                        onClick={handleConfirmGuestSubmit}
                        disabled={guestMutation.isPending}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        <FaCheck size={13} />
                        {guestMutation.isPending 
                           ? (lang === "AR" ? "جاري الإرسال..." : "Submitting...") 
                           : (lang === "AR" ? "تأكيد وإرسال" : "Confirm & Submit")}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
