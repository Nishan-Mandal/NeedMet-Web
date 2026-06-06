import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { getRecaptchaVerifier } from "./recaptchaService";

export const sendOTP = async (phone) => {
  const appVerifier = getRecaptchaVerifier();

  return await signInWithPhoneNumber(
    auth,
    `+91${phone}`,
    appVerifier
  );
};

export const verifyOTP = async (
  confirmationResult,
  otp
) => {
  const result =
    await confirmationResult.confirm(otp);

  return result.user;
};