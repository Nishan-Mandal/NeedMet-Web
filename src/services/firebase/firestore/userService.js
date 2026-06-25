import {
  collection,
  query,
  where,
  getDocs, 
  setDoc, 
  getDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
} from "firebase/firestore";
import { UserModel } from "../../../data/model/userModel";
import { firestore } from "../../../firebase/firebaseConfig";

export const getUserByPhone = async (phone) => {
  const q = query(
    collection(firestore, "users"),
    where("phone", "==", phone)
  );

  const snapshot = await getDocs(q);

  if (snapshot.size > 1) {
    console.error(`Data integrity issue: ${snapshot.size} users found with same phone: ${phone}`);
  }

  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];

  return UserModel.fromFirestore(docSnap);
};

export const saveUserData = async (user, name, phone) => {
  const userRef = doc(firestore, "users", user.uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const userModel = new UserModel({
      userId: user.uid,
      name,
      phone,
      role: "customer",
      kudos: 0,
      fcmToken: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      plans: [],
    });

    await setDoc(userRef, userModel.toFirestore());
  }
};