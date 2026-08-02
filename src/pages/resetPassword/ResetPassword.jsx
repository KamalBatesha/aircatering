import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAuthMutation from "../../assets/apis/auth/AuthMutation";
import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";
import { useLangStore } from "../../assets/store/langStore";
import { langText } from "../../assets/constants/lang";

export default function ResetPassword() {
  const [show, setShow] = useState({ pwd: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const query = window.location.search.substring(1);

  const params = query.split("&").reduce((acc, item) => {
    const [key, value] = item.split("=");
    acc[key] = value;
    return acc;
  }, {});

  const token = params.token; // still encoded (%2B)
  const email = decodeURIComponent(params.email);

  console.log("token from query:", token);
  console.log("email from query:", email);
  const navigate = useNavigate();
  const { lang } = useLangStore();

  const { reEnterPasswordMutation } = useAuthMutation();


  // Validation schema
  const passwordSchema = Yup.string()
    .required(langText.PasswordIsRequired[lang])
    .min(8, langText.PasswordMustBeAtLeast8Characters[lang])
    .matches(/(?=.*[a-z])/, langText.MustContainALowercaseLetter[lang])
    .matches(/(?=.*[A-Z])/, langText.MustContainAUppercaseLetter[lang])
    .matches(/(?=.*\d)/, langText.MustContainANumber[lang])
    .matches(/(?=.*[@$!%*?&])/, langText.MustContainASpecialCharacter[lang]);

  const schema = Yup.object().shape({
    password: passwordSchema,
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], langText.PasswordsMustMatch[lang])
      .required(langText.ConfirmPasswordIsRequired[lang]),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setServerError(null);
      setLoading(true);
      try {
        reEnterPasswordMutation.mutate({ password: values.password, token, email }, {
          onSuccess: () => {
            console.log("success");

            setSuccess(true);
            resetForm();
            onlineOrderToast.success(langText.PasswordUpdatedSuccessfully[lang]);
            navigate("/login");
          },
          onError: (error) => {
            setServerError(error?.message || langText.SomethingWentWrongPleaseTryAgainLater[lang]);
            onlineOrderToast.error(langText.SomethingWentWrongPleaseTryAgainLater[lang]);
            console.log(error);


          },
        });
      } catch (err) {
        console.log(err);

        setServerError(err?.message || langText.SomethingWentWrongPleaseTryAgainLater[lang]);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  // simple password-strength heuristic
  const calcStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;
    return score; // 0..5
  };

  const strengthScore = calcStrength(formik.values.password);
  const strengthPercent = Math.round((strengthScore / 5) * 100);
  const strengthLabel = [langText.VeryWeak[lang], langText.Weak[lang], langText.Okay[lang], langText.good[lang], langText.strong[lang]][Math.max(0, Math.min(4, strengthScore - 1))] || "Too short";

  return (
    <div className="flex items-center justify-center min-h-screen px-5">

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-light-gray p-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">{langText.ResetPassword[lang]}</h2>
        <p className="text-sm text-gray-500 mb-4">{langText.ChooseAStrongPasswordForYourAccount[lang]}</p>

        {/* {serverError && (
        <div role="alert" aria-live="assertive" className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
          {serverError}
        </div>
      )} */}

        {success ? (
          <div role="status" aria-live="polite" className="p-4 rounded bg-green-50 text-green-800 text-center">
            {langText.PasswordUpdatedSuccessfully[lang]}
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{langText.newPassword[lang]}</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show.pwd ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.password && !!formik.errors.password}
                  aria-describedby="password-help password-error"
                  className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-60 ${formik.touched.password && formik.errors.password ? "border-red-300" : "border-gray-200"
                    }`}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, pwd: !s.pwd }))}
                  className="absolute inset-y-0 end-2 flex items-center px-2 text-gray-500"
                  aria-label={show.pwd ? "Hide password" : "Show password"}
                >
                  {show.pwd ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>

              <div id="password-help" className="mt-2 text-xs text-gray-500">
                {langText.UseAtLeast8CharactersIncludingUppercaseLowercaseNumberAndSpecialCharacter[lang]}
              </div>

              {formik.touched.password && formik.errors.password && (
                <div id="password-error" className="mt-2 text-xs text-red-600">{formik.errors.password}</div>
              )}

              {/* strength meter */}
              <div className="mt-3">
                <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{ width: `${strengthPercent}%`, background: strengthScore <= 2 ? '#f87171' : strengthScore === 3 ? '#fbbf24' : '#34d399' }}
                  />
                </div>
                <div className="text-xs mt-1 text-gray-600">{langText.Strength[lang]}: {strengthPercent}% {strengthScore >= 4 ? `— ${strengthLabel}` : ""}</div>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">{langText.confirmPassword[lang]}</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={show.confirm ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                  aria-describedby="confirm-error"
                  className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-60 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-300" : "border-gray-200"
                    }`}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                  className="absolute inset-y-0 end-2 flex items-center px-2 text-gray-500"
                  aria-label={show.confirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {show.confirm ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>

              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div id="confirm-error" className="mt-2 text-xs text-red-600">{formik.errors.confirmPassword}</div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={loading || !formik.isValid || !formik.dirty}
                className={`flex-1 rounded-full py-2 px-4 text-white font-medium transition disabled:opacity-60 ${loading || !formik.isValid || !formik.dirty ? 'bg-primary/60' : 'bg-primary hover:bg-primary-dark'
                  }`}
              >
                {loading ? langText.saving[lang] : langText.SetNewPassword[lang]}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
