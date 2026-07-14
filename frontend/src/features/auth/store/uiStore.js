import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),

  // Modal genérico (opcional, por si lo usan en events/registrations más adelante)
  modal: { open: false, type: null, payload: null },
  openModal: (type, payload = null) => set({ modal: { open: true, type, payload } }),
  closeModal: () => set({ modal: { open: false, type: null, payload: null } }),
}));