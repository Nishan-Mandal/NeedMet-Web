import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../style/Auth/LogIn.module.css";
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
      showToast("Failed to send OTP. Please try again.", 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (isVerifyingOtp) return;

    if (!confirmationResult) {
      showToast("OTP session expired. Please resend OTP.", 'error');
      return;
    }

    try {
      setIsVerifyingOtp(true);

      const user = await verifyOTP(
        confirmationResult,
        otp
      );
      
      showToast('Logged in successfully', 'regular');
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
      showToast("Failed to resend OTP. Try again later.", 'error');
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
    <div className={styles.loginContainer}>

      {/* LEFT SECTION */}
      <div className={styles.loginLeft}>
        <div className={styles.leftContent}>
          <h1>Connect needs with solutions.</h1>

          <p>
            A trusted local platform where communities help each other
            discover services, opportunities and support.
          </p>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <i className="fa-solid fa-users"></i>
              <p>Verified community members</p>
            </div>

            <div className={styles.featureCard}>
              <i className="fa-solid fa-bolt"></i>
              <p>Real-time listings & updates</p>
            </div>

            <div className={styles.featureCard}>
              <i className="fa-solid fa-shield"></i>
              <p>Secure OTP authentication</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className={styles.loginRight}>
        <div className={styles.formWrapper}>
          <p className={styles.step}>
            {otpSent && (
              <Button 
                variant="secondary" 
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setConfirmationResult(null);
                  setResendTimer(0);
                }}
                style={{width: '18%'}}
                icon={<i className="fa-solid fa-arrow-left"></i>}
              />
                
            )}
            <span>
              {otpSent ? 
                <>&nbsp;&nbsp;STEP 2 OF 2</> : 
                "STEP 1 OF 2"}
            </span>
          </p>

          <h2>Welcome back</h2>

          <p className={styles.subtitle}>
            {otpSent
              ? "Enter the OTP sent to your mobile number."
              : "Enter your phone number to receive a verification code."}
          </p>

          <div
            id="recaptcha-container"
            style={{ display: "none" }}
          />

          {!otpSent ? (
            <>
              <label>Mobile Number</label>

              <div className={styles.phoneInput}>
                <div className={styles.countryCode}>+91</div>

                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={10}
                  disabled={isSendingOtp}
                />
              </div>

              <Button
                variant="primary"
                disabled={
                  phone.length !== 10 ||
                  isSendingOtp
                }
                onClick={handleSendOTP}
                className={styles.authButton}
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
              <label>Enter OTP</label>

              <input
                className={styles.otpInput}
                type="text"
                maxLength={6}
                placeholder="••••••"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                disabled={
                  isVerifyingOtp ||
                  isResendingOtp
                }
              />

              <Button
                variant="primary"
                onClick={handleVerifyOTP}
                disabled={
                  isVerifyingOtp ||
                  otp.length !== 6 ||
                  !confirmationResult
                }
                className={styles.authButton}
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
                className={styles.resendButton}
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

          <p className={styles.switchAuth}>
            Don't have an account?
            <Link to="/signup"> Sign up</Link>
          </p>

          <p className={styles.terms}>
            By continuing,
            <br />
            you agree to our{" "}
            <Link to="/terms_service">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="/privacy_policy">
              
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}