import { create } from "zustand";

interface ResetPasswordModalStore {
  isOpen: boolean;
  email: string; // تغيير من string | null إلى string
  onOpen: (email: string) => void; // جعل email معامل إجباري
  onClose: () => void;
}

const useResetPasswordModal = create<ResetPasswordModalStore>((set) => ({
  isOpen: false,
  email: "", // قيمة افتراضية كسلسلة فارغة بدلاً من null
  onOpen: (email) => set({ isOpen: true, email }),
  onClose: () => set({ isOpen: false, email: "" }),
}));

export default useResetPasswordModal;
