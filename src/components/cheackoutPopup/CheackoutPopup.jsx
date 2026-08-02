import { useEffect, useRef, useState, useMemo } from "react";
import { useAddressStore } from "../../assets/store/addressStore";
import { useCartStore } from "../../assets/store/cartStore";
import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { langText } from "../../assets/constants/lang";
import { useLangStore } from "../../assets/store/langStore";
import FormInput from "../formInput/FormInput";
import orderMutation from "../../assets/apis/order/OrderMutation";
import useAuthStore from "../../assets/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { getMyAddress, GetMyInfo } from "../../assets/apis/auth/AuthApi";
import PhoneInput from "../formInput/PhoneInput";
import Loading from "../../pages/loading/Loading";
import { GetLocationList } from "../../assets/apis/country/Country";

function CheackOutPopUp({ onClose }) {
  const MIN_MINUTES = 20;
  const { lang } = useLangStore();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(MIN_MINUTES);
  const [fullDuration, setFullDuration] = useState("");
  const [isAddressnew, setAddressnew] = useState(false);
  const { getTotalPrice, serviceFee, deliveryFee, cart } = useCartStore();
  const { address, setAddress, isAddressMap, setIsAddressMap } = useAddressStore();
  const { CreateIndividualMutation, SaveIndividuaItemslMutation } = orderMutation({ onClose });
  const { quatationData } = useAuthStore();
  console.log("cart", cart);
  const [deliverImmediately, setDeliverImmediately] = useState(true);

  const MIN_DELAY_MINUTES = 30;
  const PREPARE_MINUS_MINUTES = 20;

  const { data: myAddresses = [], isLoading } = useQuery({
    queryKey: ["myAddresses"],
    queryFn: () => getMyAddress(),
  });
  useEffect(() => {
    console.log("myAddresses", myAddresses);
  }, [myAddresses]);

  const { data: myInfo, isLoading: myInfoLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: GetMyInfo,
    select: (res) => res?.[0],
  });



  useEffect(() => {
    console.log("myInfo", myInfo);
  }, [myInfo]);

  function handelCheackout(values) {
    const now = Date.now();
    let finalDeliveryDate;

    if (values.deliverImmediately) {
      finalDeliveryDate = new Date(now + MIN_DELAY_MINUTES * 60000);
    } else {
      const picked = new Date(values.deliveryDateTimeInput).getTime();

      const minAllowed = now + MIN_DELAY_MINUTES * 60000;
      if (picked < minAllowed) {
        onlineOrderToast.error(
          langText.deliveryTimeMustBeAtlest30MinutsFromNow
            ? langText.deliveryTimeMustBeAtlest30MinutsFromNow[lang]
            : "Delivery time must be at least 30 minutes from now"
        );
        return;
      }

      finalDeliveryDate = new Date(picked - PREPARE_MINUS_MINUTES * 60000);
    }

    let finalAddress = values.isAddressnew
      ? `${values.countrySelect}, ${values.citySelect}, ${values.areaSelect}, ${values.addressInput}`
      : values.address;

    const payload = {
      orderHeaderDeliveryDateTime: toLocalISOString(finalDeliveryDate),
      orderHeaderMobileNumber: `${values.mobilCountry}${values.phone}`,
      orderHeaderOrderdByNotes: values.note,
      orderHeaderAddress: finalAddress,
      orderHeaderAddPercent: 0,
      orderHeaderDiscountPercent: 0,
      orderHeaderEmailAddress: "",
      orderHeaderHasTransportaion: false,
      orderHeaderId: 0,
      orderHeaderPriceListId: 0,
      orderHeaderRemarks: null,
      orderHeaderTransportationPercent: 0,
      orderHeaderWhatsAppNumber: "",
      OrderMenuTypeId: window.location.href?.includes("stella") ? 4 : 3,
      OrderCityId: values.cityId,
    };

    console.log("FINAL PAYLOAD", payload);

    CreateIndividualMutation.mutate(payload);
  }

  const cheackoutSchema = Yup.object().shape({
    phone: Yup.string()
      .required(langText.phoneNumberIsRequired[lang])
      .matches(/^[0-9]+$/, langText.pleaseEnterAValidPhoneNumber[lang])
      .min(7, langText.pleaseEnterAValidPhoneNumber[lang])
      .max(15, langText.pleaseEnterAValidPhoneNumber[lang]),

    addressInput: Yup.string().when("isAddressnew", {
      is: true,
      then: (schema) => schema.required(langText.addressIsRequired[lang]),
      otherwise: (schema) => schema.notRequired(),
    }),
    countrySelect: Yup.string().when("isAddressnew", {
      is: true,
      then: (schema) => schema.required(langText.selectCountry[lang]),
      otherwise: (schema) => schema.notRequired(),
    }),
    citySelect: Yup.string().when("isAddressnew", {
      is: true,
      then: (schema) => schema.required(langText.selectCity[lang]),
      otherwise: (schema) => schema.notRequired(),
    }),
    areaSelect: Yup.string().when("isAddressnew", {
      is: true,
      then: (schema) => schema.required(langText.selectArea[lang]),
      otherwise: (schema) => schema.notRequired(),
    }),
    address: Yup.string().when("isAddressnew", {
      is: false,
      then: (schema) => schema.required(langText.addressIsRequired[lang]),
      otherwise: (schema) => schema.notRequired(),
    }),

    deliverImmediately: Yup.boolean().required(),

    deliveryDateTimeInput: Yup.string().when("deliverImmediately", {
      is: false,
      then: (schema) =>
        schema
          .required(langText.choseDeliveryTime[lang])
          .test(
            "min-time-from-now",
            langText.deliveryTimeMustBeAtlest30MinutsFromNow[lang],
            (value) => {
              if (!value) return false;
              const picked = new Date(value).getTime();
              const minAllowed = Date.now() + MIN_DELAY_MINUTES * 60000;
              return picked >= minAllowed;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    note: Yup.string(),
  });

  let formik = useFormik({
    initialValues: {
      phone: "",
      addressInput: "",
      countrySelect: "",
      citySelect: "",
      areaSelect: "",
      note: "",
      deliveryDateTimeInput: "",
      deliverImmediately: true,
      isAddressnew: isAddressnew,
      address: "",
      mobilCountry: "+20",
      cityId: "",
    },
    validationSchema: cheackoutSchema,
    onSubmit: handelCheackout,
  });

  const { data: locations = [], isLoading: isLocationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: GetLocationList,
  });

  const countries = useMemo(() => {
    return Array.from(new Set(locations.map((item) => item.countryName)))
      .map((name) => locations.find((item) => item.countryName === name))
      .filter(Boolean);
  }, [locations]);

  const cities = useMemo(() => {
    const country = formik.values.countrySelect;
    if (!country) return [];
    return Array.from(
      new Set(locations.filter((l) => l.countryName === country).map((l) => l.cityName))
    );
  }, [locations, formik.values.countrySelect]);

  const areas = useMemo(() => {
    const country = formik.values.countrySelect;
    const city = formik.values.citySelect;
    if (!country || !city) return [];
    return locations.filter((l) => l.countryName === country && l.cityName === city);
  }, [locations, formik.values.countrySelect, formik.values.citySelect]);

  // عند وصول myInfo
  useEffect(() => {
    if (!myInfoLoading) {
      // نظف الرقم: احذف كل شيء غير أرقام
      const cleanPhone = (myInfo?.customerMobile || "").replace(/\D/g, "");
      const country = myInfo?.customerCountryCode || "+20";
      formik.setFieldValue("phone", cleanPhone);
      formik.setFieldValue("mobilCountry", country);
      // لا تضع formik.setFieldTouched هنا — لا حاجة
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myInfo, myInfoLoading]);


  // داخل المكوّن (CheackOutPopUp)
  useEffect(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    // اقفل الجسم واحتفظ بالـ scrollY
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      // استعادة الحالة وارجاع الصفحة لموقعها
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    if (myAddresses?.length > 0 && !isLoading) {
      console.log("myAddresses[0]", myAddresses[0]);

      formik.setFieldValue("address", myAddresses[0]?.customerAddressData);
      formik.setFieldValue("cityId", myAddresses[0]?.customerAddressCityId);
    }
  }, [myAddresses, isLoading]);

  if (myInfoLoading || isLoading || isLocationsLoading) {
    return (<div className="inset-0  fixed z-[100] flex items-center justify-center bg-[#00000066]  ">

      <Loading gif={false} />;
    </div>)
  }

  return (
    <div className="fixed inset-0 p-2 md:p-4 bg-[#00000066] flex items-start pt-5 justify-center z-50 pb-5">
      <div
        className="
          bg-white rounded-xl shadow-lg flex flex-col
          gap-2 md:gap-3
          max-w-lg w-full
          px-3 py-2 md:p-6
          overflow-y-auto
          cutom-scroll
        "
      >
        <div className="ms-auto cursor-pointer" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-center font-semibold text-md md:text-2xl mb-1">
          {langText.checkout[lang]}
        </p>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 flex-1 text-sm md:text-base">
          <div className="flex gap-3 items-end">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <input
                  id="deliver_immediately"
                  type="checkbox"
                  checked={deliverImmediately}
                  onChange={(e) => {
                    setDeliverImmediately(e.target.checked);
                    formik.setFieldValue("deliverImmediately", e.target.checked);
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="deliver_immediately" className="font-medium text-sm md:text-base">
                  {langText.deliverImmediately ? langText.deliverImmediately[lang] : "Deliver immediately"}
                </label>
              </div>

              {!formik.values.deliverImmediately && (
                <div className="flex flex-col gap-2 mt-1">
                  <CustomDateTimePicker
                    formik={formik}
                    // minDelayMinutes={MIN_DELAY_MINUTES}
                    langText={langText}
                    lang={lang}
                  />
                  {formik.touched.deliveryDateTimeInput && formik.errors.deliveryDateTimeInput ? (
                    <p className="text-red-600 text-xs mt-0.5">{formik.errors.deliveryDateTimeInput}</p>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <PhoneInput formik={formik} name="phone" defaultCountry="+20" />

          <div className="flex items-center gap-2">
            <input
              id="newAddress"
              type="checkbox"
              checked={isAddressnew}
              onChange={(e) => {
                const checked = e.target.checked;
                setAddressnew(checked);
                formik.setFieldValue("isAddressnew", checked);
                formik.setFieldValue("addressInput", "");
                formik.setFieldValue("address", checked ? "" : (myAddresses[0]?.customerAddressData || ""));
                formik.setFieldValue("cityId", checked ? "" : (myAddresses[0]?.customerAddressCityId || ""));
              }}
              className="w-4 h-4"
            />
            <label htmlFor="newAddress" className="font-medium text-sm md:text-base">
              {langText.AddNewAddress ? langText.AddNewAddress[lang] : "Add new address"}
            </label>
          </div>

          {isAddressnew && (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <select
                  name="countrySelect"
                  onChange={(e) => {
                    const val = e.target.value;
                    formik.setFieldValue("countrySelect", val);
                    formik.setFieldValue("citySelect", "");
                    formik.setFieldValue("cityId", "");
                    formik.setFieldValue("areaSelect", "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.countrySelect}
                  className={`w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-primary appearance-none text-sm transition-all ${formik.touched.countrySelect && formik.errors.countrySelect ? "border-red-500" : "border-gray-200"
                    }`}
                >
                  <option value="">{langText.selectCountry[lang]}</option>
                  {countries.map((c) => (
                    <option key={c.countryID} value={c.countryName}>
                      {c.countryName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  name="citySelect"
                  disabled={!formik.values.countrySelect}
                  onChange={(e) => {
                    const val = e.target.value;
                    formik.setFieldValue("citySelect", val);
                    formik.setFieldValue("areaSelect", "");
                    const matched = locations.find(
                      (l) => l.countryName === formik.values.countrySelect && l.cityName === val
                    );
                    formik.setFieldValue("cityId", matched ? matched.cityID : "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.citySelect}
                  className={`w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-primary appearance-none text-sm transition-all disabled:bg-gray-50 ${formik.touched.citySelect && formik.errors.citySelect ? "border-red-500" : "border-gray-200"
                    }`}
                >
                  <option value="">{langText.selectCity[lang]}</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  name="areaSelect"
                  disabled={!formik.values.citySelect}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.areaSelect}
                  className={`w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-primary appearance-none text-sm transition-all disabled:bg-gray-50 ${formik.touched.areaSelect && formik.errors.areaSelect ? "border-red-500" : "border-gray-200"
                    }`}
                >
                  <option value="">{langText.selectArea[lang]}</option>
                  {areas.map((area) => (
                    <option key={area.ariaID} value={area.ariaName}>
                      {area.ariaName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {isAddressnew ? (
            <FormInput
              name="addressInput"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.addressInput}
              errors={formik.errors.addressInput}
              touched={formik.touched.addressInput}
              type="text"
              placeholder={langText.deliveryAddress[lang]}
            />
          ) : myAddresses.length > 0 ? (
            <div className="flex flex-col gap-1">
              <p className="text-sm">{langText.SelectAddress[lang]}</p>
              {myAddresses.map((addr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    id={`address-${index}`}
                    type="radio"
                    name="address"
                    checked={formik.values.address === addr.customerAddressData}
                    onChange={(e) => {
                      formik.setFieldValue("address", e.target.value);
                      formik.setFieldValue("cityId", addr.customerAddressCityId);
                    }}
                    value={addr.customerAddressData}
                    onClick={() => {
                      formik.setFieldValue("address", addr.customerAddressData);
                      formik.setFieldValue("cityId", addr.customerAddressCityId);
                    }}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`address-${index}`} className="font-medium text-sm">
                    {addr.customerAddressData}
                  </label>
                </div>
              ))}
              {formik.errors.address && formik.touched.address && (
                <p className="text-red-600 text-xs mt-0.5">{formik.errors.address}</p>
              )}
            </div>
          ) : (
            <p className="text-sm"></p>
          )}

          <textarea
            className="w-full py-2 px-2 border border-light-gray rounded-lg focus:outline-none focus:border-primary resize-none text-sm"
            rows={2}
            placeholder={langText.additionalNotesInstructions[lang]}
            name="note"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.note}
          />

          <div className="w-full flex flex-col gap-2 mt-auto">
            <div className="flex items-center justify-between py-1 border-0 border-b border-b-light-gray">
              <p className="font-semibold text-sm md:text-base">{langText.subtotal[lang]}</p>
              <p className="text-sm md:text-base">{getTotalPrice()}</p>
            </div>
            <div className="flex items-center justify-between py-1 border-0 border-b border-b-light-gray">
              <p className="font-semibold text-sm md:text-base">
                {langText.deliveryFee[lang]} {!isAddressMap ? `(${langText.min[lang]})` : null}
              </p>
              <p className="text-sm md:text-base">{deliveryFee}</p>
            </div>
            <div className="flex items-center justify-between py-1 border-0 border-b border-b-light-gray">
              <p className="font-semibold text-sm md:text-base">{langText.servviceFee[lang]}</p>
              <p className="text-sm md:text-base">{serviceFee}</p>
            </div>
            <div className="flex items-center justify-between py-1 border-0">
              <p className="font-semibold text-sm md:text-base">{langText.totalAmountEGP[lang]}</p>
              <p className="text-xl text-primary">{getTotalPrice() + deliveryFee + serviceFee}</p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary border border-primary hover:bg-white hover:text-primary transition w-full rounded-full py-2 text-md text-center text-white cursor-pointer mt-1"
          >
            {langText.checkout[lang]}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheackOutPopUp;

function Input({ label, value, onChange, min, max }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="px-3 py-1 focus:outline-none border-0 focus:border-b focus:border-b-primary text-sm"
      />
    </div>
  );
}

function getMinDateTimeString(minutesFromNow) {
  const d = new Date(Date.now() + minutesFromNow * 60000);

  const pad = (n) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toLocalISOString(date) {
  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:00`;
}

function CustomDateTimePicker({ formik, minDelayMinutes = 50, langText, lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function getSafeMinDateObj() {
    const now = Date.now();
    const safeMs = now + (minDelayMinutes + 1) * 60000;
    return new Date(safeMs);
  }

  function getDateStr(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  const initSafe = getSafeMinDateObj();
  const [date, setDate] = useState(getDateStr(initSafe));
  const [hour, setHour] = useState(pad(initSafe.getHours()));
  const [minute, setMinute] = useState(pad(initSafe.getMinutes()));

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function onOpen() {
    const safe = getSafeMinDateObj();
    setDate(getDateStr(safe));
    setHour(pad(safe.getHours()));
    setMinute(pad(safe.getMinutes()));
    setOpen(true);
  }

  function isValidTime(h, m) {
    const safeMin = getSafeMinDateObj();
    const safeDateStr = getDateStr(safeMin);
    if (date !== safeDateStr) return true;
    const pickedMinutes = Number(h) * 60 + Number(m);
    const minMinutes = safeMin.getHours() * 60 + safeMin.getMinutes();
    return pickedMinutes >= minMinutes;
  }

  function handleDone() {
    if (!isValidTime(hour, minute)) {
      onlineOrderToast.error(
        langText?.deliveryTimeMustBeAtlest30MinutsFromNow?.[lang] || "Invalid delivery time"
      );
      return;
    }

    const iso = `${date}T${hour}:${minute}`;
    const d = new Date(iso);
    if (!isFinite(d.getTime())) {
      onlineOrderToast.error("Invalid date/time");
      return;
    }

    formik.setFieldValue("deliveryDateTimeInput", iso);
    formik.setFieldTouched("deliveryDateTimeInput", true, false);
    setOpen(false);
  }

  const displayValue = formik.values.deliveryDateTimeInput
    ? formik.values.deliveryDateTimeInput.replace("T", " ")
    : `${date} ${hour}:${minute}`;

  const safeMinDateForInput = getDateStr(getSafeMinDateObj());

  return (
    <div ref={ref} className="relative">
      <div
        onClick={onOpen}
        className="w-full border rounded-lg px-2 py-2 cursor-pointer flex justify-between items-center text-sm"
      >
        <span className="truncate">{displayValue}</span>
        <span>📅</span>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg p-3 shadow-lg">
          <label className="text-xs mb-1 block">Date</label>
          <input
            type="date"
            value={date}
            min={safeMinDateForInput}
            onChange={(e) => {
              const newDate = e.target.value;
              setDate(newDate);
              const safe = getSafeMinDateObj();
              const safeDateStr = getDateStr(safe);
              if (newDate === safeDateStr) {
                setHour(pad(safe.getHours()));
                setMinute(pad(safe.getMinutes()));
              }
            }}
            className="w-full mb-2 border rounded px-2 py-1 text-sm"
          />

          <label className="text-xs mb-1 block">Time (24h)</label>
          <div className="flex gap-2">
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm"
            >
              {[...Array(24)].map((_, h) => {
                const hv = pad(h);
                return (
                  <option key={h} value={hv} disabled={!isValidTime(hv, minute)}>
                    {hv}
                  </option>
                );
              })}
            </select>

            <span className="self-center">:</span>

            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm"
            >
              {[...Array(60)].map((_, m) => {
                const mv = pad(m);
                return (
                  <option key={m} value={mv} disabled={!isValidTime(hour, mv)}>
                    {mv}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 border rounded text-sm">
              Cancel
            </button>
            <button type="button" onClick={handleDone} className="px-3 py-1 bg-primary text-white rounded text-sm">
              Done
            </button>
          </div>

          {formik.touched.deliveryDateTimeInput && formik.errors.deliveryDateTimeInput && (
            <p className="text-red-600 text-xs mt-1">{formik.errors.deliveryDateTimeInput}</p>
          )}
        </div>
      )}
    </div>
  );
}
