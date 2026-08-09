// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import FormInput from "../../components/formInput/FormInput";
// import { langText } from "../../assets/constants/lang";
// import { useLangStore } from "../../assets/store/langStore";
// import PhoneInput from "../../components/formInput/PhoneInput";
// import { GetLocationList } from "../../assets/apis/country/Country";
// import useAuthMutation from "../../assets/apis/auth/AuthMutation";
// import OtpModal from "../../components/otpModal/OtpModal";
// import { useEffect } from "react";
// import { useState } from "react";
// function Register() {
//   const navigate = useNavigate();
//   const { lang } = useLangStore();
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [showOtpMailModal, setShowOtpMailModal] = useState(false);
//   const [registeredFormData, setRegisteredFormData] = useState(null);
//   const [locations, setLocations] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [areas, setAreas] = useState([]);

//   const [workCities, setWorkCities] = useState([]);
//   const [workAreas, setWorkAreas] = useState([]);
//   const [isWorkAddressFocused, setIsWorkAddressFocused] = useState(false);

//   useEffect(() => {
//     GetLocationList().then((data) => {
//       setLocations(data);
//       console.log("locations", data);

//       const uniqueCountries = Array.from(
//         new Set(data.map((item) => item.countryName))
//       ).map((name) => {
//         return data.find((item) => item.countryName === name);
//       });
//       setCountries(uniqueCountries);
//     });
//   }, []);

//   useEffect(() => {
//     console.log("locations", locations);
//     console.log("countries", countries);
//     console.log("cities", cities);
//     console.log("areas", areas);
//   }, [locations, countries, cities, areas]);

//   // Called when registration succeeds — opens the OTP modal
//   function handleRegisterSuccess(formData) {
//     setRegisteredFormData(formData);
//     setShowOtpModal(true);
//   }

//   const { registerMutation, verifyOtpMutation, resendOtpMutation } = useAuthMutation({
//     onRegisterSuccess: handleRegisterSuccess,
//   });

//   const RegisterSchema = Yup.object().shape({
//     firstName: Yup.string().required(langText.firstNameIsRequired[lang]),
//     middleName: Yup.string().required(langText.middleNameIsRequired[lang]),
//     lastName: Yup.string().required(langText.lastNameIsRequired[lang]),
//     email: Yup.string()
//       .email(langText.pleaseEnterAValidEmailAddress[lang])
//       // .required(langText.emailIsRequired[lang])
//       ?.trim(),
//     password: Yup.string()
//       .required(langText.PasswordIsRequired[lang])
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//         langText.passwordMustContainAtLeast8CharactersOneUppercaseOneLowercaseOneNumberAndOneSpecialCharacter[lang]
//       ),
//     mobil: Yup.string()
//       .required(langText.phoneNumberIsRequired[lang])
//       .matches(/^[0]?1[0125][0-9]{8}$/, langText.pleaseEnterAValidPhoneNumber[lang])
//       .min(10, langText.pleaseEnterAValidPhoneNumber[lang])
//       .max(11, langText.pleaseEnterAValidPhoneNumber[lang]),
//     country: Yup.string().required(langText.selectCountry[lang]),
//     city: Yup.string().required(langText.selectCity[lang]),
//     area: Yup.string().required(langText.selectArea[lang]),
//     workCountry: Yup.string().when("workAddress", {
//       is: (val) => val && val.length > 0,
//       then: (schema) => schema.required(langText.selectCountry[lang]),
//       otherwise: (schema) => schema.optional(),
//     }),
//     workCity: Yup.string().when("workAddress", {
//       is: (val) => val && val.length > 0,
//       then: (schema) => schema.required(langText.selectCity[lang]),
//       otherwise: (schema) => schema.optional(),
//     }),
//     workArea: Yup.string().when("workAddress", {
//       is: (val) => val && val.length > 0,
//       then: (schema) => schema.required(langText.selectArea[lang]),
//       otherwise: (schema) => schema.optional(),
//     }),
//     Subscribe: Yup.boolean(),
//     homeAddress: Yup.string().required(langText.addressIsRequired[lang]),
//     workAddress: Yup.string(),
//   });

//   const formik = useFormik({
//     initialValues: {
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       mobil: "",
//       countryCode: "+20",
//       country: "",
//       city: "",
//       area: "",
//       workCountry: "",
//       workCity: "",
//       workArea: "",
//       Subscribe: false,
//       homeAddress: "",
//       workAddress: "",
//     },
//     onSubmit: (values) => {

