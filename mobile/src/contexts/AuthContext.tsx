import { createContext, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);

  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '937538432478-182o6rh4to660cdlev6pisna5lq4ic1o.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  });

  async function signOut() {
    try {
      setUser({} as UserProps)
      api.defaults.headers.common['Authorization'] = ''
    } catch (err) {
      console.error(err);
      throw err;

    };
  }

  async function signIn() {
    try {
      setIsUserLoading(true)

      await promptAsync();

    } catch (err) {
      console.error(err);
      throw err;

    } finally {
      setIsUserLoading(false)
    };
  }

  async function signInWithGoogle(access_token: string) {
    setIsUserLoading(true)
    try {
      const TokenResponse = await api.post('/users', { access_token: access_token })
      api.defaults.headers.common['Authorization'] = 'Bearer ' + TokenResponse.data.token

      const userInfoResponse = await api.get('/me')
      setUser(userInfoResponse.data.user)

      console.log(user)

    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      isUserLoading,
      user
    }}
    >
      {children}
    </AuthContext.Provider>
  )

}