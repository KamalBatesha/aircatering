
import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck, FaUniversity } from 'react-icons/fa';
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GetPayTypes } from "../assets/apis/PurchasingAPI";
import CustomLookup from './HelperComponents/CustomLookup';

const FormObserver = ({ values, setBankSelected, currencyList, setFieldValue }) => {
   useEffect(() => {
      setBankSelected(values.paymentMethod === 3);
   }, [values.paymentMethod, setBankSelected]);

   const didSetCurrency = useRef(false);
   useEffect(() => {
      if (!didSetCurrency.current && currencyList?.length) {
         // Case-insensitive USD match, fall back to first currency if not found
         const usd = currencyList.find((c) => c.currencyName?.toUpperCase() === "USD")
            || currencyList[0];
         if (usd?.currencyId != null) {
            setFieldValue("paymentCurrency", usd.currencyId);
            didSetCurrency.current = true;
         }
      }
   }, [currencyList, setFieldValue]);

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
               onBlur={onBlur}
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
                     {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                           <MenuItem
                              key={getOptionValue(option)}
                              onClick={() => handleSelect(option)}
                              sx={{ fontSize: "12px" }}
                           >
                              {getOptionLabel(option)}
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
import { getMyAgent, getMyAirCrafts, getMyBillTo, getMyFlightNumbers, getMyOperators, getMyRegistrations, GetCustomerProfileSettings, UpdateCustomerProfileSettings, SaveOrderAgainAirCatering } from '../assets/apis/order/OrderApi';
import { useNavigate } from 'react-router-dom';
import HelpTooltip from './HelpTooltip';
import { fieldDescriptions } from '../assets/constants/fieldDescriptions';

export default function CreateOrderModal({ isOpen, onClose, oldOrderId = null }) {
   const navigate = useNavigate();
   const [step, setStep] = useState(0);
   const [isBankSelected, setIsBankSelected] = useState(false);

   const { lang } = useLangStore();

   const { data: profileSettings } = useQuery({
      queryKey: ["customerProfileSettings"],
      queryFn: GetCustomerProfileSettings,
      enabled: isOpen,
   });

   const Step1Schema = Yup.object().shape({
      station: Yup.number().required(langText.stationIsRequired[lang]),
      priceList: Yup.number().required(langText.priceListIsRequired[lang]),
      flightNumberName: Yup.string().required(langText.flightNumberIsRequired[lang]),
      registrationName: profileSettings?.customerDataNotAplicable
         ? Yup.string()
         : Yup.string().required(langText.registrationIsRequired[lang]),
      aircraftTypeName: Yup.string().required(langText.aircraftTypeIsRequired[lang]),
      orderHeaderPaxnum: Yup.number().min(0, lang === "AR" ? "يجب أن يكون 0 أو أكثر" : "Must be at least 0").required(lang === "AR" ? "عدد الركاب مطلوب" : "Number of Passengers is required"),
      orderHeaderCrewNum: Yup.number().min(0, lang === "AR" ? "يجب أن يكون 0 أو أكثر" : "Must be at least 0").required(lang === "AR" ? "عدد أفراد الطاقم مطلوب" : "Number of Crew is required"),
      orderHeaderFlightType: Yup.string().required(lang === "AR" ? "نوع الرحلة مطلوب" : "Flight Type is required"),
   });

   const Step2Schema = Yup.object().shape({
      agentName: profileSettings?.agentIsRequired === false
         ? Yup.string()
         : Yup.string().required(langText.agentIsRequired[lang]),
      operatorName: profileSettings?.operatorIsRequired === false
         ? Yup.string()
         : Yup.string().required(langText.operatorIsRequired[lang]),
      billToName: Yup.string().required(langText.billToIsRequired[lang]),
      invoiceTo: Yup.number().required(langText.invoiceToIsRequired[lang]),
      paymentMethod: Yup.number().required(langText.paymentMethodIsRequired[lang]),
      paymentCurrency: Yup.number().required(langText.paymentCurrencyIsRequired[lang]),
   });

   const Step3Schema = Yup.object().shape({
      arrivalDate: Yup.mixed()
         .nullable()
         .test(
            'arrival-required',
            lang === "AR" ? "تاريخ الوصول مطلوب" : "Arrival date is required",
            function (val) {
               const { orderHeaderFlightType } = this.parent;
               // if (orderHeaderFlightType === "Arrival" || orderHeaderFlightType === "Both") {
               //    return !!val;
               // }
               return true;
            }
         )
         .test(
            'arrival-future',
            lang === "AR" ? "يجب أن يكون تاريخ الوصول في المستقبل" : "Arrival date must be in the future",
            function (val) {
               const { orderHeaderFlightType } = this.parent;
               if (orderHeaderFlightType === "Departure") return true;
               if (!val || !val.isValid()) return true;
               return val.isAfter(dayjs());
            }
         ),
      departureDate: Yup.mixed()
         .nullable()
         .test(
            'departure-required',
            lang === "AR" ? "تاريخ المغادرة مطلوب" : "Departure date is required",
            function (val) {
               const { orderHeaderFlightType } = this.parent;
               // if (orderHeaderFlightType === "Departure" || orderHeaderFlightType === "Both") {
               //    return !!val;
               // }
               return true;
            }
         )
         .test(
            'departure-future',
            lang === "AR" ? "يجب أن يكون تاريخ المغادرة في المستقبل" : "Departure date must be in the future",
            function (val) {
               if (!val || !val.isValid()) return true;
               return val.isAfter(dayjs());
            }
         )
         .test(
            'at-least-one-date',
            langText.atLeastOneDateRequired?.[lang] || 'Either Arrival or Departure date is required',
            function (val) {
               const { orderHeaderFlightType, arrivalDate } = this.parent;
               if (orderHeaderFlightType === "Both") {
                  return !!(val && arrivalDate);
               }
               return true;
            }
         )
         .test('is-after-arrival', langText.departureMustBeAfterArrival?.[lang] || "Departure must be after arrival", function (val) {
            const { orderHeaderFlightType, arrivalDate } = this.parent;
            // if (orderHeaderFlightType !== "Both") return true;
            if (!val || !val.isValid() || !arrivalDate || !arrivalDate.isValid()) return true;
            return val.isAfter(arrivalDate);
         }),
   });

   const Step4Schema = Yup.object().shape({
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
            lang === 'AR' ? 'يجب أن يكون في المستقبل' : 'Must be in the future',
            function (val) {
               if (!val || !val.isValid()) return true;
               return val.isAfter(dayjs());
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
            lang === 'AR' ? 'يجب أن يكون في المستقبل' : 'Must be in the future',
            function (val) {
               if (!val || !val.isValid()) return true;
               return val.isAfter(dayjs());
            }
         )
   });

   const Step5Schema = Yup.object().shape({
      paymentInfoAccountBankName: Yup.string().required(lang === "AR" ? "اسم البنك مطلوب" : "Bank name is required"),
      paymentInfoAccountNumber: Yup.string().required(lang === "AR" ? "رقم الحساب مطلوب" : "Account number is required"),
      paymentInfoIBan: Yup.string().required(lang === "AR" ? "الآيبان مطلوب" : "IBAN is required"),
      paymentInfoSwiftCode: Yup.string().required(lang === "AR" ? "رمز سويفت مطلوب" : "Swift code is required"),
   });

   const StepGroundHandlerSchema = Yup.object().shape({
      orderHeadearGroundHandlerName: profileSettings?.groundHandlerIsRequired === true
         ? Yup.string().required(lang === "AR" ? "مزود الخدمة الأرضية مطلوب" : "Ground Handler Name is required")
         : Yup.string(),
      orderHeadearGroundHandlerEmail: Yup.string().email(lang === "AR" ? "البريد الإلكتروني غير صالح" : "Invalid email format"),
      orderHeadearGroundHandlerPhone: Yup.string(),
   });

   const { createOrderByClientMutation } = useProductMutation();
   const { setSelectedOrder } = useCartStore();
   const queryClient = useQueryClient();

   const orderAgainMutation = useMutation({
      mutationFn: SaveOrderAgainAirCatering,
   });

   const isGroundHandlerVisible = profileSettings?.groundHandlerIsVisible === true;

   const stepsConfig = [
      { id: 'orderDetail', label: langText.orderDetail[lang].replace(/^\d+\.\s*/, ''), schema: Step1Schema },
      { id: 'clientAndPayment', label: langText.clientAndPayment[lang].replace(/^\d+\.\s*/, ''), schema: Step2Schema },
   ];

   if (isBankSelected) {
      stepsConfig.push({ id: 'bankInfo', label: lang === "EN" ? "Bank Information" : "المعلومات البنكية", schema: Step5Schema });
   }

   if (isGroundHandlerVisible) {
      stepsConfig.push({ id: 'groundHandler', label: lang === "EN" ? "Ground Handler" : "مزود الخدمة الأرضية", schema: StepGroundHandlerSchema });
   }

   stepsConfig.push(
      { id: 'dateTime', label: langText.dateTime[lang].replace(/^\d+\.\s*/, ''), schema: Step3Schema },
      { id: 'deliveryDates', label: langText.deliveryDates?.[lang] || (lang === "EN" ? "Delivery" : "التوصيل"), schema: Step4Schema }
   );

   const validationSchemas = stepsConfig.map(s => s.schema);
   const { data: stations } = useQuery({ queryKey: ["stations"], queryFn: GetStationsList, enabled: isOpen });
   const { data: priceLists } = useQuery({ queryKey: ["priceLists"], queryFn: GetHeaderPriceList, enabled: isOpen });
   const { data: flightNumbers } = useQuery({ queryKey: ["flightNumbers"], queryFn: getMyFlightNumbers, enabled: isOpen });
   const { data: registrations } = useQuery({ queryKey: ["registrations"], queryFn: getMyRegistrations, enabled: isOpen });
   const { data: airCrafts } = useQuery({ queryKey: ["airCrafts"], queryFn: getMyAirCrafts, enabled: isOpen });
   const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: getMyAgent, enabled: isOpen });
   const { data: operators } = useQuery({ queryKey: ["operators"], queryFn: getMyOperators, enabled: isOpen });
   const { data: billTo } = useQuery({ queryKey: ["billTo"], queryFn: getMyBillTo, enabled: isOpen });
   const { data: invoiceTo } = useQuery({ queryKey: ["invoiceTo"], queryFn: GetInvoiceToList, enabled: isOpen });
   const { data: payTypes } = useQuery({ queryKey: ["payTypes"], queryFn: GetPayTypes, enabled: isOpen });
   const { data: currencyList } = useQuery({ queryKey: ["currencyListSales"], queryFn: CurrencyListSales, enabled: isOpen });
   const { data: groundHandlerList } = useQuery({ queryKey: ["groundHandlerList"], queryFn: getMyGroundHandlerList, enabled: isOpen });
   const { selectedStation } = useStationStore();
   useEffect(() => {
      console.log("groundHandlerList", groundHandlerList);

   }, [groundHandlerList])

   const originalProfileSettings = useRef(null);

   // const updateProfileSettingsMutation = useMutation({
   //    mutationFn: UpdateCustomerProfileSettings,
   // });

   useEffect(() => {
      if (!isOpen) {
         originalProfileSettings.current = null;
      } else {
         setStep(0);
         setIsBankSelected(false);
      }
   }, [isOpen]);

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

   const handleSubmit = (values, actions) => {
      const maxSteps = stepsConfig.length - 1;

      if (step < maxSteps) {
         setStep(step + 1);
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

            paymentInfoAccountBankName: values.paymentInfoAccountBankName || "",
            paymentInfoAccountNumber: values.paymentInfoAccountNumber || "",
            paymentInfoIBan: values.paymentInfoIBan || "",
            paymentInfoSwiftCode: values.paymentInfoSwiftCode || "",
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

            const original = originalProfileSettings.current;
            if (original) {
               const updatedSettings = { ...original };
               let hasUpdates = false;

               if (original.flightId == null && values.flightNumber) {
                  updatedSettings.flightId = values.flightNumber;
                  hasUpdates = true;
               }
               if (original.registrationId == null && values.registration) {
                  updatedSettings.registrationId = values.registration;
                  hasUpdates = true;
               }
               if (original.airCraftId == null && values.aircraftType) {
                  updatedSettings.airCraftId = values.aircraftType;
                  hasUpdates = true;
               }
               if (original.paymentMethodId == null && values.paymentMethod) {
                  updatedSettings.paymentMethodId = values.paymentMethod;
                  hasUpdates = true;
               }
               if (original.agentId == null && values.agent) {
                  updatedSettings.agentId = values.agent;
                  hasUpdates = true;
               }
               if (original.operatorId == null && values.operator) {
                  updatedSettings.operatorId = values.operator;
                  hasUpdates = true;
               }
               if (original.billToId == null && values.billTo) {
                  updatedSettings.billToId = values.billTo;
                  hasUpdates = true;
               }

               if (hasUpdates) {
                  updateProfileSettingsMutation.mutate(updatedSettings);
               }
            }

            onClose();
            actions.resetForm();
            setStep(0);
            actions.setSubmitting(false);
         };

         const handleError = () => {
            onlineOrderToast.error(lang == "EN" ? "Failed to create order" : "فشل إنشاء الطلب", { id: "creatingOrder" });
            actions.setSubmitting(false);
         };

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
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[650px] max-h-[95vh] overflow-hidden flex flex-col">
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

            <div className="flex justify-evenly bg-gray-50 border-b border-gray-100 p-4">
               {stepsConfig.map((s, idx) => (
                  <div key={s.id} className={`text-center font-semibold text-sm ${step === idx ? "text-primary" : "text-gray-400"}`}>
                     {idx + 1}. {s.label}
                  </div>
               ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
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
                     orderHeaderPaxnum: 0,
                     orderHeaderCrewNum: 0,
                     orderHeaderArrivalPaxnum: 0,
                     orderHeaderArrivalCrewNum: 0,
                     orderHeaderFlightType: "Both",
                     paymentInfoAccountBankName: profileSettings?.paymentInfoAccountBankName || "",
                     paymentInfoAccountNumber: profileSettings?.paymentInfoAccountNumber || "",
                     paymentInfoIBan: profileSettings?.paymentInfoIBan || "",
                     paymentInfoSwiftCode: profileSettings?.paymentInfoSwiftCode || "",
                     orderHeaderIsDepartur: false,
                     orderHeaderIsArrival: false,

                     orderHeadearGroundHandlerId: profileSettings?.groundHandlerId ?? 0,
                     orderHeadearGroundHandlerName: profileSettings?.groundHandlerName ?? "",
                     orderHeadearGroundHandlerEmail: profileSettings?.groundHandlerEmail ?? "",
                     orderHeadearGroundHandlerPhone: profileSettings?.groundHandlerPhone ?? "",
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
                  }) => (
                     <Form id={`guide-modal-step-${step}`} className="flex flex-col h-full relative p-1">
                        <FormObserver values={values} setBankSelected={setIsBankSelected} currencyList={currencyList} setFieldValue={setFieldValue} />

                        {stepsConfig[step]?.id === 'orderDetail' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="col-span-1">
                                 <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    Station * <HelpTooltip text={fieldDescriptions.station[lang]} />
                                 </label>
                                 <CustomLookup
                                    options={stations || []}
                                    value={values.station}
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
                                       setFieldTouched("station", true, false);
                                    }}
                                    getOptionLabel={(opt) => opt.stationName}
                                    getOptionValue={(opt) => opt.stationId}
                                    error={touched.station && Boolean(errors.station)}
                                    onBlur={() => setFieldTouched("station", true, false)}
                                 />
                                 {touched.station && errors.station && (
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
                                       value={values.orderHeaderFlightType}
                                       onChange={(e) => {
                                          setFieldValue("orderHeaderFlightType", e.target.value)
                                          if (e.target.value === "Arrival") {
                                             setFieldValue("orderHeaderIsDepartur", false)
                                             setFieldValue("orderHeaderIsArrival", true)
                                             setFieldValue("orderHeaderPaxnum", 0)
                                             setFieldValue("orderHeaderCrewNum", 0)
                                          } else if (e.target.value === "Departure") {
                                             setFieldValue("orderHeaderIsDepartur", true)
                                             setFieldValue("orderHeaderIsArrival", false)
                                             setFieldValue("orderHeaderArrivalPaxnum", 0)
                                             setFieldValue("orderHeaderArrivalCrewNum", 0)
                                          } else if (e.target.value === "Both") {
                                             setFieldValue("orderHeaderIsDepartur", true)
                                             setFieldValue("orderHeaderIsArrival", true)
                                          }
                                          setFieldTouched("orderHeaderFlightType", true, false);
                                       }}
                                       onBlur={() => setFieldTouched("orderHeaderFlightType", true, false)}
                                       className={`w-full h-[30px] px-3 border rounded-[24px] focus:outline-none focus:border-primary appearance-none text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] border-gray-300 font-medium`}
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
                                       setFieldTouched("flightNumberName", true, false);
                                    }}
                                    getOptionLabel={(opt) => opt.flightNumberName}
                                    getOptionValue={(opt) => opt.flightNumberId}
                                    error={
                                       touched.flightNumberName && Boolean(errors.flightNumberName)
                                    }
                                    onBlur={() => setFieldTouched("flightNumberName", true, false)}
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
                                          setFieldValue("registrationName", name);
                                          setFieldTouched("registrationName", true, false);
                                       }}
                                       getOptionLabel={(opt) => opt.registrationName}
                                       getOptionValue={(opt) => opt.registrationId}
                                       error={
                                          touched.registrationName && Boolean(errors.registrationName)
                                       }
                                       onBlur={() => setFieldTouched("registrationName", true, false)}
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
                                          onChange={(e) => { setFieldValue("orderHeaderArrivalPaxnum", Math.max(0, parseInt(e.target.value) || 0)); setFieldTouched("orderHeaderArrivalPaxnum", true, false); }}
                                          onBlur={() => setFieldTouched("orderHeaderArrivalPaxnum", true, false)}
                                          size="small"
                                          fullWidth
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "24px", height: "30px", fontSize: "12px" } }}
                                       />
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">{lang === "AR" ? "عدد أفراد طاقم الوصول *" : "Number of Arrival Crew *"} <HelpTooltip text={fieldDescriptions.arrivalCrew[lang]} /></label>
                                       <TextField
                                          type="number"
                                          value={values.orderHeaderArrivalCrewNum}
                                          onChange={(e) => { setFieldValue("orderHeaderArrivalCrewNum", Math.max(0, parseInt(e.target.value) || 0)); setFieldTouched("orderHeaderArrivalCrewNum", true, false); }}
                                          onBlur={() => setFieldTouched("orderHeaderArrivalCrewNum", true, false)}
                                          size="small"
                                          fullWidth
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "24px", height: "30px", fontSize: "12px" } }}
                                       />
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
                                          onChange={(e) => { setFieldValue("orderHeaderPaxnum", Math.max(0, parseInt(e.target.value) || 0)); setFieldTouched("orderHeaderPaxnum", true, false); }}
                                          onBlur={() => setFieldTouched("orderHeaderPaxnum", true, false)}
                                          size="small"
                                          fullWidth
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "24px", height: "30px", fontSize: "12px" } }}
                                       />
                                    </div>
                                    <div className="col-span-1">
                                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">{lang === "AR" ? "عدد أفراد طاقم المغادرة *" : "Number of Departure Crew *"} <HelpTooltip text={fieldDescriptions.departureCrew[lang]} /></label>
                                       <TextField
                                          type="number"
                                          value={values.orderHeaderCrewNum}
                                          onChange={(e) => { setFieldValue("orderHeaderCrewNum", Math.max(0, parseInt(e.target.value) || 0)); setFieldTouched("orderHeaderCrewNum", true, false); }}
                                          onBlur={() => setFieldTouched("orderHeaderCrewNum", true, false)}
                                          size="small"
                                          fullWidth
                                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "24px", height: "30px", fontSize: "12px" } }}
                                       />
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
                                       setFieldValue("aircraftTypeName", name);
                                       setFieldTouched("aircraftTypeName", true, false);
                                    }}
                                    getOptionLabel={(opt) => opt.airCraftName}
                                    getOptionValue={(opt) => opt.airCraftId}
                                    onBlur={() => setFieldTouched("aircraftTypeName", true, false)}
                                 />
                              </div>
                           </div>
                        )}

                        {stepsConfig[step]?.id === 'clientAndPayment' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {profileSettings?.agentIsVisible !== false && (
                                 <div className="col-span-1">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Agent {profileSettings?.agentIsRequired !== false ? "*" : ""} <HelpTooltip text={fieldDescriptions.agent[lang]} /></label>
                                    <FreeTextLookup
                                       options={agents || []}
                                       valueId={values.agent}
                                       valueName={values.agentName}
                                       onChange={(id, name) => {
                                          setFieldValue("agent", id);
                                          setFieldValue("agentName", name);
                                          setFieldTouched("agentName", true, false);
                                       }}
                                       getOptionLabel={(opt) => opt.agentName}
                                       getOptionValue={(opt) => opt.agentId}
                                       error={touched.agentName && Boolean(errors.agentName)}
                                       onBlur={() => setFieldTouched("agentName", true, false)}
                                    />
                                    {touched.agentName && errors.agentName && <div className="text-red-500 text-xs mt-1">{errors.agentName}</div>}
                                 </div>
                              )}
                              {profileSettings?.operatorIsVisible !== false && (
                                 <div className="col-span-1">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Operator {profileSettings?.operatorIsRequired !== false ? "*" : ""} <HelpTooltip text={fieldDescriptions.operator[lang]} /></label>
                                    <FreeTextLookup
                                       options={operators || []}
                                       valueId={values.operator}
                                       valueName={values.operatorName}
                                       onChange={(id, name) => {
                                          setFieldValue("operator", id);
                                          setFieldValue("operatorName", name);
                                          setFieldTouched("operatorName", true, false);
                                       }}
                                       getOptionLabel={(opt) => opt.operatorName}
                                       getOptionValue={(opt) => opt.operatorId}
                                       error={touched.operatorName && Boolean(errors.operatorName)}
                                       onBlur={() => setFieldTouched("operatorName", true, false)}
                                    />
                                    {touched.operatorName && errors.operatorName && <div className="text-red-500 text-xs mt-1">{errors.operatorName}</div>}
                                 </div>
                              )}
                              <div className="col-span-1">
                                 <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Bill To * <HelpTooltip text={fieldDescriptions.billTo[lang]} /></label>
                                 <FreeTextLookup
                                    options={billTo || []}
                                    valueId={values.billTo}
                                    valueName={values.billToName}
                                    onChange={(id, name) => {
                                       setFieldValue("billTo", id);
                                       setFieldValue("billToName", name);
                                       setFieldTouched("billToName", true, false);
                                    }}
                                    getOptionLabel={(opt) => opt.billToName}
                                    getOptionValue={(opt) => opt.billToId}
                                    error={touched.billToName && Boolean(errors.billToName)}
                                    onBlur={() => setFieldTouched("billToName", true, false)}
                                 />
                                 {touched.billToName && errors.billToName && <div className="text-red-500 text-xs mt-1">{errors.billToName}</div>}
                              </div>
                              <div className="col-span-1">
                                 <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Invoice To * <HelpTooltip text={fieldDescriptions.invoiceTo[lang]} /></label>
                                 <CustomLookup
                                    options={invoiceTo || []}
                                    value={values.invoiceTo}
                                    onChange={(val) => { setFieldValue("invoiceTo", val); setFieldTouched("invoiceTo", true, false); }}
                                    getOptionLabel={(opt) => opt.invoicingToName}
                                    getOptionValue={(opt) => opt.invoicingToId}
                                    error={touched.invoiceTo && Boolean(errors.invoiceTo)}
                                    onBlur={() => setFieldTouched("invoiceTo", true, false)}
                                 />
                                 {touched.invoiceTo && errors.invoiceTo && <div className="text-red-500 text-xs mt-1">{errors.invoiceTo}</div>}
                              </div>
                              <div className="col-span-1">
                                 <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Payment Method * <HelpTooltip text={fieldDescriptions.paymentMethod[lang]} /></label>
                                 <div className="relative">
                                    <select
                                       value={values.paymentMethod ?? ""}
                                       onChange={(e) => { setFieldValue("paymentMethod", e.target.value ? Number(e.target.value) : null); setFieldTouched("paymentMethod", true, false); }}
                                       onBlur={() => setFieldTouched("paymentMethod", true, false)}
                                       className={`w-full h-[30px] px-3 border rounded-[24px] focus:outline-none focus:border-primary appearance-none text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${touched.paymentMethod && errors.paymentMethod ? "border-red-400" : "border-gray-300"}`}
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
                                       onChange={(e) => { setFieldValue("paymentCurrency", e.target.value ? Number(e.target.value) : null); setFieldTouched("paymentCurrency", true, false); }}
                                       onBlur={() => setFieldTouched("paymentCurrency", true, false)}
                                       className={`w-full h-[30px] px-3 border rounded-[24px] focus:outline-none focus:border-primary appearance-none text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${touched.paymentCurrency && errors.paymentCurrency ? "border-red-400" : "border-gray-300"}`}
                                    >
                                       <option value="" disabled hidden />
                                       {currencyList?.filter((c) => c.currencyName?.toUpperCase() === "USD").map((c) => (
                                          <option key={c.currencyId} value={c.currencyId}>{c.currencyName}</option>
                                       ))}
                                    </select>
                                 </div>
                                 {touched.paymentCurrency && errors.paymentCurrency && <div className="text-red-500 text-xs mt-1">{errors.paymentCurrency}</div>}
                              </div>
                           </div>
                        )}

                        {stepsConfig[step]?.id === 'bankInfo' && (
                           <div className="flex flex-col gap-6">
                              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-2">
                                 <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                    {lang === "EN" ? "Sky Culinaire Bank Information" : "معلومات حساب سكاي كولينير البنكي"}
                                 </h3>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                       { label: "Account Name", value: "SKY CULINAIRE" },
                                       { label: "Swift Code", value: "AGRIEGCX" },
                                       { label: "IBAN", value: "EG610036000100011018180218558" },
                                       { label: "Account No", value: "11018180218558" }
                                    ].map((item, idx) => (
                                       <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between shadow-sm">
                                          <div>
                                             <div className="text-[10px] text-gray-400 font-semibold uppercase">{item.label}</div>
                                             <div className="text-sm font-bold text-gray-800">{item.value}</div>
                                          </div>
                                          <button
                                             type="button"
                                             onClick={() => {
                                                navigator.clipboard.writeText(item.value);
                                                toast.success(lang === "EN" ? "Copied!" : "تم النسخ!");
                                             }}
                                             className="text-gray-400 hover:text-primary transition-colors"
                                             title="Copy"
                                          >
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                             </svg>
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  {[
                                     { name: "paymentInfoAccountBankName", label: lang === "AR" ? "اسم البنك" : "Bank Name", helpKey: "bankName" },
                                     { name: "paymentInfoAccountNumber", label: lang === "AR" ? "رقم الحساب" : "Account Number", helpKey: "accountNumber" },
                                     { name: "paymentInfoIBan", label: lang === "AR" ? "الآيبان" : "IBAN", helpKey: "iban" },
                                     { name: "paymentInfoSwiftCode", label: lang === "AR" ? "رمز سويفت" : "Swift Code", helpKey: "swiftCode" }
                                  ].map((field) => (
                                     <div className="col-span-1" key={field.name}>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                           {field.label} * <HelpTooltip text={fieldDescriptions[field.helpKey][lang]} />
                                        </label>
                                       <input
                                          type="text"
                                          className={`w-full h-[30px] px-3 border rounded-[24px] focus:outline-none focus:border-primary text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${errors[field.name] && touched[field.name] ? "border-red-500" : "border-gray-300"}`}
                                          name={field.name}
                                          value={values[field.name] || ""}
                                          onChange={(e) => setFieldValue(field.name, e.target.value)}
                                          onBlur={() => setFieldTouched?.(field.name, true)}
                                       />
                                       {errors[field.name] && touched[field.name] && (
                                          <div className="text-red-500 text-xs mt-1">
                                             {errors[field.name]}
                                          </div>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}

                        {stepsConfig[step]?.id === 'groundHandler' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                       setFieldValue("orderHeadearGroundHandlerName", name);
                                       const matched = groundHandlerList?.find(g => g.groundHandlerId === id);
                                       if (matched) {
                                          setFieldValue("orderHeadearGroundHandlerEmail", matched.groundHandlerEmail || "");
                                          setFieldValue("orderHeadearGroundHandlerPhone", matched.groundHandlerPhone || "");
                                       }
                                       setFieldTouched("orderHeadearGroundHandlerName", true, false);
                                    }}
                                    getOptionLabel={(opt) => opt.groundHandlerName}
                                    getOptionValue={(opt) => opt.groundHandlerId}
                                    error={touched.orderHeadearGroundHandlerName && Boolean(errors.orderHeadearGroundHandlerName)}
                                    onBlur={() => setFieldTouched("orderHeadearGroundHandlerName", true, false)}
                                 />
                                 {touched.orderHeadearGroundHandlerName && errors.orderHeadearGroundHandlerName && (
                                    <div className="text-red-500 text-xs mt-1">{errors.orderHeadearGroundHandlerName}</div>
                                 )}
                              </div>

                              <div className="col-span-1">
                                 <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    {lang === "EN" ? "Ground Handler Email" : "البريد الإلكتروني למزود الخدمة"} <HelpTooltip text={fieldDescriptions.groundHandlerEmail[lang]} />
                                 </label>
                                 <input
                                    type="email"
                                    className={`w-full h-[30px] px-3 border rounded-[24px] focus:outline-none focus:border-primary text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${errors.orderHeadearGroundHandlerEmail && touched.orderHeadearGroundHandlerEmail ? "border-red-500" : "border-gray-300"}`}
                                    value={values.orderHeadearGroundHandlerEmail || ""}
                                    onChange={(e) => {
                                       setFieldValue("orderHeadearGroundHandlerEmail", e.target.value);
                                    }}
                                    onBlur={() => setFieldTouched("orderHeadearGroundHandlerEmail", true, false)}
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
                                    className={`w-full h-[30px] px-3 border rounded-[24px] focus:outline-none focus:border-primary text-xs transition-all bg-[var(--color-bg-box)] text-[var(--color-primary)] font-medium ${errors.orderHeadearGroundHandlerPhone && touched.orderHeadearGroundHandlerPhone ? "border-red-500" : "border-gray-300"}`}
                                    value={values.orderHeadearGroundHandlerPhone || ""}
                                    onChange={(e) => {
                                       setFieldValue("orderHeadearGroundHandlerPhone", e.target.value);
                                    }}
                                    onBlur={() => setFieldTouched("orderHeadearGroundHandlerPhone", true, false)}
                                 />
                                 {touched.orderHeadearGroundHandlerPhone && errors.orderHeadearGroundHandlerPhone && (
                                    <div className="text-red-500 text-xs mt-1">{errors.orderHeadearGroundHandlerPhone}</div>
                                 )}
                              </div>
                           </div>
                        )}

                        {/* STEP 4: Main Dates */}
                        {stepsConfig[step]?.id === 'dateTime' && (
                           <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="flex flex-col gap-6">

                                 {/* Arrival Block */}
                                 {/* {values.orderHeaderFlightType !== "Departure" && ( */}
                                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                                       {langText.arrivalDateTime[lang]} <HelpTooltip text={fieldDescriptions.arrivalDate[lang]} />
                                    </h3>
                                    <div className="flex flex-col md:flex-row gap-4">
                                       <div className="flex-1">
                                          <DatePicker
                                             format="DD/MM/YYYY"
                                             value={values.arrivalDate}
                                             onChange={(newDate) => {
                                                if (!newDate?.isValid()) return;
                                                const updated = values.arrivalDate
                                                   ? values.arrivalDate
                                                      .set("year", newDate.year())
                                                      .set("month", newDate.month())
                                                      .set("date", newDate.date())
                                                   : newDate;
                                                setFieldValue("arrivalDate", updated);
                                                setFieldTouched("arrivalDate", true, false);
                                             }}
                                             onClose={() => setFieldTouched("arrivalDate", true, false)}
                                             slotProps={{
                                                textField: {
                                                   size: "small",
                                                   fullWidth: true,
                                                   error:
                                                      touched.arrivalDate &&
                                                      Boolean(errors.arrivalDate),
                                                   sx: {
                                                      backgroundColor: "white",
                                                      borderRadius: "8px",
                                                      "& .MuiOutlinedInput-root": {
                                                         fontSize: "14px",
                                                      },
                                                   },
                                                },
                                             }}
                                          />
                                       </div>
                                       <div className="flex-1">
                                          <TimePicker
                                             ampm={false}
                                             format="HH:mm"
                                             // disablePast={values.orderHeaderFlightType !== "Departure"}
                                             value={values.arrivalDate}
                                             onChange={(newTime) => {
                                                if (!newTime?.isValid()) return;
                                                const updated = values.arrivalDate
                                                   ? values.arrivalDate
                                                      .set("hour", newTime.hour())
                                                      .set("minute", newTime.minute())
                                                   : dayjs()
                                                      .set("hour", newTime.hour())
                                                      .set("minute", newTime.minute());
                                                setFieldValue("arrivalDate", updated);
                                                setFieldTouched("arrivalDate", true, false);
                                             }}
                                             onClose={() => setFieldTouched("arrivalDate", true, false)}
                                             slotProps={{
                                                textField: {
                                                   size: "small",
                                                   fullWidth: true,
                                                   error:
                                                      touched.arrivalDate &&
                                                      Boolean(errors.arrivalDate),
                                                   sx: {
                                                      backgroundColor: "white",
                                                      borderRadius: "8px",
                                                      "& .MuiOutlinedInput-root": {
                                                         fontSize: "14px",
                                                      },
                                                   },
                                                },
                                             }}
                                          />
                                       </div>
                                    </div>
                                    {errors.arrivalDate && touched.arrivalDate && typeof errors.arrivalDate === "string" && (
                                       <div className="mt-3 flex items-center gap-1.5 text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
                                          <span className="text-xs font-semibold">{errors.arrivalDate}</span>
                                       </div>
                                    )}
                                 </div>
                                 {/* )} */}

                                 {/* Departure Block */}
                                 {/* {values.orderHeaderFlightType !== "Arrival" && ( */}
                                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                     <h3 className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                                        {langText.departureDateTime?.[lang] ||
                                           "Departure Date & Time (UTC)"} <HelpTooltip text={fieldDescriptions.departureDate[lang]} />
                                     </h3>
                                    <div className="flex flex-col md:flex-row gap-4">
                                       <div className="flex-1">
                                          <DatePicker
                                             format="DD/MM/YYYY"
                                             disablePast={false}
                                             value={values.departureDate}
                                             onChange={(newDate) => {
                                                if (!newDate?.isValid()) return;
                                                const updated = values.departureDate
                                                   ? values.departureDate
                                                      .set("year", newDate.year())
                                                      .set("month", newDate.month())
                                                      .set("date", newDate.date())
                                                   : newDate;
                                                setFieldValue("departureDate", updated);
                                                setFieldTouched("departureDate", true, false);
                                             }}
                                             onClose={() => setFieldTouched("departureDate", true, false)}
                                             slotProps={{
                                                textField: {
                                                   size: "small",
                                                   fullWidth: true,
                                                   error:
                                                      touched.departureDate &&
                                                      Boolean(errors.departureDate),
                                                   sx: {
                                                      backgroundColor: "white",
                                                      borderRadius: "8px",
                                                      "& .MuiOutlinedInput-root": {
                                                         fontSize: "14px",
                                                      },
                                                   },
                                                },
                                             }}
                                          />
                                       </div>
                                       <div className="flex-1">
                                          <TimePicker
                                             ampm={false}
                                             format="HH:mm"
                                             // disablePast={false}
                                             value={values.departureDate}
                                             onChange={(newTime) => {
                                                if (!newTime?.isValid()) return;
                                                const updated = values.departureDate
                                                   ? values.departureDate
                                                      .set("hour", newTime.hour())
                                                      .set("minute", newTime.minute())
                                                   : dayjs()
                                                      .set("hour", newTime.hour())
                                                      .set("minute", newTime.minute());
                                                setFieldValue("departureDate", updated);
                                                setFieldTouched("departureDate", true, false);
                                             }}
                                             onClose={() => setFieldTouched("departureDate", true, false)}
                                             slotProps={{
                                                textField: {
                                                   size: "small",
                                                   fullWidth: true,
                                                   error:
                                                      touched.departureDate &&
                                                      Boolean(errors.departureDate),
                                                   sx: {
                                                      backgroundColor: "white",
                                                      borderRadius: "8px",
                                                      "& .MuiOutlinedInput-root": {
                                                         fontSize: "14px",
                                                      },
                                                   },
                                                },
                                             }}
                                          />
                                       </div>
                                    </div>
                                    {errors.departureDate && touched.departureDate && typeof errors.departureDate === "string" && (
                                       <div className="mt-3 flex items-center gap-1.5 text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
                                          <span className="text-xs font-semibold">{errors.departureDate}</span>
                                       </div>
                                    )}
                                 </div>
                                 {/* )} */}
                              </div>
                           </LocalizationProvider>
                        )}

                        {/* STEP 5: Delivery Dates */}
                        {stepsConfig[step]?.id === 'deliveryDates' && (
                           <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="flex flex-col gap-6">
                                 {/* Arrival Delivery Block (Disabled if no Arrival Date in Step 3) */}
                                 {values.orderHeaderFlightType !== "Departure" && (
                                    <div
                                       className={`p-4 rounded-xl border border-gray-100 transition-colors ${!values.arrivalDate ? "bg-gray-100 opacity-60" : "bg-gray-50"}`}
                                    >
                                       <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center justify-between">
                                          <span className="flex items-center">
                                             {langText.arrivalDeliveryDateTime?.[lang] ||
                                                "Arrival Delivery Date & Time (UTC)"} <HelpTooltip text={fieldDescriptions.arrivalDelivery[lang]} />
                                          </span>
                                          {!values.arrivalDate && (
                                             <span className="text-xs text-red-500 font-normal">
                                                Requires Arrival Date
                                             </span>
                                          )}
                                       </h3>
                                       <div className="flex flex-col md:flex-row gap-4">
                                          <div className="flex-1">
                                             <DatePicker
                                                disabled={!values.arrivalDate}
                                                format="DD/MM/YYYY"
                                                value={values.arrivalDeliveryDate}
                                                onChange={(newDate) => {
                                                   if (!newDate?.isValid()) return;
                                                   const updated = values.arrivalDeliveryDate
                                                      ? values.arrivalDeliveryDate
                                                         .set("year", newDate.year())
                                                         .set("month", newDate.month())
                                                         .set("date", newDate.date())
                                                      : newDate;
                                                   setFieldValue("arrivalDeliveryDate", updated);
                                                   setFieldTouched("arrivalDeliveryDate", true, false);
                                                }}
                                                onClose={() => setFieldTouched("arrivalDeliveryDate", true, false)}
                                                slotProps={{
                                                   textField: {
                                                      size: "small",
                                                      fullWidth: true,
                                                      error: touched.arrivalDeliveryDate && Boolean(errors.arrivalDeliveryDate),
                                                      sx: {
                                                         backgroundColor: !values.arrivalDate
                                                            ? "transparent"
                                                            : "white",
                                                         borderRadius: "8px",
                                                         "& .MuiOutlinedInput-root": {
                                                            fontSize: "14px",
                                                         },
                                                      },
                                                   },
                                                }}
                                             />
                                          </div>
                                          <div className="flex-1">
                                             <TimePicker
                                                disabled={!values.arrivalDate}
                                                ampm={false}
                                                format="HH:mm"
                                                value={values.arrivalDeliveryDate}
                                                onChange={(newTime) => {
                                                   if (!newTime?.isValid()) return;
                                                   const updated = values.arrivalDeliveryDate
                                                      ? values.arrivalDeliveryDate
                                                         .set("hour", newTime.hour())
                                                         .set("minute", newTime.minute())
                                                      : dayjs()
                                                         .set("hour", newTime.hour())
                                                         .set("minute", newTime.minute());
                                                   setFieldValue("arrivalDeliveryDate", updated);
                                                   setFieldTouched("arrivalDeliveryDate", true, false);
                                                }}
                                                onClose={() => setFieldTouched("arrivalDeliveryDate", true, false)}
                                                slotProps={{
                                                   textField: {
                                                      size: "small",
                                                      fullWidth: true,
                                                      error: touched.arrivalDeliveryDate && Boolean(errors.arrivalDeliveryDate),
                                                      sx: {
                                                         backgroundColor: !values.arrivalDate
                                                            ? "transparent"
                                                            : "white",
                                                         borderRadius: "8px",
                                                         "& .MuiOutlinedInput-root": {
                                                            fontSize: "14px",
                                                         },
                                                      },
                                                   },
                                                }}
                                             />
                                          </div>
                                       </div>
                                       {errors.arrivalDeliveryDate && touched.arrivalDeliveryDate && (
                                          <div className="mt-3 flex items-center gap-1.5 text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
                                             <span className="text-xs font-semibold">{errors.arrivalDeliveryDate}</span>
                                          </div>
                                       )}
                                    </div>
                                 )}

                                 {/* Departure Delivery Block (Disabled if no Departure Date in Step 3) */}
                                 {values.orderHeaderFlightType !== "Arrival" && (
                                    <div
                                       className={`p-4 rounded-xl border border-gray-100 transition-colors ${!values.departureDate ? "bg-gray-100 opacity-60" : "bg-gray-50"}`}
                                    >
                                       <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center justify-between">
                                          <span className="flex items-center">
                                             {langText.departureDeliveryDateTime?.[lang] ||
                                                "Departure Delivery Date & Time (UTC)"} <HelpTooltip text={fieldDescriptions.departureDelivery[lang]} />
                                          </span>
                                          {!values.departureDate && (
                                             <span className="text-xs text-red-500 font-normal">
                                                Requires Departure Date
                                             </span>
                                          )}
                                       </h3>
                                       <div className="flex flex-col md:flex-row gap-4">
                                          <div className="flex-1">
                                             <DatePicker
                                                disabled={!values.departureDate}
                                                format="DD/MM/YYYY"
                                                value={values.departureDeliveryDate}
                                                onChange={(newDate) => {
                                                   if (!newDate?.isValid()) return;
                                                   const updated = values.departureDeliveryDate
                                                      ? values.departureDeliveryDate
                                                         .set("year", newDate.year())
                                                         .set("month", newDate.month())
                                                         .set("date", newDate.date())
                                                      : newDate;
                                                   setFieldValue("departureDeliveryDate", updated);
                                                   setFieldTouched("departureDeliveryDate", true, false);
                                                }}
                                                onClose={() => setFieldTouched("departureDeliveryDate", true, false)}
                                                slotProps={{
                                                   textField: {
                                                      size: "small",
                                                      fullWidth: true,
                                                      error: touched.departureDeliveryDate && Boolean(errors.departureDeliveryDate),
                                                      sx: {
                                                         backgroundColor: !values.departureDate
                                                            ? "transparent"
                                                            : "white",
                                                         borderRadius: "8px",
                                                         "& .MuiOutlinedInput-root": {
                                                            fontSize: "14px",
                                                         },
                                                      },
                                                   },
                                                }}
                                             />
                                          </div>
                                          <div className="flex-1">
                                             <TimePicker
                                                disabled={!values.departureDate}
                                                ampm={false}
                                                format="HH:mm"
                                                value={values.departureDeliveryDate}
                                                onChange={(newTime) => {
                                                   if (!newTime?.isValid()) return;
                                                   const updated = values.departureDeliveryDate
                                                      ? values.departureDeliveryDate
                                                         .set("hour", newTime.hour())
                                                         .set("minute", newTime.minute())
                                                      : dayjs()
                                                         .set("hour", newTime.hour())
                                                         .set("minute", newTime.minute());
                                                   setFieldValue("departureDeliveryDate", updated);
                                                   setFieldTouched("departureDeliveryDate", true, false);
                                                }}
                                                onClose={() => setFieldTouched("departureDeliveryDate", true, false)}
                                                slotProps={{
                                                   textField: {
                                                      size: "small",
                                                      fullWidth: true,
                                                      error: touched.departureDeliveryDate && Boolean(errors.departureDeliveryDate),
                                                      sx: {
                                                         backgroundColor: !values.departureDate
                                                            ? "transparent"
                                                            : "white",
                                                         borderRadius: "8px",
                                                         "& .MuiOutlinedInput-root": {
                                                            fontSize: "14px",
                                                         },
                                                      },
                                                   },
                                                }}
                                             />
                                          </div>
                                       </div>
                                       {errors.departureDeliveryDate && touched.departureDeliveryDate && (
                                          <div className="mt-3 flex items-center gap-1.5 text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
                                             <span className="text-xs font-semibold">{errors.departureDeliveryDate}</span>
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           </LocalizationProvider>
                        )}


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
                              onClick={submitForm}
                              disabled={isSubmitting}
                              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                           >
                              {step === stepsConfig.length - 1 ? (
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
                  )}
               </Formik>
            </div>
         </div>
      </div>
   );
}
