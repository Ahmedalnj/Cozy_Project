interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmationModal({
  title,
  message,
  confirmText = "تأكيد",
  onConfirm,
  onClose,
}: ConfirmationModalProps) {
  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-xl">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            إلغاء
          </button>
          <button
            className="px-4 py-2 rounded bg-rose-500 text-white hover:bg-rose-600"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
