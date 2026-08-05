import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/formInput/FormInput";
import { langText } from "../../assets/constants/lang";
import { useLangStore } from "../../assets/store/langStore";
import useAuthMutation from "../../assets/apis/auth/AuthMutation";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { HiCheckCircle, HiOutlineMail, HiEye, HiEyeOff } from "react-icons/hi";
import { useScreenViewStore } from "../../assets/store/screenViewStore";
import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";
import { motion } from "motion/react";

function Login({ onClose }) {
	const { loginMutation } = useAuthMutation(onClose ? { onClose } : {});
	const [forgetPasswordPopup, setForgetPasswordPopup] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { setForgetPassword } = useScreenViewStore();

	useEffect(() => {
		setForgetPassword(forgetPasswordPopup);
	}, [forgetPasswordPopup]);

	const navigate = useNavigate();
	const { lang } = useLangStore();

	function handelLogin(formData) {
		loginMutation.mutate({
			username: formData.userMail,
			password: formData.password,
		});
	}

	const loginSchema = Yup.object().shape({
		userMail: Yup.string()
			.email(langText.pleaseEnterAValidEmailAddress[lang])
			.required(langText.emailIsRequired[lang])
			?.trim(),
		password: Yup.string()
			.required(langText.PasswordIsRequired[lang])
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&-_])[A-Za-z\d@$!%#*?&-_]{8,}$/,
				langText.passwordMustContainAtLeast8CharactersOneUppercaseOneLowercaseOneNumberAndOneSpecialCharacter[lang]
			),
	});

	const formik = useFormik({
		initialValues: {
			userMail: "",
			password: "",
		},
		validationSchema: loginSchema,
		onSubmit: (values) => {
			handelLogin(values);
		},
	});

	return (
		<div className={`${onClose ? "w-full p-2" : "flex flex-col items-center gap-9 py-24 bg-light-gray-100 xl:px-50 lg:px-30 md:px-20 px-10 relative"}`}>
			<span onClick={() => navigate("/home")} className={`absolute left-[5%] cursor-pointer hover:scale-105 transition-all duration-300 text-lg top-[5%] text-primary ${onClose ? "hidden md:hidden" : "hidden md:block"}`}>{lang == "AR" ? "اذهب للرئيسيه" : "Go To Home"}</span>
			<div className={`w-full mx-auto max-w-md ${forgetPasswordPopup && "hidden"}`}>
				<motion.h2
					initial={{ opacity: 0, y: 50 }}
					viewport={{ once: true, amount: 0.3 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className={`text-center font-normal ${onClose ? "text-3xl py-4" : "md:text-5xl text-4xl py-12"}`}
				>
					{lang === "AR" ? (
						<>
							تسجيل <span className="text-primary font-bold">الدخول</span>
						</>
					) : (
						<>
							USER <span className="text-primary font-bold">LOGIN</span>
						</>
					)}
				</motion.h2>

				<form onSubmit={formik.handleSubmit} className="w-full flex flex-col items-center gap-6 mt-3">
					{/* Email Input */}
					<div className="w-full">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							viewport={{ once: true, amount: 0.3 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="w-full"
						>
							<input
								type="text"
								name="userMail"
								value={formik.values.userMail}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder={langText.email[lang]}
								className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
							/>
						</motion.div>
						<div className="w-full text-red-400 flex mt-1">
							{formik.errors.userMail && formik.touched.userMail && (
								<span className="text-xs">{formik.errors.userMail}</span>
							)}
						</div>
					</div>

					{/* Password Input */}
					<div className="w-full">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							viewport={{ once: true, amount: 0.3 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="w-full relative"
						>
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={formik.values.password}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder={langText.password[lang]}
								className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none pe-10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition"
							>
								{showPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
							</button>
						</motion.div>
						<div className="w-full text-red-400 flex mt-1">
							{formik.errors.password && formik.touched.password && (
								<span className="text-xs">{formik.errors.password}</span>
							)}
						</div>
					</div>

					{/* Forgot Password Trigger & Submit Button */}
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						viewport={{ once: true, amount: 0.3 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="w-full flex flex-col items-center gap-4 mt-2"
					>
						<button
							onClick={() => setForgetPasswordPopup(true)}
							type="button"
							className="w-fit cursor-pointer text-gray-500 hover:text-primary transition text-sm self-start"
						>
							{langText.forgotPassword[lang]}
						</button>

						<button
							type="submit"
							disabled={loginMutation.isLoading}
							className="bg-primary w-60 text-center text-lg rounded-full text-white py-2 cursor-pointer hover:bg-secondary transition-all shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{loginMutation.isLoading ? (
								<>
									<svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
									</svg>
									{lang === "AR" ? "جاري تسجيل الدخول..." : "Logging in..."}
								</>
							) : (
								langText.login[lang]
							)}
						</button>
					</motion.div>
				</form>

				<motion.p
					initial={{ opacity: 0, y: 50 }}
					viewport={{ once: true, amount: 0.3 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="my-6 text-center text-gray-600"
				>
					{langText.dontHaveAnAccount[lang]}{" "}
					<a
						onClick={() => {
							navigate("/register");
							onClose && onClose();
						}}
						className="text-primary cursor-pointer text-nowrap hover:underline font-semibold"
					>
						{langText.requestToCreateAnAccount[lang]}
					</a>
				</motion.p>
			</div>
			{forgetPasswordPopup &&
				<ForgetPasswordPopup lang={lang} onClose={() => setForgetPasswordPopup(false)} />
			}

		</div>
	);
}

export default Login;

function ForgetPasswordPopup({ lang, onClose }) {
	const { ForgetPasswordMutation } = useAuthMutation({});
	const [isDone, setIsDone] = useState(false);

	const forgetPasswordSchema = Yup.object().shape({
		userMail: Yup.string()
			.required(langText.emailIsRequired[lang])
			.email(langText.pleaseEnterAValidEmailAddress[lang]),
	});

	const formik = useFormik({
		initialValues: { userMail: "" },
		validationSchema: forgetPasswordSchema,
		onSubmit: (values) => {
			ForgetPasswordMutation.mutate(values.userMail, {
				onMutate: () => {
					onlineOrderToast.loading(langText.loading[lang]);
				},
				onSuccess: () => {
					onlineOrderToast.success(langText.emailSentSuccessfully[lang]);
					setIsDone(true);
				},
				onError: () => {
					onlineOrderToast.error(langText.SomethingWentWrongPleaseTryAgainLater[lang]);
				}
			});


		},

	});

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
			<div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 animate-scaleIn">

				{/* Close */}
				<div className="flex justify-end">
					<IoMdClose
						onClick={onClose}
						className="text-xl cursor-pointer text-gray-400 hover:text-black transition"
					/>
				</div>

				{/* Content */}
				<div className="flex flex-col items-center gap-4 text-center px-2">

					{!isDone ? (
						<>
							<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
								<HiOutlineMail className="text-primary text-2xl" />
							</div>

							<h2 className="text-2xl font-semibold">
								{langText.forgotPassword[lang]}
							</h2>

							<p className="text-gray-500 text-sm">
								{langText.enterYourEmailAddress[lang]}
							</p>

							<form
								onSubmit={formik.handleSubmit}
								className="w-full flex flex-col gap-5 mt-4"
							>
								<FormInput
									name="userMail"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									value={formik.values.userMail}
									errors={formik.errors.userMail}
									touched={formik.touched.userMail}
									type="email"
									placeholder={langText.enterYourEmailAddress[lang]}
								/>

								<button
									type="submit"
									disabled={ForgetPasswordMutation.isLoading}
									className="bg-primary text-white rounded-full py-2.5 text-lg font-medium
                             hover:bg-primary/90 transition disabled:opacity-50"
								>
									{ForgetPasswordMutation.isLoading
										? langText.loading[lang] || "Sending..."
										: langText.confirm[lang]}
								</button>
							</form>
						</>
					) : (
						<>
							<HiCheckCircle className="text-green-500 text-6xl" />

							<h2 className="text-2xl font-semibold">
								{langText.emailSentSuccessfully[lang]}
							</h2>

							<p className="text-gray-500">
								{langText.checkYourEmail[lang]}
							</p>

							<button
								onClick={onClose}
								className="mt-4 text-primary font-medium hover:underline"
							>
								{langText.close[lang] || "Close"}
							</button>
						</>
					)}

				</div>
			</div>
		</div>
	);
}





















// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import FormInput from "../../components/formInput/FormInput";
// import { langText } from "../../assets/constants/lang";
// import { useLangStore } from "../../assets/store/langStore";
// import useAuthMutation from "../../assets/apis/auth/AuthMutation";
// import PhoneInput from "../../components/formInput/PhoneInput";
// import { parsePhoneNumberFromString } from "libphonenumber-js";
// import { useEffect, useState } from "react";
// import { IoMdClose } from "react-icons/io";
// import { HiCheckCircle, HiOutlineMail } from "react-icons/hi";
// import { useScreenViewStore } from "../../assets/store/screenViewStore";
// import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";

// function Login({ onClose }) {
// 	const [loginType, setLoginType] = useState("email");
// 	const { loginMutation } = useAuthMutation(onClose ? { onClose } : {});
// 	const [forgetPasswordPopup, setForgetPasswordPopup] = useState(false);
// 	const { setForgetPassword } = useScreenViewStore();
// 	useEffect(() => {
// 		setForgetPassword(forgetPasswordPopup);
// 	}, [forgetPasswordPopup]);

// 	const navigate = useNavigate();
// 	const { lang } = useLangStore();
// 	function handelLogin(formData) {
// 		console.log({ ...formData, mobil: `${formData.countryCode}${formData.phone}` });
// 		loginMutation.mutate(
// 			loginType === "phone" ? { userPhone: `${formData.countryCode}${formData.phone}`, password: formData.password, userMail: "" } :
// 				{ userMail: formData.userMail, password: formData.password, userPhone: "" },
// 		);
// 	}
// 	const loginSchema = loginType === "phone" ? Yup.object().shape({
// 		phone: Yup.string()
// 			.required(langText.phoneNumberIsRequired[lang])
// 			.matches(/^[0]?1[0125][0-9]{8}$/, langText.pleaseEnterAValidPhoneNumber[lang])
// 			.min(10, langText.pleaseEnterAValidPhoneNumber[lang])
// 			.max(11, langText.pleaseEnterAValidPhoneNumber[lang]),
// 		password: Yup.string()
// 			.required(langText.PasswordIsRequired[lang])
// 			.matches(
// 				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
// 				langText.passwordMustContainAtLeast8CharactersOneUppercaseOneLowercaseOneNumberAndOneSpecialCharacter[lang]
// 			)?.trim(),
// 	}) : Yup.object().shape({
// 		userMail: Yup.string().email(langText.pleaseEnterAValidEmailAddress[lang]).required(langText.emailIsRequired[lang])?.trim(),
// 		password: Yup.string()
// 			.required(langText.PasswordIsRequired[lang])
// 			.matches(
// 				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
// 				langText.passwordMustContainAtLeast8CharactersOneUppercaseOneLowercaseOneNumberAndOneSpecialCharacter[lang]
// 			),
// 	})
// 	const formik = useFormik({
// 		initialValues: {
// 			phone: "",
// 			countryCode: "+20",
// 			userMail: "",
// 			password: "",
// 		},
// 		validationSchema: loginSchema,
// 		onSubmit: (values) => {
// 			let data;

// 			if (values?.phone?.startsWith("0")) {
// 				data = {
// 					...values,
// 					phone: values.phone.slice(1)
// 				};
// 			} else {
// 				data = values;
// 			}
// 			handelLogin(data);
// 		},
// 	});

// 	return (
// 		<div className="justify-center items-center flex">
// 			<div className={`bg-white w-full p-3 lg:max-w-[600px] mt-8 ${forgetPasswordPopup && "hidden"}`}>

// 				<p className="text-4xl text-center py-4 ">{langText.login[lang]}</p>
// 				<div className="flex flex-col gap-6 px-2 md:px-7 mt-3">
// 					{/* <button className="cursor-pointer flex border h-9 w-full items-center border-[#e5e5e5] text-[#212529]">
//             <img src="/images/icon_goolge.svg" className="aspect-square h-full" alt="google" />
//             <p className="flex-1 text-center text-sm">{langText.CotinueWithGoogle[lang]}</p>
//           </button>
//           <button className="cursor-pointer flex border h-9 w-full items-center py-1 pl-2 bg-[#5777b9] border-[#5777b9] text-[#212529]">
//             <img src="/images/icon_fb.svg" className="aspect-square h-full" alt="facebook" />
//             <p className="flex-1 text-white text-center text-sm">{langText.CotinueWithFacebook[lang]}</p>
//           </button>
//           <p className="text-center text-[#262626] py-3 relative after:absolute after:w-[45%] after:h-px after:bg-[#e5e5e5] after:top-1/2 after:right-0 after:-translate-y-1/2 before:absolute before:w-[45%] before:h-px before:bg-[#e5e5e5] before:top-1/2 before:left-0 before:-translate-y-1/2">{langText.or[lang]}</p> */}

// 					<div className="flex items-end justify-center gap-9 py-6">
// 						<button type="button" onClick={() => setLoginType("phone")} className={`border-0 border-b w-1/2 cursor-pointer py-2 hover:text-primary hover:border-primary hover:scale-105 transition duration-400 text-xs md:text-sm  ${loginType === "phone" ? "text-primary border-primary" : ""}`}>{langText.LoginWithPhone[lang]}</button>
// 						<button type="button" onClick={() => setLoginType("email")} className={`border-0 border-b w-1/2 cursor-pointer py-2 hover:text-primary hover:border-primary hover:scale-105 transition duration-400 text-xs md:text-sm ${loginType === "email" ? "text-primary border-primary" : ""}`}>{langText.LoginWithEmail[lang]}</button>
// 					</div>
// 					<form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">

// 						{loginType === "phone" &&
// 							<PhoneInput
// 								formik={formik}
// 								name="phone"
// 								defaultCountry="+20"
// 							/>
// 						}
// 						{loginType === "email" &&
// 							<FormInput
// 								name="userMail"
// 								handleChange={formik.handleChange}
// 								handleBlur={formik.handleBlur}
// 								value={formik.values.userMail}
// 								errors={formik.errors.userMail}
// 								touched={formik.touched.userMail}
// 								type="text"
// 								placeholder={langText.email[lang]}
// 							/>
// 						}
// 						<FormInput
// 							name="password"
// 							handleChange={formik.handleChange}
// 							handleBlur={formik.handleBlur}
// 							value={formik.values.password}
// 							errors={formik.errors.password}
// 							touched={formik.touched.password}
// 							type="password"
// 							placeholder={langText.password[lang]}
// 						/>
// 						<button onClick={() => {
// 							setForgetPasswordPopup(true)
// 						}} type="button" className="w-fit cursor-pointer text-[#6b6b6b] text-sm mt-2">{langText.forgotPassword[lang]}</button>
// 						<button type="submit" className="bg-primary border border-primary hover:bg-white hover:text-primary transition w-full rounded-full py-2 text-lg text-center text-white cursor-pointer ">
// 							{langText.login[lang]}
// 						</button>
// 					</form>
// 					<p className="my-2 text-center">
// 						{langText.dontHaveAnAccount[lang]}{" "}
// 						<a
// 							onClick={() => {
// 								navigate("/register");
// 								onClose();
// 							}}
// 							className="text-primary cursor-pointer text-nowrap"
// 						>
// 							{langText.createAnAccount[lang]}
// 						</a>
// 					</p>
// 				</div>
// 			</div>
// 			{forgetPasswordPopup &&
// 				<ForgetPasswordPopup lang={lang} onClose={() => setForgetPasswordPopup(false)} />
// 			}
// 		</div>
// 	);
// }

// export default Login;

// function ForgetPasswordPopup({ lang, onClose }) {
// 	const { ForgetPasswordMutation } = useAuthMutation({});
// 	const [isDone, setIsDone] = useState(false);

// 	const forgetPasswordSchema = Yup.object().shape({
// 		userMail: Yup.string()
// 			.required(langText.emailIsRequired[lang])
// 			.email(langText.pleaseEnterAValidEmailAddress[lang]),
// 	});

// 	const formik = useFormik({
// 		initialValues: { userMail: "" },
// 		validationSchema: forgetPasswordSchema,
// 		onSubmit: (values) => {
// 			ForgetPasswordMutation.mutate(values.userMail, {
// 				onMutate: () => {
// 					onlineOrderToast.loading(langText.loading[lang]);
// 				},
// 				onSuccess: () => {
// 					onlineOrderToast.success(langText.emailSentSuccessfully[lang]);
// 					setIsDone(true);
// 				},
// 				onError: () => {
// 					onlineOrderToast.error(langText.SomethingWentWrongPleaseTryAgainLater[lang]);
// 				}
// 			});


// 		},

// 	});

// 	return (
// 		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
// 			<div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 animate-scaleIn">

// 				{/* Close */}
// 				<div className="flex justify-end">
// 					<IoMdClose
// 						onClick={onClose}
// 						className="text-xl cursor-pointer text-gray-400 hover:text-black transition"
// 					/>
// 				</div>

// 				{/* Content */}
// 				<div className="flex flex-col items-center gap-4 text-center px-2">

// 					{!isDone ? (
// 						<>
// 							<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
// 								<HiOutlineMail className="text-primary text-2xl" />
// 							</div>

// 							<h2 className="text-2xl font-semibold">
// 								{langText.forgotPassword[lang]}
// 							</h2>

// 							<p className="text-gray-500 text-sm">
// 								{langText.enterYourEmailAddress[lang]}
// 							</p>

// 							<form
// 								onSubmit={formik.handleSubmit}
// 								className="w-full flex flex-col gap-5 mt-4"
// 							>
// 								<FormInput
// 									name="userMail"
// 									handleChange={formik.handleChange}
// 									handleBlur={formik.handleBlur}
// 									value={formik.values.userMail}
// 									errors={formik.errors.userMail}
// 									touched={formik.touched.userMail}
// 									type="email"
// 									placeholder={langText.enterYourEmailAddress[lang]}
// 								/>

// 								<button
// 									type="submit"
// 									disabled={ForgetPasswordMutation.isLoading}
// 									className="bg-primary text-white rounded-full py-2.5 text-lg font-medium
//                              hover:bg-primary/90 transition disabled:opacity-50"
// 								>
// 									{ForgetPasswordMutation.isLoading
// 										? langText.loading[lang] || "Sending..."
// 										: langText.confirm[lang]}
// 								</button>
// 							</form>
// 						</>
// 					) : (
// 						<>
// 							<HiCheckCircle className="text-green-500 text-6xl" />

// 							<h2 className="text-2xl font-semibold">
// 								{langText.emailSentSuccessfully[lang]}
// 							</h2>

// 							<p className="text-gray-500">
// 								{langText.checkYourEmail[lang]}
// 							</p>

// 							<button
// 								onClick={onClose}
// 								className="mt-4 text-primary font-medium hover:underline"
// 							>
// 								{langText.close[lang] || "Close"}
// 							</button>
// 						</>
// 					)}

// 				</div>
// 			</div>
// 		</div>
// 	);
// }