//       let data;

//       if (values?.mobil?.startsWith("0")) {
//         data = {
//           ...values,
//           mobil: values.mobil.slice(1)
//         };
//       } else {
//         data = values;
//       }

//       // Concatenate address fields: Country, City, Area, Address
//       const prefix = `${values.country}, ${values.city}, ${values.area}`;
//       const workPrefix = values.workCountry ? `${values.workCountry}, ${values.workCity}, ${values.workArea}` : "";

//       // Find the matching locations to extract IDs
//       const matchedHome = locations.find(
//         (l) => l.countryName === values.country && l.cityName === values.city && l.ariaName === values.area
//       );

//       const matchedWork = values.workAddress ? locations.find(
//         (l) => l.countryName === values.workCountry && l.cityName === values.workCity && l.ariaName === values.workArea
//       ) : null;

//       data = {
//         ...data,
//         homeAddress: `${prefix}, ${values.homeAddress}`,
//         workAddress: values.workAddress ? `${workPrefix}, ${values.workAddress}` : "",
//         customerCountryId: matchedHome?.countryID ?? null,
//         customerCityId: matchedHome?.cityID ?? null,
//         customerAreaId: matchedHome?.ariaID ?? null,
//         customerWorkCountryId: matchedWork?.countryID ?? null,
//         customerWorkCityId: matchedWork?.cityID ?? null,
//         customerWorkAreaId: matchedWork?.ariaID ?? null,
//         menuTypeId: window.location.href.includes("stella") ? 4 : 3
//       };

//       console.log("data", data);


//       registerMutation.mutate(data);
//     },
//     validationSchema: RegisterSchema,
//   });

//   // Resend OTP by re-calling the Register API with the same form data
//   function handleResendOtp(isphone) {
//     if (isphone) {
//       resendOtpMutation.mutate({
//         email: null,
//         mobil: registeredFormData?.mobil,
//         countryCode: registeredFormData?.countryCode,
//         middleName: registeredFormData?.middleName,
//         lastName: registeredFormData?.lastName,
//         firstName: registeredFormData?.firstName,
//         password: registeredFormData?.password,
//       });
//     } else {

//       if (registeredFormData) {
//         resendOtpMutation.mutate({
//           email: registeredFormData?.email,
//           mobil: registeredFormData?.mobil,
//           countryCode: registeredFormData?.countryCode,
//           middleName: registeredFormData?.middleName,
//           lastName: registeredFormData?.lastName,
//           firstName: registeredFormData?.firstName,
//           password: registeredFormData?.password,
//         });
//       }
//     }
//   }

//   return (
//     <div className="justify-center items-center flex">
//       <div className="bg-white w-full p-3 lg:max-w-[600px] mt-8">
//         <p className="text-4xl text-center py-4">
//           {langText.createAnAccount[lang]}
//         </p>
//         <div className="flex flex-col gap-6 px-7 mt-3">
//           <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
//             <FormInput
//               name="firstName"
//               handleChange={formik.handleChange}
//               handleBlur={formik.handleBlur}
//               value={formik.values.firstName}
//               errors={formik.errors.firstName}
//               touched={formik.touched.firstName}
//               type="text"
//               placeholder={langText.firstName[lang]}
//             />
//             <FormInput
//               name="middleName"
//               handleChange={formik.handleChange}
//               handleBlur={formik.handleBlur}
//               value={formik.values.middleName}
//               errors={formik.errors.middleName}
//               touched={formik.touched.middleName}
//               type="text"
//               placeholder={langText.middleName[lang]}
//             />
//             <FormInput
//               name="lastName"
//               handleChange={formik.handleChange}
//               handleBlur={formik.handleBlur}
//               value={formik.values.lastName}
//               errors={formik.errors.lastName}
//               touched={formik.touched.lastName}
//               type="text"
//               placeholder={langText.lastName[lang]}
//             />
//             <FormInput
//               name="email"
//               handleChange={formik.handleChange}
//               handleBlur={formik.handleBlur}
//               value={formik.values.email}
//               errors={formik.errors.email}
//               touched={formik.touched.email}
//               type="email"
//               placeholder={langText.emailIsOptional[lang]}
//             />
//             <FormInput
//               name="password"
//               handleChange={formik.handleChange}
//               handleBlur={formik.handleBlur}
//               value={formik.values.password}
//               errors={formik.errors.password}
//               touched={formik.touched.password}
//               type="password"
//               placeholder={langText.password[lang]}
//             />
//             <PhoneInput
//               formik={formik}
//               name="mobil"
//               defaultCountry="+20"
//             />
//             <FormInput
//               name="homeAddress"
//               handleChange={formik.handleChange}
//               handleBlur={formik.handleBlur}
//               value={formik.values.homeAddress}
//               errors={formik.errors.homeAddress}
//               touched={formik.touched.homeAddress}
//               type="text"
//               placeholder={langText.homeAddress[lang]}
//             />

