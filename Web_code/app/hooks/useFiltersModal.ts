"use client";

import { create } from 'zustand';

interface FiltersModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useFiltersModal = create<FiltersModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useFiltersModal;


