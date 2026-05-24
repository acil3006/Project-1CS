import type { PlatformState, Session } from '../types/models'

export const loadSession = (): Session | null => {
  return null
}

export const saveSession = (session: Session | null) => {
  void session
}

export const loadPlatformState = (): PlatformState | null => {
  return null
}

export const savePlatformState = (state: PlatformState) => {
  void state
}

export const clearStoredState = () => {
  return
}
