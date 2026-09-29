'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState(null); // 'auth' | 'enroll' | 'bookOrder' | 'profile' | 'lightbox' | 'cv' | 'loginPrompt'
  const [modalData, setModalData] = useState(null);
  // Separate flag so the confirm dialog can sit on top of another open modal
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const askLogout = useCallback(() => setLogoutConfirmOpen(true), []);
  const closeLogoutConfirm = useCallback(() => setLogoutConfirmOpen(false), []);

  const openAuthModal = (mode = 'login') => {
    setModalData({ mode });
    setActiveModal('auth');
  };

  const openLoginPromptModal = (itemData = {}) => {
    setModalData(itemData); // { title, name, price, type: 'book' | 'course', item: object }
    setActiveModal('loginPrompt');
  };

  const openEnrollModal = (course) => {
    setModalData({ course });
    setActiveModal('enroll');
  };

  const openBookOrderModal = (book) => {
    setModalData({ book });
    setActiveModal('bookOrder');
  };


  const openProfileModal = () => {
    setModalData(null);
    setActiveModal('profile');
  };

  // The dashboard is a full page (/admin), not a modal.
  const openAdminDashboard = () => {
    setActiveModal(null);
    setModalData(null);
    router.push('/admin');
  };

  const openLightboxModal = (imageSrc, counterText) => {
    setModalData({ imageSrc, counterText });
    setActiveModal('lightbox');
  };

  const openCvModal = (tab = 'overview') => {
    setModalData({ tab });
    setActiveModal('cv');
  };

  // load: (onProgress) => Promise<{ blob, filename, type }>
  const openFileViewer = ({ title, load }) => {
    setModalData({ title, load });
    setActiveModal('fileViewer');
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const value = {
    activeModal,
    modalData,
    openAuthModal,
    openLoginPromptModal,
    openEnrollModal,
    openBookOrderModal,
    openProfileModal,
    openAdminDashboard,
    openLightboxModal,
    openCvModal,
    openFileViewer,
    closeModal,
    logoutConfirmOpen,
    askLogout,
    closeLogoutConfirm,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