//             {/* Location Dropdowns */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="flex flex-col gap-1 relative">
//                 <select
//                   name="country"
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     formik.setFieldValue("country", val);
//                     formik.setFieldValue("city", "");
//                     formik.setFieldValue("area", "");
//                     const filteredCities = Array.from(
//                       new Set(locations.filter(l => l.countryName === val).map(l => l.cityName))
//                     );
//                     setCities(filteredCities);
//                   }}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.country}
//                   className={`w-full py-3 px-4 border rounded-xl focus:outline-none focus:border-primary appearance-none transition-all ${formik.touched.country && formik.errors.country ? "border-red-500" : "border-gray-300"
//                     }`}
//                 >
//                   <option value="">{langText.selectCountry[lang]}</option>
//                   {countries.map((c) => (
//                     <option key={c.countryID} value={c.countryName}>
//                       {c.countryName}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-1 relative">
//                 <select
//                   name="city"
//                   disabled={!formik.values.country}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     formik.setFieldValue("city", val);
//                     formik.setFieldValue("area", "");
//                     const filteredAreas = locations.filter(
//                       (l) => l.countryName === formik.values.country && l.cityName === val
//                     );
//                     setAreas(filteredAreas);
//                   }}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.city}
//                   className={`w-full py-3 px-4 border rounded-xl focus:outline-none focus:border-primary appearance-none transition-all disabled:bg-gray-50 ${formik.touched.city && formik.errors.city ? "border-red-500" : "border-gray-300"
//                     }`}
//                 >
//                   <option value="">{langText.selectCity[lang]}</option>
//                   {cities.map((city, idx) => (
//                     <option key={idx} value={city}>
//                       {city}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-1 relative">
//                 <select
//                   name="area"
//                   disabled={!formik.values.city}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.area}
//                   className={`w-full py-3 px-4 border rounded-xl focus:outline-none focus:border-primary appearance-none transition-all disabled:bg-gray-50 ${formik.touched.area && formik.errors.area ? "border-red-500" : "border-gray-300"
//                     }`}
//                 >
//                   <option value="">{langText.selectArea[lang]}</option>
//                   {areas.map((area) => (
//                     <option key={area.ariaID} value={area.ariaName}>
//                       {area.ariaName}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>
//             </div>


