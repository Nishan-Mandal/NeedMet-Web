import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

let verifier = null;

export const getRecaptchaVerifier = () => {
  if (!verifier) {
    verifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
  }

  return verifier;
};

export const resetRecaptcha = () => {
  if (verifier) {
    try {
      verifier.clear();
    } catch (error) {
      console.error(error);
    }
  }

  verifier = null;
};