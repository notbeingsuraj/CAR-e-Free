import { auth } from "../firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

let confirmationResult = null;

export const sendOtp = async (phone) => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            { size: "invisible" }
        );
    }

    confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
    );

    return true;
};

export const verifyOtp = async (otp) => {
    if (!confirmationResult) {
        throw new Error("OTP not requested");
    }

    const result = await confirmationResult.confirm(otp);
    return result.user;
};
