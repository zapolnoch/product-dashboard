import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface SortState {
  field: string | null
  order: "asc" | "desc" | null
}

interface SortStore extends SortState {
  setSort: (sort: SortState) => void
  resetSort: () => void
}

const initialState: SortState = { field: null, order: null }

export const useSortStore = create<SortStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSort: (sort) => set(sort),
      resetSort: () => set(initialState),
    }),
    {
      name: "products_sort",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
