"use client";
import useTermsModal from "@/app/hooks/useTerms";
import Modal from "@/app/components/modals/base/modal";
import TermsContent from "@/app/components/content/termsContent";

const TermsModal = () => {
  const TermsModal = useTermsModal();

  return (
    <Modal
      isOpen={TermsModal.isOpen}
      onClose={TermsModal.onClose}
      title="Terms and Conditions"
      body={<TermsContent />}
      actionLabel="Agree"
      onSubmit={TermsModal.onClose}
    ></Modal>
  );
};

export default TermsModal;
