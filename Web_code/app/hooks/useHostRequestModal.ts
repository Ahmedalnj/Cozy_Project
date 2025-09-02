import { create } from 'zustand';

interface HostRequestModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useHostRequestModal = create<HostRequestModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useHostRequestModal;

