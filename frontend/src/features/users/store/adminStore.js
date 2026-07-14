import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getUsers, createUser, updateUser, deleteUser } from '../../../shared/api/usersClient.js';

export const useAdminStore = create(
  persist(
    (set) => ({
      users: [],
      loading: false,
      error: null,

      fetchUsers: async (params) => {
        set({ loading: true, error: null });
        try {
          const { data } = await getUsers(params);
          set({ users: data.data || [], loading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || 'Error al cargar usuarios', loading: false });
        }
      },

      addUser: async (userData) => {
        const { data } = await createUser(userData);
        return data;
      },

      editUser: async (id, userData) => {
        const { data } = await updateUser(id, userData);
        return data;
      },

      removeUser: async (id) => {
        await deleteUser(id);
        set((state) => ({ users: state.users.filter((u) => u._id !== id) }));
      },
    }),
    {
      name: 'admin-users-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ users: state.users }),
    }
  )
);
