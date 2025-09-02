"use client";
import useTermsModal from "@/app/hooks/useTerms";
import Modal from "@/app/components/modals/base/modal";
import TermsContent from "@/app/components/content/termsContent";
import { useTranslation } from "react-i18next";

const TermsModal = () => {
  const { t } = useTranslation("common");
  const TermsModal = useTermsModal();

  return (
    <Modal
      isOpen={TermsModal.isOpen}
      onClose={TermsModal.onClose}
      title="Terms and Conditions"
      body={<TermsContent />}
              actionLabel={t("agree")}
      onSubmit={TermsModal.onClose}
    ></Modal>
  );
};

export default TermsModal;
