import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { storage, firestore } from '../firebase';

export const uploadPaymentScreenshot = async (memberId, paymentScreenshot) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const storageRef = ref(
      storage,
      `payment-screenshots/${currentYear}/${currentMonth}/${memberId}/${paymentScreenshot.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, paymentScreenshot);

    await uploadTask;

    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading payment screenshot:', error.message);
    throw error;
  }
};

export const verifyPaymentStatus = async (payeeUser, member) => {

    try {
      if (!payeeUser || !member || !member.id) {
        throw new Error('Invalid payeeUser or member.');
      }
  
      const payeeUserDocRef = doc(firestore, 'users', payeeUser.id);
      const payeeUserDocSnapshot = await getDoc(payeeUserDocRef);
  
      if (!payeeUserDocSnapshot.exists()) {
        throw new Error('Payee user document does not exist.');
      }
  
      const payeeUserPayment = payeeUserDocSnapshot.data().payment || {};
  
      const memberDocRef = doc(firestore, 'users', member.id);
      const memberDocSnapshot = await getDoc(memberDocRef);
  
      if (!memberDocSnapshot.exists()) {
        throw new Error('Member document does not exist.');
      }
  
      const memberPayment = memberDocSnapshot.data().payment || {};
      const memberPaymentStatus = memberPayment.status || 'N/A';
  
      return memberPaymentStatus;
    } catch (error) {
      console.error('Error verifying payment status:', error.message);
      throw error;
    }
  };
  
  
