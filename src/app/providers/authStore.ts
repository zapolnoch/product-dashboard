import { create } from "zustand"
import { type AuthUser, login as apiLogin, getMe } from "@/shared/api/auth"
import {
  clearTokens,
  getSavedToken,
  saveTokens,
} from "@/shared/lib/tokenStorage"

interface AuthState {
  user: AuthUser | null
  loading: boolean
  init: () => void
  login: (
    username: string,
    password: string,
    remember: boolean,
  ) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  init: () => {
    const token = getSavedToken()
    if (!token) {
      set({ user: null, loading: false })
      return
    }

    getMe(token)
      .then((user) => set({ user, loading: false }))
      .catch(() => {
        clearTokens()
        set({ user: null, loading: false })
      })
  },

  login: async (username, password, remember) => {
    const user = await apiLogin(username, password)
    saveTokens(user.accessToken, user.refreshToken, remember)
    set({ user, loading: false })
  },

  logout: () => {
    clearTokens()
    set({ user: null, loading: false })
  },
}))
