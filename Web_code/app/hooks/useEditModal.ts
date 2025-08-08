import { create } from "zustand";
import { SafeListing } from "../types";

interface EditModalState {
  isOpen: boolean;
  listingData: SafeListing | null;
  onOpen: (data: SafeListing) => void;
  onClose: () => void;
}

const useEditModal = create<EditModalState>((set) => ({
  isOpen: false,
  listingData: null,
  onOpen: (data) => set({ isOpen: true, listingData: data }),
  onClose: () => set({ isOpen: false, listingData: null }),
}));

export default useEditModal;
