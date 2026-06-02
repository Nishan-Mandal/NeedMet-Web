import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../style/Auth/LogIn.module.css";
import Button from "../../components/Common/Button";

export default function LogIn() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = () => {
    console.log("Verify OTP:", otp);
  };

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
            {otpSent ? "STEP 2 OF 2" : "STEP 1 OF 2"}
          </p>

          <h2>Welcome back</h2>

          <p className={styles.subtitle}>
            {otpSent
              ? "Enter the OTP sent to your mobile number."
              : "Enter your phone number to receive a verification code."}
          </p>

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
                />
              </div>

              <Button
                variant="primary"
                disabled={phone.length !== 10}
                onClick={handleSendOTP}
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
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                variant="primary"
                onClick={handleVerifyOTP}
                className={styles.authButton}
              >
                Verify OTP
              </Button>

              <Button
                variant="outline"
                onClick={() => console.log("Resend OTP")}
                className={styles.resendButton}
              >
                Resend OTP
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
            you agree to our
            <Link to="/terms_service"> Terms of Service </Link>
            and
            <Link to="/privacy_policy"> Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}