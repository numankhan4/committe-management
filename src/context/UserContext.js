import React, { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, firestore, storage } from '../firebase';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

export const AuthContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null); // State to store user's name
  const [userRole, setUserRole] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null); // State to store user's profile picture URL


  const googleProvider = new GoogleAuthProvider();

  const createUser = async (email, password, name, profilePicture) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = result.user;

      // Additional logic (e.g., saving user info to Firestore and uploading profile picture)
      await saveUserInfoToFirestore(newUser, name, profilePicture);

      // Send email verification after user creation
      await sendEmailVerification(newUser);

      return result;
    } catch (error) {
      throw error;
    }
  };

  const saveUserInfoToFirestore = async (user, name, profilePicture) => {
    const usersCollection = collection(firestore, 'users');
    const userDoc = doc(usersCollection, user.uid);

    // Upload profile picture if provided
    let profilePictureUrl = '';
    if (profilePicture) {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, profilePicture);
      profilePictureUrl = await storageRef.getDownloadURL();
      setProfilePictureUrl(profilePictureUrl); // Update profile picture URL state
    }

    // Save user information to Firestore, including profile picture URL
    await setDoc(userDoc, {
      name: name,
      email: user.email,
      approved: false, // Set to false by default, indicating not yet approved
      profilePictureUrl: profilePictureUrl,
    });
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    return signOut(auth);
  };

  // Fetch user's name and profile picture URL from Firestore based on their UID
  const fetchUserDataFromFirestore = async (uid) => {
    const userDocRef = doc(firestore, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setUserName(userData.name); // Set user's name state
      setUserRole(userData.role)
      setProfilePictureUrl(userData.profilePictureUrl); // Set user's profile picture URL state
    }
  };

  // Fetch user's name and profile picture URL from Firestore when user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserDataFromFirestore(currentUser.uid);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Provide user's name and profile picture URL along with other context data
  const authInfo = { user, loading, createUser, signIn, logOut, signInWithGoogle, userName,userRole, profilePictureUrl };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default UserContext;
