import { useMutation } from "@tanstack/react-query";
import { addAddress, ForgetPassword, LoginAuth, reEnterPassword, Register, VerifyOtp, updateAccessToken, updateMyAddress, UpdateMyInfo, UpdateMySettings, UpdateMyPassword, resendOtp, SubscribeNewsletter } from "./AuthApi";
// import { onlineOrderToast } from "../onlineOrderToast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { langText } from "../../constants/lang";
import { useLangStore } from "../../store/langStore";
import useGreetingStore from "../../store/greetingStore";
import { onlineOrderToast } from "../../Helpers/onlineOrderToast";

function useAuthMutation({ onClose, onRegisterSuccess } = {}) {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { clearCart } = useCartStore();
  const { lang } = useLangStore();

  const AskToRegister = useMutation({
    mutationKey: "register",
    mutationFn: (data) => Register(data),
    onSuccess: (data) => {
      console.log("success data", data);

    }

  })

  // Step 2: Verify OTP → Login → Save Addresses
  const verifyOtpMutation = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async ({ otp, formData, email, phone }) => {
      // 1️⃣ Verify OTP
      await VerifyOtp(email, phone, otp);

      // 2️⃣ Login with credentials
      const loginRes = await LoginAuth({
        userPhone: `${formData.countryCode}${formData.mobil}`,
        password: formData.password,
        userMail: "",
      });

      // 3️⃣ Save user data
      login(loginRes);

      // 4️⃣ Prepare addresses
      const addresses = [
        {
          customerAddressData: formData.homeAddress,
          customerAddressType: "Home Address",
          customerAddressCountryId: formData.customerCountryId ?? null,
          customerAddressCityId: formData.customerCityId ?? null,
          customerAddressCityAreaId: formData.customerAreaId ?? null,
        },
      ];
      if (formData.workAddress) {
        addresses.push({
          customerAddressData: formData.workAddress,
          customerAddressType: "Work Address",
          customerAddressCountryId: formData.customerWorkCountryId ?? null,
          customerAddressCityId: formData.customerWorkCityId ?? null,
          customerAddressCityAreaId: formData.customerWorkAreaId ?? null,
        });
      }

      // 5️⃣ Save addresses (authenticated)
      await addAddress(addresses);

      return loginRes;
    },
    onSuccess: (data, variables) => {
      console.log("success data", data);
      console.log("success variables", variables);
      if (variables?.isAfterRegister && variables?.email) {
        return;
      }

      const { showGreeting } = useGreetingStore.getState();
      showGreeting("thankYou");

      onlineOrderToast.success(langText.accountVerifiedSuccessfully?.[lang] || "Account verified successfully!");
      clearCart();
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      // Error display is handled by the OtpModal via the mutation's onError callback option
    },
  });


  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => LoginAuth(data),
    onSuccess: (data) => {
      const { showGreeting } = useGreetingStore.getState();
      // Try to get first name from response data if available (e.g., data.customerFirstName)
      const firstName = data?.customerFirstName || data?.firstName || data?.userName || null;
      // showGreeting("welcome", firstName);

      login(data);
      console.log("dataLogin", data);
      onlineOrderToast.dismiss();

      if (onClose) onClose();
      clearCart();
      if (data?.roles?.includes("Marketing")) {
        navigate("/admin")
        return;
      }
      navigate("/home");
    },
    onMutate: () => {
      onlineOrderToast.loading(langText.loading[lang]);
    },
    onError: (res) => {
      if (res?.response?.data == "User Not Found") {
        onlineOrderToast.error(langText.invalidEmailOrPassword[lang]);
      } else {
        console.log(res);
        onlineOrderToast.error(langText.failedToLogin[lang]);
      }
    },
  });

  const loginRefreshMutation = useMutation({
    mutationKey: ["loginRefresh"],
    mutationFn: () => updateAccessToken(),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      login(data);
    },
    onError: () => {
      onlineOrderToast.error(langText.pleaseLoginAgain[lang]);
      navigate("/login");
    },
  });

  const resendOtpMutation = useMutation({
    mutationKey: ["resendOtp"],
    mutationFn: (data) => resendOtp(data),
    onSuccess: (data) => {
      onlineOrderToast.success(langText.otpResentSuccessfully[lang]);
    },
    onError: () => {
      onlineOrderToast.error(langText.failedToResendOtp[lang]);
    },
  });

  const editMutation = useMutation({
    mutationKey: ["edit-password"],
    mutationFn: (data) => UpdateMyPassword(data),
    onMutate: () => {
      onlineOrderToast.loading(langText.UpdatingPassword[lang]);
    },
  });

  const editMyInfoMutation = useMutation({
    mutationKey: ["edit-myinfo"],
    mutationFn: (data) => UpdateMyInfo(data),
    onMutate: () => {
      onlineOrderToast.loading(langText.updatingProfile[lang], { id: "1" });
    },
  });

  const editMySettingsMutation = useMutation({
    mutationKey: ["edit-mysettings"],
    mutationFn: (data) => UpdateMySettings(data),

  });
  const editMyAddressMutation = useMutation({
    mutationKey: ["edit-myaddress"],
    mutationFn: ({ data }) => updateMyAddress(data),
    onMutate: () => {
      onlineOrderToast.loading(langText.updatingAddress[lang]);
    },
  });
  const ForgetPasswordMutation = useMutation({
    mutationKey: ["forget-password"],
    mutationFn: (data) => ForgetPassword(data),
  });

  const reEnterPasswordMutation = useMutation({
    mutationKey: ["reEnterPassword"],
    mutationFn: ({ password, token, email }) => reEnterPassword(email, token, password),
  });

  const subscribeMutation = useMutation({
    mutationKey: ["subscribe-newsletter"],
    mutationFn: (status) => SubscribeNewsletter(status),

  });


  return {
    // registerMutation,
    verifyOtpMutation,
    loginMutation,
    loginRefreshMutation,
    editMutation,
    editMyInfoMutation,
    editMySettingsMutation,
    editMyAddressMutation,
    ForgetPasswordMutation,
    reEnterPasswordMutation,
    resendOtpMutation,
    subscribeMutation,
    AskToRegister

  }
}
export default useAuthMutation
