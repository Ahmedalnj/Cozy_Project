"use client";
import React, { useEffect, useState, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "@/app/components/ui/Button";

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
  noOverflow?: boolean;
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
  noOverflow = false,
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
      <div className="fixed inset-0 z-999 flex justify-center items-center overflow-x-hidden bg-neutral-800/70 outline-none focus:outline-none p-2 sm:p-4">
        <div className="relative w-full max-w-[500px] mx-auto">
          <div
            className={`translate duration-300 ${
              showModal ? "translate-y-0" : "translate-y-full"
            } ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate border-0 rounded-lg shadow-lg relative flex flex-col w-full max-h-[90vh] bg-white outline-none focus:outline-none">
              {/* رأس المودال */}
              <div className="flex items-center p-2 sm:p-3 rounded-t justify-center relative border-b-[1px] flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute left-2 sm:left-4"
                >
                  <IoMdClose size={14} />
                </button>
                <div className="text-xs sm:text-sm font-semibold">
                  {title}
                </div>
              </div>
              {/* جسم المودال */}
              <div className={`relative p-2 sm:p-3 flex-auto ${noOverflow ? '' : 'overflow-y-auto max-h-[calc(90vh-120px)]'}`}>
                {body}
              </div>
              {/* التذييل */}
              <div className="flex flex-col gap-2 p-2 sm:p-3 flex-shrink-0">
                <div className="flex flex-row items-center gap-3 w-full">
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
