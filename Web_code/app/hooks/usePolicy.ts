"use client";
import {create} from 'zustand';

interface PolicyState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePolicy = create<PolicyState>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false}),
}));

export default usePolicy;