//             <div
//               onFocus={() => setIsWorkAddressFocused(true)}
//               onBlur={(e) => {
//                 if (!e.currentTarget.contains(e.relatedTarget)) {
//                   setIsWorkAddressFocused(false);
//                 }
//               }}
//               className="flex flex-col gap-6"
//             >
//               <FormInput
//                 name="workAddress"
//                 handleChange={formik.handleChange}
//                 handleBlur={formik.handleBlur}
//                 value={formik.values.workAddress}
//                 errors={formik.errors.workAddress}
//                 touched={formik.touched.workAddress}
//                 type="text"
//                 placeholder={langText.workAddressOptional[lang]}
//               />
//               {(formik.values.workAddress || isWorkAddressFocused) && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-4">
//                   <div className="flex flex-col gap-1 relative">
//                     <select
//                       name="workCountry"
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         formik.setFieldValue("workCountry", val);
//                         formik.setFieldValue("workCity", "");
//                         formik.setFieldValue("workArea", "");
//                         const filteredCities = Array.from(
//                           new Set(locations.filter(l => l.countryName === val).map(l => l.cityName))
//                         );
//                         setWorkCities(filteredCities);
//                       }}
//                       onBlur={formik.handleBlur}
//                       value={formik.values.workCountry}
//                       className={`w-full py-3 px-4 border rounded-xl focus:outline-none focus:border-primary appearance-none transition-all ${formik.touched.workCountry && formik.errors.workCountry ? "border-red-500" : "border-gray-300"
//                         }`}
//                     >
//                       <option value="">{langText.selectCountry[lang]}</option>
//                       {countries.map((c) => (
//                         <option key={c.countryID} value={c.countryName}>
//                           {c.countryName}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-1 relative">
//                     <select
//                       name="workCity"
//                       disabled={!formik.values.workCountry}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         formik.setFieldValue("workCity", val);
//                         formik.setFieldValue("workArea", "");
//                         const filteredAreas = locations.filter(
//                           (l) => l.countryName === formik.values.workCountry && l.cityName === val
//                         );
//                         setWorkAreas(filteredAreas);
//                       }}
//                       onBlur={formik.handleBlur}
//                       value={formik.values.workCity}
//                       className={`w-full py-3 px-4 border rounded-xl focus:outline-none focus:border-primary appearance-none transition-all disabled:bg-gray-50 ${formik.touched.workCity && formik.errors.workCity ? "border-red-500" : "border-gray-300"
//                         }`}
//                     >
//                       <option value="">{langText.selectCity[lang]}</option>
//                       {workCities.map((city, idx) => (
//                         <option key={idx} value={city}>
//                           {city}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-1 relative">
//                     <select
//                       name="workArea"
//                       disabled={!formik.values.workCity}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       value={formik.values.workArea}
//                       className={`w-full py-3 px-4 border rounded-xl focus:outline-none focus:border-primary appearance-none transition-all disabled:bg-gray-50 ${formik.touched.workArea && formik.errors.workArea ? "border-red-500" : "border-gray-300"
//                         }`}
//                     >
//                       <option value="">{langText.selectArea[lang]}</option>
//                       {workAreas.map((area) => (
//                         <option key={area.ariaID} value={area.ariaName}>
//                           {area.ariaName}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="relative"></div>
//             <div className="flex items-center gap-3">
//               <label className="relative inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   name="Subscribe"
//                   id="Subscribe"
//                   onChange={formik.handleChange}
//                   checked={formik.values.Subscribe}
//                   className="peer appearance-none w-4 h-4 border border-gray-400 rounded-xs bg-neutral-secondary-medium checked:bg-primary checked:border-primary"
//                 />
//                 <span className="pointer-events-none absolute text-white text-[10px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold opacity-0 peer-checked:opacity-100">
//                   ✔
//                 </span>
//               </label>
//               <label htmlFor="Subscribe" className="text-[#6b6b6b] text-sm">
//                 {langText.SubscribeToOurNewsletter[lang]}
//               </label>
//             </div>
//             <p className="flex flex-wrap text-sm text-nowrap gap-1 text-[#6b6b6b]">
//               {langText.ByCreatingAnAccountYouAgreeToThe[lang]}{" "}
//               <a
//                 // target="_blank"
//                 // rel="noreferrer"
//                 // href="https://skyculinaire.com/privacy-policy.php"
//                 onClick={() => navigate("/privacyPolicy")}
//                 className="text-primary cursor-pointer"
//               >
//                 {langText.PrivacyPolicy[lang]}
//               </a>{" "}
//               {langText.andToThe[lang]}{" "}
//               <a
//                 // target="_blank"
//                 // rel="noreferrer"
//                 // href="https://skyculinaire.com/website-terms.php"
//                 onClick={() => navigate("/termsOfUse")}
//                 className="text-primary cursor-pointer"
//               >
//                 {langText.termsOfUse[lang]}
//               </a>
//             </p>
//             <button
//               type="submit"
//               disabled={registerMutation.isPending}
//               className="bg-primary border border-primary hover:bg-white hover:text-primary transition w-full rounded-full py-2 text-lg text-center text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {registerMutation.isPending ? (
//                 <>
//                   <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                   </svg>
//                   {lang === "AR" ? "جاري الإنشاء..." : "Creating account..."}
//                 </>
//               ) : (
//                 langText.createAnAccount[lang]
//               )}
//             </button>
//           </form>
//           <p className="my-2 text-center">
//             {langText.alreadyHaveAnAccount[lang]}{" "}
//             <a
//               onClick={() => navigate("/login")}
//               className="text-primary cursor-pointer text-nowrap"
//             >
//               {langText.login[lang]}
//             </a>
//           </p>
//         </div>
//       </div>

