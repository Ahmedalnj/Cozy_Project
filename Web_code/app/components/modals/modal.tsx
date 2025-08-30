"use client";
import React, { useEffect, useState, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  body?: React.ReactElement;
  actionLabel: string;
  isLoading?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  disabled?: boolean;
  footer?: React.ReactElement;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  isLoading,
  footer,
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  disabled,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled || !onSubmit) {
      return;
    }
    if (typeof onSubmit === "function") {
      onSubmit();
    }
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }
    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-999 flex justify-center items-center overflow-x-hidden bg-neutral-800/70 outline-none focus:outline-none p-4">
        <div className="relative w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto max-h-[95vh] sm:max-h-[90vh]">
          <div
            className={`translate duration-300 ${
              showModal ? "translate-y-0" : "translate-y-full"
            } ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-[95vh] sm:max-h-[90vh]">
              {/* رأس المودال */}
              <div className="flex items-center p-4 sm:p-6 rounded-t justify-center relative border-b-[1px] flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute left-4 sm:left-9"
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-base sm:text-lg font-semibold">{title}</div>
              </div>
              {/* جسم المودال مع تمرير عمودي */}
              <div className="relative p-4 sm:p-6 flex-auto overflow-y-auto min-h-0">
                {body}
              </div>
              {/* التذييل */}
              <div className="flex flex-col gap-2 p-4 sm:p-6 flex-shrink-0">
                <div className="flex flex-row items-center gap-4 w-full">
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      outline
                      disabled={disabled}
                      label={secondaryActionLabel}
                      onClick={handleSecondaryAction}
                    />
                  )}
                  <Button
                    disabled={disabled || isLoading}
                    label={actionLabel}
                    onClick={handleSubmit}
                    isLoading={isLoading}
                  />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
