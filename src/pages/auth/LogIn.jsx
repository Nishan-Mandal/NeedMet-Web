import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Loader } from "../../components";
import { useToast } from "../../contexts/toastContext";
import { getUserByPhone } from "../../services/firebase/firestore/userService";
import { sendOTP, verifyOTP } from "../../services/firebase/auth/authService";
import { resetRecaptcha } from "../../services/firebase/auth/recaptchaService";

export default function LogIn() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { showToast } = useToast();
  const Navigate = useNavigate();

  const handleSendOTP = async () => {
    if (isSendingOtp) return;

    try {
      setIsSendingOtp(true);

      const userData = await getUserByPhone(phone);
      if (!userData) {
        showToast("This number is not registered. Please sign up first.", "regular");
        return;
      }

      const result = await sendOTP(phone);
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
      showToast("Failed to send OTP. Please try again.", "error");
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

      await verifyOTP(confirmationResult, otp);

      showToast("Logged in successfully", "regular");
      Navigate("/");
    } catch (error) {
      console.error(error);

      switch (error.code) {
        case "auth/code-expired":
          showToast("OTP has expired. Please request a new one.", "error");
          break;
        case "auth/invalid-verification-code":
          showToast("Incorrect OTP.", "error");
          break;
        default:
          showToast("Verification failed.", "error");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResendingOtp || resendTimer > 0) return;

    try {
      setIsResendingOtp(true);
      setOtp("");

      const result = await sendOTP(phone);
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
      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-[#05281a] text-white p-[60px] flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute w-[420px] h-[420px] rounded-full bg-white/5 -top-[100px] -right-[120px] pointer-events-none"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/[0.04] -bottom-[100px] -left-[100px] pointer-events-none"></div>

        <div className="max-w-[520px] z-10">
          <h1 className="font-heading font-bold text-4xl lg:text-[3.5rem] leading-[1.1] mb-6">
            Connect needs with solutions.
          </h1>

          <p className="text-white/85 text-lg leading-[1.8]">
            A trusted local platform where communities help each other
            discover services, opportunities and support.
          </p>

          <div className="mt-12 flex flex-col gap-[18px]">
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-[18px] px-[22px] py-[18px] flex items-center gap-3.5">
              <i className="fa-solid fa-users text-xl text-primary-light"></i>
              <p className="text-white m-0 font-semibold">Verified community members</p>
            </div>

            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-[18px] px-[22px] py-[18px] flex items-center gap-3.5">
              <i className="fa-solid fa-bolt text-xl text-primary-light"></i>
              <p className="text-white m-0 font-semibold">Real-time listings & updates</p>
            </div>

            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-[18px] px-[22px] py-[18px] flex items-center gap-3.5">
              <i className="fa-solid fa-shield text-xl text-primary-light"></i>
              <p className="text-white m-0 font-semibold">Secure OTP authentication</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 bg-background flex items-center justify-center p-10 max-[488px]:p-4">
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
            Welcome back
          </h2>

          <p className="mt-3 mb-8 text-sm sm:text-base text-text-secondary leading-relaxed">
            {otpSent
              ? "Enter the OTP sent to your mobile number."
              : "Enter your phone number to receive a verification code."}
          </p>

          <div id="recaptcha-container" style={{ display: "none" }} />

          {!otpSent ? (
            <>
              <label className="block font-semibold mb-2.5 text-text text-sm">
                Mobile Number
              </label>

              <div className="flex border border-border rounded-xl overflow-hidden mb-5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <div className="p-3.5 sm:p-4 bg-background-secondary font-semibold text-text border-r border-border">
                  +91
                </div>

                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={10}
                  disabled={isSendingOtp}
                  className="flex-1 border-none outline-none p-3.5 sm:p-4 text-base text-text bg-transparent min-w-0"
                />
              </div>

              <Button
                variant="primary"
                disabled={phone.length !== 10 || isSendingOtp}
                onClick={handleSendOTP}
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
                disabled={
                  isVerifyingOtp ||
                  otp.length !== 6 ||
                  !confirmationResult
                }
                className="w-full"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader variant="button" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
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
            Don't have an account?
            <Link to="/signup" className="text-primary font-semibold hover:text-primary-light transition-colors"> Sign up</Link>
          </p>

          <p className="mt-6 text-center text-text-secondary text-xs sm:text-sm leading-relaxed">
            By continuing,
            <br />
            you agree to our{" "}
            <Link to="/docs/terms_service" className="text-primary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/docs/privacy_policy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}