'use client';

import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); // 'auth' | 'enroll' | 'bookOrder' | 'profile' | 'adminDashboard' | 'lightbox' | 'cv' | 'loginPrompt'
  const [modalData, setModalData] = useState(null);

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

  const openAdminDashboard = () => {
    setModalData(null);
    setActiveModal('adminDashboard');
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
    closeModal
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
