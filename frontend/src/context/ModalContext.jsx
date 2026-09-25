'use client';

import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); // 'auth' | 'enroll' | 'bookOrder' | 'bookPreview' | 'quiz' | 'studentDashboard' | 'adminDashboard' | 'lightbox'
  const [modalData, setModalData] = useState(null);

  const openAuthModal = (mode = 'login') => {
    setModalData({ mode });
    setActiveModal('auth');
  };

  const openEnrollModal = (course) => {
    setModalData({ course });
    setActiveModal('enroll');
  };

  const openBookOrderModal = (book) => {
    setModalData({ book });
    setActiveModal('bookOrder');
  };

  const openBookPreviewModal = (book) => {
    setModalData({ book });
    setActiveModal('bookPreview');
  };

  const openQuizModal = () => {
    setModalData(null);
    setActiveModal('quiz');
  };

  const openStudentDashboard = (levelId = 1) => {
    setModalData({ levelId });
    setActiveModal('studentDashboard');
  };

  const openAdminDashboard = () => {
    setModalData(null);
    setActiveModal('adminDashboard');
  };

  const openLightboxModal = (imageSrc, counterText) => {
    setModalData({ imageSrc, counterText });
    setActiveModal('lightbox');
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const value = {
    activeModal,
    modalData,
    openAuthModal,
    openEnrollModal,
    openBookOrderModal,
    openBookPreviewModal,
    openQuizModal,
    openStudentDashboard,
    openAdminDashboard,
    openLightboxModal,
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
