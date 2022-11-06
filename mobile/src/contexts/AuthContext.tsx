import { createContext, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

import { api } from "../services/api";

import AsyncStorage from '@react-native-async-storage/async-storage';

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
  setUser: ({ }: UserProps) => void; // add
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);

  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  });

  async function signOut() {
    try {
      setUser({} as UserProps)
      api.defaults.headers.common['Authorization'] = ''
      try {
        await AsyncStorage.removeItem("@storage_Key:token");
        await AsyncStorage.removeItem("@storage_Key:user");
      } finally {
        // Faz o que quiser
      }
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
      console.log(access_token)

      const TokenResponse = await api.post('/users', { access_token: access_token })
      api.defaults.headers.common['Authorization'] = 'Bearer ' + TokenResponse.data.token

      const userInfoResponse = await api.get('/me')

      const jsonValue = JSON.stringify(userInfoResponse.data.user);

      console.log(TokenResponse.data.token)
      console.log(jsonValue)

      await AsyncStorage.setItem("@storage_Keya:token", TokenResponse.data.token);
      await AsyncStorage.setItem("@storage_Key:user", jsonValue);

      setUser(userInfoResponse.data.user)

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
      user,
      setUser
    }}
    >
      {children}
    </AuthContext.Provider>
  )

}