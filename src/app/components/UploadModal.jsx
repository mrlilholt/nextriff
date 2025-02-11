import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import UploadSection from './UploadSection';
import { app } from '../firebaseConfig';
import './UploadModal.css'; // <-- Add this import

const UploadModal = ({ closeModal }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="upload-modal">
      {user ? (
        <>
          <div className="user-info">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="profile-image" />
            ) : (
              <p>No profile image available</p>
            )}
            <button className="modal-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <UploadSection currentUserEmail={user.email} />
        </>
      ) : (
        <>
          <h2>Sign in with Google to upload</h2>
          <button className="modal-button" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
        </>
      )}
      <button className="modal-button" onClick={closeModal}>
        Back to the Station
      </button>
    </div>
  );
};

export default UploadModal;