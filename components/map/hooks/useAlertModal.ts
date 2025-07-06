"use client";

import { useState } from "react";

interface AlertData {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  address?: string;
  description?: string;
  hasImage?: string;
  createdAt: Date;
  userName?: string;
  marker?: any;
}

export function useAlertModal() {
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (alert: AlertData) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const closeModal = (open?: boolean) => {
    // Handle both direct calls and Dialog onOpenChange calls
    const shouldClose = open === undefined ? true : !open;
    if (shouldClose) {
      setIsModalOpen(false);
      // setSelectedAlert(null);
    }
  };

  return {
    selectedAlert,
    isModalOpen,
    openModal,
    closeModal,
  };
}
