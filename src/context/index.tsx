import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  avatar_url: string;
  login: string;
}


type AuthProviderData = {
  user: User | null
  signInUrl: string;
  signOut: () => void;
}

type AuthProviderProps = {
  children: ReactNode
}

type AuthResponse = {
  token: string;
  user: User;
}


export const AuthContext = createContext({} as AuthProviderData)

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const signInUrl = 'https://github.com/login/oauth/authorize?scope=users&client_id=9308e8fc7128339866d1'


  async function signIn(githubCode: string){
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode
    })

    const {token, user} = response.data;
    localStorage.setItem('@tokenHeat:token', token)

    api.defaults.headers.common.authorization = `Bearer ${token}`;
    
    setUser(user)
  }

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if(hasGithubCode) {
      const [urlWithoutCode, githubCode ] = url.split('?code=')
      window.history.pushState({}, '', urlWithoutCode)
      signIn(githubCode)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('@tokenHeat:token')

    if(token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => {
        setUser(response.data)
      })
    }
  }, [])

  function signOut() {
    setUser(null)
    localStorage.removeItem('@tokenHeat:token')
  }

  return(
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}