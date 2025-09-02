"use client";

import React from "react";
import HostRequestModal from "./HostRequestModal";
import useHostRequestModal from "@/app/hooks/useHostRequestModal";

const HostRequestModalProvider: React.FC = () => {
  const { isOpen, onClose } = useHostRequestModal();

  return <HostRequestModal isOpen={isOpen} onClose={onClose} />;
};

export default HostRequestModalProvider;


