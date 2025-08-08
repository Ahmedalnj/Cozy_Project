"use client";
import {create} from 'zustand';

interface TermsModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useTermsModal = create<TermsModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false}),
}));

export default useTermsModal;