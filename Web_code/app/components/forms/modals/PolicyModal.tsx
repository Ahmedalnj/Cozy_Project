"use client";

import Modal from "@/app/components/modals/base/modal";
import PolicyContent from "@/app/components/content/Policycontent";
import usePolicy from "@/app/hooks/usePolicy";
import { useTranslation } from "react-i18next";

const PolicyModal = () => {
  const { t } = useTranslation("common");
  const PolicyModal = usePolicy();

  return (
    <Modal
      isOpen={PolicyModal.isOpen}
      onClose={PolicyModal.onClose}
      title="Privacy Policy"
      body={<PolicyContent />}
              actionLabel={t("agree")}
      onSubmit={PolicyModal.onClose}
    ></Modal>
  );
};

export default PolicyModal;
