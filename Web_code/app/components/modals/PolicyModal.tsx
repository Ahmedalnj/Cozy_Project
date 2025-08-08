"use client";

import Modal from "./modal";
import PolicyContent from "../Policycontent";
import usePolicy from "@/app/hooks/usePolicy";

const PolicyModal = () => {
  const PolicyModal = usePolicy();

  return (
    <Modal
      isOpen={PolicyModal.isOpen}
      onClose={PolicyModal.onClose}
      title="Privacy Policy"
      body={<PolicyContent />}
      actionLabel="Agree"
      onSubmit={PolicyModal.onClose}
    ></Modal>
  );
};

export default PolicyModal;