//       {/* OTP Verification Modal */}
//       {showOtpModal && registeredFormData && (
//         <OtpModal
//           // email={registeredFormData.email}
//           phone={() => {
//             if (registeredFormData.mobil.startsWith("0")) {
//               return `${registeredFormData.countryCode}${registeredFormData.mobil?.slice(1)}`;
//             } else {
//               return `${registeredFormData.countryCode}${registeredFormData.mobil}`;
//             }
//           }}
//           formData={registeredFormData}
//           verifyOtpMutation={verifyOtpMutation}
//           onResend={handleResendOtp}
//           onClose={() => {
//             setShowOtpModal(false)
//             if (registeredFormData.email) {
//               setShowOtpMailModal(true);
//             }
//           }}
//           isAfterRegister={true}
//         />
//       )}

//       {showOtpMailModal && registeredFormData && (
//         <OtpModal
//           email={registeredFormData.email}
//           // phone={() => {
//           //   if (registeredFormData.mobil.startsWith("0")) {
//           //     return `${registeredFormData.countryCode}${registeredFormData.mobil?.slice(1)}`;
//           //   } else {
//           //     return `${registeredFormData.countryCode}${registeredFormData.mobil}`;
//           //   }
//           // }}
//           formData={registeredFormData}
//           verifyOtpMutation={verifyOtpMutation}
//           onResend={handleResendOtp}
//           onClose={() => {
//             setShowOtpMailModal(false)
//           }}
//           isAfterRegister={true}
//         />
//       )}
//     </div>
//   );
// }

// export default Register;

import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { GetCountriesCodes } from '../../assets/apis/country/Country'
import { useQuery } from '@tanstack/react-query'
import AuthMutation from '../../assets/apis/auth/AuthMutation'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useLangStore } from '../../assets/store/langStore'
import { langText } from '../../assets/constants/lang'
import { FaSpinner } from "react-icons/fa";



