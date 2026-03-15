const TOKEN_KEY = "auth_token"
const REFRESH_KEY = "auth_refresh"

export function saveTokens(
  accessToken: string,
  refreshToken: string,
  remember: boolean,
) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, accessToken)
  storage.setItem(REFRESH_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export function getSavedToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}
