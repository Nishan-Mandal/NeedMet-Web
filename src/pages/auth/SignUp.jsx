import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Loader } from "../../components";
import { sendOTP, verifyOTP } from "../../services/firebase/auth/authService";
import { resetRecaptcha } from "../../services/firebase/auth/recaptchaService";
import { saveUserData, getUserByPhone } from "../../services/firebase/firestore/userService";
import { useToast } from "../../contexts/toastContext";

export default function SignUp() {
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { showToast } = useToast();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOTP = async () => {
    if (isSendingOtp) return;

    try {
      setIsSendingOtp(true);

      const userData = await getUserByPhone(formData.phone);
      if (userData) {
        showToast("This phone number is already registered. Please log in instead.", "regular");
        return;
      }

      const result = await sendOTP(formData.phone);
      if (!result) {
        showToast("OTP send failed. Please try again.", "error");
        return;
      }

      setConfirmationResult(result);
      setOtpSent(true);
      setResendTimer(30);

      showToast("OTP sent successfully", "regular");
    } catch (error) {
      console.error(error);
      showToast("Failed to send OTP", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (isVerifyingOtp) return;

    if (!confirmationResult) {
      showToast("OTP session expired. Please resend OTP.", "error");
      return;
    }

    try {
      setIsVerifyingOtp(true);

      const user = await verifyOTP(confirmationResult, otp);
      await saveUserData(user, formData.name.trim(), formData.phone);

      showToast("Signed up successfully", "regular");
      Navigate("/");
    } catch (error) {
      console.error(error);
      showToast("Invalid OTP. Please check and try again.", "error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResendingOtp || resendTimer > 0) return;

    try {
      setIsResendingOtp(true);
      setOtp("");

      const result = await sendOTP(formData.phone);
      setConfirmationResult(result);
      setResendTimer(30);

      showToast("OTP resent successfully", "regular");
    } catch (error) {
      console.error(error);
      showToast("Failed to resend OTP. Try again later.", "error");
    } finally {
      setIsResendingOtp(false);
    }
  };

  useEffect(() => {
    let interval;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  useEffect(() => {
    return () => {
      resetRecaptcha();
    };
  }, []);

  return (
    <div className="min-h-[94vh] flex bg-background">
      {/* LEFT FORM SECTION */}
      <div className="flex-1 bg-background flex items-center justify-center p-10 max-[900px]:p-8 max-[488px]:p-4">
        <div className="w-full max-w-[500px] p-[3rem] max-[488px]:p-8 border border-border rounded-[14px] bg-surface shadow-sm">
          <div className="text-primary-light font-bold tracking-widest text-xs flex items-center mb-3">
            {otpSent && (
              <Button
                variant="secondary"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setConfirmationResult(null);
                  setResendTimer(0);
                }}
                className="!w-12 !h-9 mr-3"
                icon={<i className="fa-solid fa-arrow-left"></i>}
              />
            )}
            <span>
              {otpSent ? "STEP 2 OF 2" : "STEP 1 OF 2"}
            </span>
          </div>

          <h2 className="mt-3 text-[3rem] max-[900px]:text-[2.3rem] max-[488px]:text-[1.8rem] font-heading font-bold text-text-accent">
            Create Account
          </h2>

          <p className="mt-3 mb-8 text-sm sm:text-base text-text-secondary leading-relaxed">
            Join NeedMet and connect with your local community.
          </p>

          <div id="recaptcha-container" style={{ display: "none" }} />

          {!otpSent ? (
            <>
              <label className="block font-semibold mb-2.5 text-text text-sm">
                Full Name
              </label>
              <input
                className="w-full border border-border rounded-xl p-3.5 sm:p-4 text-base text-text bg-transparent mb-5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                type="text"
                maxLength={50}
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />

              <label className="block font-semibold mb-2.5 text-text text-sm">
                Mobile Number
              </label>

              <div className="flex border border-border rounded-xl overflow-hidden mb-5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <div className="p-3.5 sm:p-4 bg-background-secondary font-semibold text-text border-r border-border">
                  +91
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className="flex-1 border-none outline-none p-3.5 sm:p-4 text-base text-text bg-transparent min-w-0"
                />
              </div>

              <Button
                variant="primary"
                onClick={handleSendOTP}
                disabled={
                  !formData.name.trim() ||
                  formData.phone.length !== 10 ||
                  isSendingOtp
                }
                className="w-full"
              >
                {isSendingOtp ? (
                  <>
                    <Loader variant="button" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </>
          ) : (
            <>
              <label className="block font-semibold mb-2.5 text-text text-sm">
                Enter OTP
              </label>

              <input
                className="w-full border border-border rounded-xl p-3.5 sm:p-4 text-base text-center tracking-[0.5em] font-mono mb-5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                type="text"
                maxLength={6}
                placeholder="••••••"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                disabled={isVerifyingOtp || isResendingOtp}
              />

              <Button
                variant="primary"
                onClick={handleVerifyOTP}
                disabled={isVerifyingOtp || otp.length !== 6 || !confirmationResult}
                className="w-full"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader variant="button" />
                    Verifying...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={
                  isVerifyingOtp ||
                  isResendingOtp ||
                  resendTimer > 0
                }
                className="w-full mt-3"
              >
                {isResendingOtp ? (
                  <>
                    <Loader variant="button" />
                    Resending...
                  </>
                ) : resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </>
          )}

          <p className="mt-6 text-center text-text-secondary text-sm">
            Already have an account?
            <Link to="/login" className="text-primary font-semibold hover:text-primary-light transition-colors"> Log in</Link>
          </p>

          <p className="mt-6 text-center text-text-secondary text-xs sm:text-sm leading-relaxed">
            By creating an account,
            <br />
            you agree to our{" "}
            <Link to="/docs/terms_service" className="text-primary underline">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/docs/privacy_policy" className="text-primary underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* RIGHT DESIGN SECTION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-[#05281a] text-white p-[60px] flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute w-[420px] h-[420px] rounded-full bg-white/5 -top-[100px] -right-[120px] pointer-events-none"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/[0.04] -bottom-[100px] -left-[100px] pointer-events-none"></div>

        <div className="max-w-[520px] z-10">
          <h1 className="font-heading font-bold text-4xl lg:text-[3.5rem] leading-[1.1] mb-6">
            Become a part of NeedMet.
          </h1>

          <p className="text-white/85 text-lg leading-[1.8]">
            Discover trusted local services,
            connect with your community and
            help others find what they need.
          </p>

          <div className="mt-12 flex flex-col gap-[18px]">
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-[18px] px-[22px] py-[18px] flex items-center gap-3.5">
              <i className="fa-solid fa-location-dot text-xl text-primary-light"></i>
              <p className="text-white m-0 font-semibold">Find local services nearby</p>
            </div>

            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-[18px] px-[22px] py-[18px] flex items-center gap-3.5">
              <i className="fa-solid fa-star text-xl text-primary-light"></i>
              <p className="text-white m-0 font-semibold">Trusted reviews & ratings</p>
            </div>

            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-[18px] px-[22px] py-[18px] flex items-center gap-3.5">
              <i className="fa-solid fa-users text-xl text-primary-light"></i>
              <p className="text-white m-0 font-semibold">Grow with your community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}