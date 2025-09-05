"use client";

import Modal from "@/app/components/modals/base/modal";
import PolicyContent from "@/app/components/content/Policycontent";
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
