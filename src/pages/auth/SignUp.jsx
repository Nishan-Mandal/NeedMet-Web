import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../style/Auth/SignUp.module.css";
import { Button, Loader } from "../../components";
import { sendOTP, verifyOTP } from "../../services/firebase/auth/authService";
import { resetRecaptcha } from "../../services/firebase/auth/recaptchaService";
import { saveUserData, getUserByPhone } from "../../services/firebase/firestore/userService";
import { useToast } from "../../contexts/toastContext";

export default function SignUp() {
  const [formData, setFormData] = useState({name: "", phone: "",});
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
      showToast("OTP session expired. Please resend OTP.", 'error');
      return;
    }

    try {
      setIsVerifyingOtp(true);

      const user = await verifyOTP(
        confirmationResult,
        otp
      );

      await saveUserData(
        user,
        formData.name.trim(),
        formData.phone
      );

      showToast('Signed up successfully', 'regular');
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
        setResendTimer(prev => prev - 1);
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
    <div className={styles.signupContainer}>

      {/* LEFT FORM SECTION */}
      <div className={styles.signupLeft}>
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

          <h2>Create Account</h2>

          <p className={styles.subtitle}>
            Join NeedMet and connect with your local community.
          </p>

          <div id="recaptcha-container" style={{ display: "none" }} />

          {!otpSent ? (
            <>
              <label className={styles.inputLabel}>Full Name</label>
              <input
                className={styles.textInput}
                type="text"
                maxLength={50}
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />

              <label className={styles.inputLabel}>Mobile Number</label>

              <div className={styles.phoneInput}>
                <div className={styles.countryCode}>+91</div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
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
              <label className={styles.inputLabel}>Enter OTP</label>

              <input
                className={styles.otpInput}
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
                className={styles.authButton}
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader variant="button" />
                    Verifying...
                  </>
                ): (
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
            Already have an account?
            <Link to="/login"> Log in</Link>
          </p>

          <p className={styles.terms}>
            By creating an account,
            <br />
            you agree to our{" "}
            <Link to="/docs/terms_service">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/docs/privacy_policy">Privacy Policy</Link>.
          </p>

        </div>
      </div>

      {/* RIGHT DESIGN SECTION */}
      <div className={styles.signupRight}>
        <div className={styles.rightContent}>
          <h1>Become a part of NeedMet.</h1>

          <p>
            Discover trusted local services,
            connect with your community and
            help others find what they need.
          </p>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <i className="fa-solid fa-location-dot"></i>
              <p>Find local services nearby</p>
            </div>

            <div className={styles.featureCard}>
              <i className="fa-solid fa-star"></i>
              <p>Trusted reviews & ratings</p>
            </div>

            <div className={styles.featureCard}>
              <i className="fa-solid fa-users"></i>
              <p>Grow with your community</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}