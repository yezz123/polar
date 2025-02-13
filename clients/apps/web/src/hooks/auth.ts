import { useRouter } from 'next/router'
import { CancelablePromise, type UserRead } from 'polarkit/api/client'
import { CONFIG } from 'polarkit/config'
import { UserState, useStore } from 'polarkit/store'
import { useCallback, useEffect, useState } from 'react'

export const useAuth = (): UserState & {
  hasChecked: boolean
  isChecking: boolean
  reloadUser: () => CancelablePromise<UserRead>
} => {
  const authenticated = useStore((state) => state.authenticated)
  const currentUser = useStore((state) => state.currentUser)
  const login = useStore((state) => state.login)
  const logout = useStore((state) => state.logout)

  const [hydrated, setHydrated] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const getAuthenticatedUser = useCallback((): CancelablePromise<UserRead> => {
    setIsChecking(true)
    return login(() => {
      setIsChecking(false)
      setHasChecked(true)
    })
  }, [setIsChecking, setHasChecked, login])

  useEffect(() => {
    setHydrated(true)
    if (hasChecked || authenticated) {
      return
    }

    let request = getAuthenticatedUser()
    return () => {
      if (request) {
        request.cancel()
      }
    }
  }, [authenticated, hasChecked, getAuthenticatedUser, hydrated])

  if (!hydrated) {
    return {
      authenticated: false,
      currentUser: undefined,
      hasChecked: false,
      isChecking: false,
      login,
      logout,
      reloadUser: getAuthenticatedUser,
    }
  }

  return {
    authenticated,
    currentUser,
    hasChecked,
    isChecking,
    login,
    logout,
    reloadUser: getAuthenticatedUser,
  }
}

export const useRequireAuth = (): UserState & {
  hasChecked: boolean
  isChecking: boolean
} => {
  const router = useRouter()
  const session = useAuth()

  if (!session.authenticated && session.hasChecked) {
    let redirectPath = CONFIG.LOGIN_PATH
    const currentURL = new URL(window.location.href)
    const redirectURL = new URL(window.location.origin + redirectPath)

    if (currentURL.pathname !== redirectPath) {
      redirectURL.searchParams.set(
        'goto_url',
        currentURL.toString().replace(window.location.origin, ''),
      )
      redirectPath = redirectURL.toString()
    }

    router.push(redirectPath)
  }

  return session
}
