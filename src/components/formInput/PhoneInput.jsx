// src/components/formInput/PhoneInput.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  parsePhoneNumberFromString,
  AsYouType,
} from "libphonenumber-js";
import { GetCountriesCodes } from "../../assets/apis/country/Country";
import { useQuery } from "@tanstack/react-query";
import { langText } from "../../assets/constants/lang";
import { useLangStore } from "../../assets/store/langStore";

/**
 * Props:
 * - formik: formik instance
 * - name: field name (default "mobil")
 * - defaultCountry: a calling-code string like "+20" (optional)
 */
export default function PhoneInput({
  formik,
  name = "mobil",
  defaultCountry = "+20",
}) {
  const { data: countries, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: GetCountriesCodes,
  });
const{lang}=useLangStore();
  // state holds the selected calling code string (e.g. "+20")
  const [callingCode, setCallingCode] = useState(
    formik.values.countryCode || defaultCountry
  );
  const [localValue, setLocalValue] = useState("");

  // sync selected calling code to formik (so backend knows country)
  useEffect(() => {
    formik.setFieldValue("countryCode", callingCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callingCode]);

  // whenever the actual stored value in formik changes, update display
  useEffect(() => {
    try {
      const current = formik.values[name];
      if (current && typeof current === "string" && current.startsWith("+")) {
        const parsed = parsePhoneNumberFromString(current);
        setLocalValue(parsed ? parsed.formatNational() : current);
      } else {
        setLocalValue(current || "");
      }
    } catch {
      setLocalValue(formik.values[name] || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values[name]]);

  // helper: clean numeric digits and drop leading trunk zeros
  function normalizeDigits(str) {
    const digits = (str || "").replace(/\D/g, "");
    // drop leading zeros (trunk prefixes) — common case
    return digits.replace(/^0+/, "");
  }

  function tryParseAndSet(value, currentCallingCode) {
    // if user provided full international (+...), parse directly
    try {
      if (!value) {
        formik.setFieldValue(name, "");
        return;
      }

      const raw = value.trim();

      let parsed = null;
      if (raw.startsWith("+")) {
        parsed = parsePhoneNumberFromString(raw);
      } else {
        const digits = normalizeDigits(raw);
        // if no digits, set raw
        if (!digits) {
          formik.setFieldValue(name, raw);
          return;
        }
        // try compose E.164 with calling code (callingCode includes leading +)
        const composed = `${currentCallingCode}${digits}`;
        parsed = parsePhoneNumberFromString(composed);
      }

      if (parsed && parsed.isValid && parsed.isValid()) {
        formik.setFieldValue(name, parsed.number); // E.164
      } else {
        // غير صالح: خزّن النص كما هو (أو يمكنك اختيار خزّن parsed?.number)
        formik.setFieldValue(name, value);
      }
    } catch {
      formik.setFieldValue(name, value);
    }
  }

  function handleInputChange(e) {
    const raw = e.target.value;
    // format while typing (best-effort): use AsYouType by passing the composed E.164 input if possible
    try {
      // If starts with +, keep it; else try to feed callingCode + digits to AsYouType
      let preview;
      if (raw.trim().startsWith("+")) {
        preview = new AsYouType().input(raw);
      } else {
        const digits = normalizeDigits(raw);
        preview = digits ? new AsYouType().input(`${callingCode}${digits}`) : raw;
      }
      setLocalValue(preview);
    } catch {
      setLocalValue(raw);
    }

    tryParseAndSet(raw, callingCode);
  }

  function handleChange(e) {
  const raw = e.target.value;
  setLocalValue(raw);

  // خزّن الرقم كنص فقط
  formik.setFieldValue(name, raw);
}


  function handleBlur() {
    formik.setFieldTouched(name, true);
    const current = formik.values[name];
    if (current && typeof current === "string" && current.startsWith("+")) {
      try {
        const parsed = parsePhoneNumberFromString(current);
        if (parsed) setLocalValue(parsed.formatNational());
      } catch {
        // ignore
      }
    }
  }

  function handleCountryChange(e) {
    const newCalling = e.target.value; // e.g. "+20"
    setCallingCode(newCalling);
    formik.setFieldValue("countryCode", newCalling);

    // حاول إعادة تفسير القيمة الموجودة بالنسبة للبلد الجديد
    if (localValue && localValue.trim()) {
      tryParseAndSet(localValue, newCalling);
      // إذا نجح التحليل، أعد عرض النسق المحلي الجديد
      const maybeParsed = (() => {
        try {
          if (localValue.trim().startsWith("+")) {
            return parsePhoneNumberFromString(localValue.trim());
          } else {
            const digits = normalizeDigits(localValue);
            return digits ? parsePhoneNumberFromString(`${newCalling}${digits}`) : null;
          }
        } catch {
          return null;
        }
      })();
      if (maybeParsed && maybeParsed.isValid && maybeParsed.isValid()) {
        setLocalValue(maybeParsed.formatNational());
      } else {
        // اترك ما كتبه المستخدم
        // setLocalValue(localValue);
      }
    } else {
      // لا قيمة محلية: نظف الحقل
      formik.setFieldValue(name, "");
      setLocalValue("");
    }
  }

  return (
    <div className="w-full">
      <div className="relative w-full flex gap-2 items-center">
        <select
          value={callingCode}
          onChange={(e) => {
  setCallingCode(e.target.value);
  formik.setFieldValue("countryCode", e.target.value);
}}

          className="h-9 px-2 border-0 border-b outline-0 border-[#E5E5E5] bg-transparent text-sm max-w-1/2"
        >
          {isLoading && <option>Loading...</option>}
          {countries?.filter((c) => c.countryCode === "+20")?.map((c) => (
            <option key={c.countryID+"-"+c.countryCode} value={c.countryCode}>
              {c.countryName} ({c.countryCode})
            </option>
          ))}
        </select>

        <input
          type="tel"
          name={name}
          id={name}
          placeholder={langText.phoneNumber[lang]}
          className="w-full h-9 py-1.5 border-0 border-b outline-0 border-[#E5E5E5] text-lg"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {formik.touched[name] && formik.errors[name] ? (
        <p className="text-red-600 text-xs mt-0.5">{formik.errors[name]}</p>
      ) : null}
    </div>
  );
}
