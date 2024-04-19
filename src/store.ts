import { create } from 'zustand';

type Store = {
  searchBar: string;
  isCreateHaircutActive: boolean;
  isUpdateHaircutActive: boolean;
  setSearchBar: (search: string) => void;
  setIsCreateHaircutActive: (state: boolean) => void;
  setIsUpdateHaircutActive: (state: boolean) => void;
};

export const useStore = create<Store>()((set) => ({
  searchBar: '',
  isCreateHaircutActive: false,
  isUpdateHaircutActive: false,
  setSearchBar: (search) => set(() => ({ searchBar: search })),
  setIsCreateHaircutActive: (state) => set(() => ({ isCreateHaircutActive: state })),
  setIsUpdateHaircutActive: (state) => set(() => ({ isUpdateHaircutActive: state })),
}));
