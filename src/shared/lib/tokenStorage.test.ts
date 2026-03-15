import { afterEach, describe, expect, it } from "vitest"
import { clearTokens, getSavedToken, saveTokens } from "./tokenStorage"

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe("saveTokens", () => {
  it("saves to localStorage when remember is true", () => {
    saveTokens("access123", "refresh456", true)
    expect(localStorage.getItem("auth_token")).toBe("access123")
    expect(localStorage.getItem("auth_refresh")).toBe("refresh456")
    expect(sessionStorage.getItem("auth_token")).toBeNull()
  })

  it("saves to sessionStorage when remember is false", () => {
    saveTokens("access123", "refresh456", false)
    expect(sessionStorage.getItem("auth_token")).toBe("access123")
    expect(sessionStorage.getItem("auth_refresh")).toBe("refresh456")
    expect(localStorage.getItem("auth_token")).toBeNull()
  })
})

describe("clearTokens", () => {
  it("clears tokens from both storages", () => {
    localStorage.setItem("auth_token", "a")
    localStorage.setItem("auth_refresh", "b")
    sessionStorage.setItem("auth_token", "c")
    sessionStorage.setItem("auth_refresh", "d")

    clearTokens()

    expect(localStorage.getItem("auth_token")).toBeNull()
    expect(localStorage.getItem("auth_refresh")).toBeNull()
    expect(sessionStorage.getItem("auth_token")).toBeNull()
    expect(sessionStorage.getItem("auth_refresh")).toBeNull()
  })

  it("does not throw when storages are already empty", () => {
    expect(() => clearTokens()).not.toThrow()
  })
})

describe("getSavedToken", () => {
  it("returns token from localStorage first", () => {
    localStorage.setItem("auth_token", "local")
    sessionStorage.setItem("auth_token", "session")
    expect(getSavedToken()).toBe("local")
  })

  it("falls back to sessionStorage", () => {
    sessionStorage.setItem("auth_token", "session")
    expect(getSavedToken()).toBe("session")
  })

  it("returns null when no token exists", () => {
    expect(getSavedToken()).toBeNull()
  })
})
