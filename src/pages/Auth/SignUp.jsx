import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../style/Auth/SignUp.module.css";
import Button from "../../components/Common/Button";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOTP = () => {
    if (
      formData.name.trim() &&
      formData.phone.length === 10
    ) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = () => {
    console.log("Signup Data:", formData);
    console.log("OTP:", otp);
  };

  return (
    <div className={styles.signupContainer}>
      {/* LEFT FORM SECTION */}
      <div className={styles.signupLeft}>
        <div className={styles.formWrapper}>
          <p className={styles.step}>
            {otpSent ? "STEP 2 OF 2" : "STEP 1 OF 2"}
          </p>

          <h2>Create Account</h2>

          <p className={styles.subtitle}>
            Join NeedMet and connect with your local community.
          </p>

          {!otpSent ? (
            <>
              <label>Full Name</label>
              <input
                className={styles.textInput}
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />

              <label>Mobile Number</label>

              <div className={styles.phoneInput}>
                <div className={styles.countryCode}>
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
                      phone: e.target.value.replace(
                        /\D/g,
                        ""
                      ),
                    }))
                  }
                />
              </div>

              <Button
                variant="primary"
                onClick={handleSendOTP}
                disabled={
                  !formData.name ||
                  formData.phone.length !== 10
                }
                className={styles.authButton}
              >
                Send OTP
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
                  setOtp(e.target.value)
                }
              />

              <Button
                variant="primary"
                onClick={handleVerifyOTP}
                className={styles.authButton}
              >
                Create Account
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  console.log("Resend OTP")
                }
                className={styles.resendButton}
              >
                Resend OTP
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
            you agree to our
            <Link to="/terms_service"> Terms of Service </Link>
            and
            <Link to="/privacy_policy"> Privacy Policy</Link>.
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