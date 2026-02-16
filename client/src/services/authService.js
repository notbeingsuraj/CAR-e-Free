import { auth, db } from "../firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

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

// Create user document in Firestore (only on first login)
export const createUserProfile = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email || null,
            phone: user.phoneNumber || null,
            authProvider: user.email ? "email" : "phone",
            createdAt: serverTimestamp(),
            role: "user",
        });
        console.log("User profile created in Firestore");
    } else {
        console.log("User profile already exists");
    }

    return snap.exists() ? snap.data() : { uid: user.uid, role: "user" };
};