function Request() {
  const { AskToRegister } = AuthMutation()
  const { lang } = useLangStore();

  const schema = yup.object().shape({
    mobil: yup
      .string()
      .required(langText.phoneNumberIsRequired[lang])
      .matches(/^[0-9]{8,14}$/, langText.pleaseEnterAValidPhoneNumber[lang]),
    //     mobil: yup.string()
    // .required(langText.phoneNumberIsRequired[lang])
    // .matches(/^[0]?1[0125][0-9]{8}$/, langText.pleaseEnterAValidPhoneNumber[lang])
    // .min(10, langText.pleaseEnterAValidPhoneNumber[lang])
    // .max(11, langText.pleaseEnterAValidPhoneNumber[lang]),

    companyAddetionalInfo: yup
      .string(),

    email: yup
      .string()
      .required(langText.emailIsRequired[lang])
      .email(langText.pleaseEnterAValidEmailAddress[lang]),

    contryID: yup
      .string()
      .required(langText.countryIsRequired[lang]),

    companyName: yup
      .string()
      .required(langText.companyNameIsRequired[lang]),

    companyPersonalName: yup
      .string()
      .required(langText.companyPersonalNameIsRequired[lang]),

  });
  const navigate = useNavigate()

  const { data: countries, isLoading } = useQuery({ queryKey: ["countries"], queryFn: GetCountriesCodes })
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    console.log("countries", countries);



  }, [countries])
  const formik = useFormik({
    initialValues: {
      mobil: "",
      companyAddetionalInfo: "",
      email: "",
      contryID: "",
      companyName: "",
      companyPersonalName: "",
      subscribe: false,
      password: "Sky@1234",
    },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      console.log("values", values);
      // return;

      AskToRegister.mutate(
        { ...values, contryID: Number(values.contryID) },
        {
          onMutate: () => {
            toast.loading(langText.loading[lang] + "...", { id: 1 });
          },
          onSuccess: (data) => {
            toast.success(langText.requestSentSuccessfully[lang], { id: 1 });
            resetForm(); // ✅ هنا صح
            setEmail(values?.email);
            setIsPopupOpen(true);
            formik.setSubmitting(false);
            // navigate("/home")
          },
          onError: (error) => {
            toast.error(
              error?.response?.data?.message?.toLowerCase() ==
                "email already registered"
                ? langText.emailAlreadyExists[lang]
                : error?.response?.data?.message?.toLowerCase() ==
                  "mobile number already registered."
                  ? langText.phoneAlreadyExists[lang]
                  : langText.failedToSendRequest[lang],
              { id: 1 },
            );
            // console.log("error", error?.response?.data?.message);
            formik.setSubmitting(false);
          },
        }
      );
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <div className="flex flex-col items-center gap-9 py-24 bg-light-gray-100 xl:px-50 lg:px-30 md:px-20 px-10 relative">
      <span onClick={() => navigate("/home")} className={`absolute left-[5%] cursor-pointer hover:scale-105 transition-all duration-300 text-lg top-[5%] lg:block text-primary hidden md:block`}>{lang == "AR" ? "اذهب للرئيسيه" : "Go To Home"}</span>

      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        viewport={{ once: true, amount: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:text-5xl text-4xl py-12 "
      >
        {lang === "AR" ? (
          <>
            طلب <span className="text-primary font-bold">القائمة الكاملة</span>
          </>
        ) : (
          <>
            FULL MENU <span className="text-primary font-bold">REQUEST</span>
          </>
        )}
      </motion.h2>

      <form onSubmit={formik.handleSubmit} className='w-full flex flex-col items-center'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col md:flex-row md:items-stretch md:gap-9"
        >
          <input
            type="text"
            placeholder={langText.companyPersonalName[lang]}
            name='companyPersonalName'
            value={formik.values.companyPersonalName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="box-border h-14 min-h-14 flex-1 min-w-0 w-full appearance-none border-0 border-b border-primary py-0 ps-0 leading-normal transition-all duration-300 focus:ps-5 focus:outline-none"
          />
          {(formik.errors.companyPersonalName && formik.touched.companyPersonalName) && <div className="w-full text-red-400 md:hidden ">{formik.errors.companyPersonalName}</div>}


          <input
            type="text"
            placeholder={langText.companyName[lang]}
            name='companyName'
            value={formik.values.companyName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="box-border h-14 min-h-14 flex-1 min-w-0 w-full appearance-none border-0 border-b border-primary py-0 ps-0 leading-normal transition-all duration-300 focus:ps-5 focus:outline-none"
          />
          {(formik.errors.companyName && formik.touched.companyName) && <div className="w-full text-red-400 md:hidden">{formik.errors.companyName}</div>}

        </motion.div>
        <div className="items-center w-full text-red-400 hidden md:flex md:gap-9">
          {<div className="flex-1 w-full">{(formik.errors.companyPersonalName && formik.touched.companyPersonalName) && formik.errors.companyPersonalName}</div>}
          {<div className="flex-1 w-full">{(formik.errors.companyName && formik.touched.companyName) && formik.errors.companyName}</div>}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full flex flex-col md:flex-row md:items-stretch md:gap-9"
        >
          <select
            name='contryID'
            value={formik.values.contryID}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className='box-border h-14 min-h-14 flex-1 min-w-0 w-full appearance-none border-0 border-b border-primary py-0 ps-0 leading-normal transition-all duration-300 focus:ps-5 focus:outline-none'>
            <option value="">{langText.selectCountry[lang]}</option>
            {countries?.length > 0 && countries.map((item) => (
              <option key={item.countryID} value={item.countryID}>
                {item.countryName + " (" + item.countryCode + ")"}
              </option>
            ))}
          </select>
          {(formik.errors.contryID && formik.touched.contryID) && <div className="w-full text-red-400 md:hidden ">{formik.errors.contryID}</div>}

          <input
            name='mobil'
            value={formik.values.mobil}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder={langText.phoneNumber[lang]}
            className="box-border h-14 min-h-14 flex-1 min-w-0 w-full appearance-none border-0 border-b border-primary py-0 ps-0 leading-normal transition-all duration-300 focus:ps-5 focus:outline-none"
          />
          {(formik.errors.mobil && formik.touched.mobil) && <div className="w-full text-red-400 md:hidden ">{formik.errors.mobil}</div>}

        </motion.div>
        <div className="items-center w-full text-red-400 hidden md:flex md:gap-9">
          {<div className="flex-1 w-full">{(formik.errors.contryID && formik.touched.contryID) && formik.errors.contryID}</div>}
          {<div className="flex-1 w-full">{(formik.errors.mobil && formik.touched.mobil) && formik.errors.mobil}</div>}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full"
        >
          <input
            type="text"
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={langText.email[lang]}
            className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
          />
        </motion.div>
        <div className="items-center w-full text-red-400 flex">
          {<div className="w-1/2">{(formik.errors.email && formik.touched.email) && formik.errors.email}</div>}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-full"
        >
          <textarea
            type="text"
            name='companyAddetionalInfo'
            value={formik.values.companyAddetionalInfo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={langText.additionalInfoOptional[lang]}
            rows={5}
            className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
          />
        </motion.div>
        <div className="items-center w-full text-red-400 flex">
          {<div className="w-1/2">{(formik.errors.companyAddetionalInfo && formik.touched.companyAddetionalInfo) && formik.errors.companyAddetionalInfo}</div>}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="py-10"
        >
          <button
            disabled={formik.isSubmitting}
            type="submit"
            className={`
    w-60 text-center text-lg rounded-full text-white py-2
    transition-all shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-105
    ${formik.isSubmitting
                ? 'bg-primary/50 cursor-not-allowed'
                : 'bg-primary hover:bg-secondary cursor-pointer'}
  `}
          >
            {formik.isSubmitting
              ? langText.sendingRequest[lang]
              : langText.sendRequest[lang]}

            {formik.isSubmitting && (
              <FaSpinner className="inline ml-2 animate-spin" />
            )}
          </button>
        </motion.div>
      </form>
      <p className="my-2 text-center">
        {langText.alreadyHaveAnAccount[lang]}{" "}
        <a
          onClick={() => navigate("/login")}
          className="text-primary cursor-pointer text-nowrap"
        >
          {langText.login[lang]}
        </a>
      </p>

      <Popup
        lang={lang}
        isOpen={isPopupOpen}
        email={email}
        onGoHome={() => {
          navigate("/home");
          setIsPopupOpen(false);
        }}
      />
    </div>
  )
}

export default Request



const translations = {
  EN: {
    title: "Thank You for Your Request",
    text1: "Your inquiry for the Sky Culinaire Full Menu has been submitted successfully.",
    emailPrefix: "A confirmation with further details and menu access has been sent to ",
    email: "[E-mail Address]",
    emailSuffix: ". Our culinary team looks forward to elevating your next flight experience.",
    button: "Go Home",
    dir: "ltr"
  },
  AR: {
    title: "شكراً لطلبك",
    text1: "تم إرسال استفسارك عن القائمة الكاملة لسكاي كولينير بنجاح.",
    emailPrefix: "تم إرسال تأكيد مع مزيد من التفاصيل ورابط الوصول إلى القائمة إلى ",
    email: "[البريد الإلكتروني]",
    emailSuffix: ". يتطلع فريق الطهي لدينا إلى الارتقاء بتجربة رحلتك القادمة.",
    button: "العودة للرئيسية",
    dir: "rtl"
  }
};

const Popup = ({ lang = 'EN', onGoHome, isOpen, email }) => {
  if (!isOpen) return null;

  const currentLang = translations[lang] || translations.EN;

  return (
    // Backdrop overlay using your secondary color with 60% opacity
    <div className="fixed inset-0 bg-[#49494A]/60 flex items-center justify-center p-5 z-[999] backdrop-blur-sm">

      {/* Popup Container Card */}
      <div
        className="bg-white max-w-[450px] w-full py-10 px-8 rounded-xl shadow-2xl text-center box-border"
        dir={currentLang.dir}
      >
        {/* Success Checkmark Icon */}
        <div className="w-[60px] h-[60px] bg-[#E5E5E5] text-[#C5A76D] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-5 select-none">
          ✓
        </div>

        {/* Heading */}
        <h2 className="text-[#49494A] text-2xl font-semibold mb-4 tracking-wide">
          {currentLang.title}
        </h2>

        {/* Paragraph 1 */}
        <p className="text-[#6b6b6b] text-[15px] leading-relaxed mb-4">
          {currentLang.text1}
        </p>

        {/* Paragraph 2 with bold email */}
        <p className="text-[#6b6b6b] text-[15px] leading-relaxed mb-4">
          {currentLang.emailPrefix}
          <strong className="text-[#49494A] font-bold">{email}</strong>
          {currentLang.emailSuffix}
        </p>

        {/* "Go Home" Call To Action Button */}
        <button
          className="block w-full bg-[#C5A76D] text-white py-3.5 px-5 text-base font-semibold rounded-lg mt-6 transition-all duration-200 hover:bg-[#b0945d] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C5A76D]/50"
          onClick={onGoHome}
        >
          {currentLang.button}
        </button>
      </div>
    </div>
  );
};

