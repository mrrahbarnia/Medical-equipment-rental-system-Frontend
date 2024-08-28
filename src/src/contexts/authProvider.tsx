"use client"
import React, { useState, useEffect, useContext, createContext } from "react";
import { useRouter } from "next/navigation";

const LOCAL_STORAGE_KEY: string = "is-logged-in";
const LOGOUT_REDIRECT: string = "/accounts/login/"

type propsType = {
    children: React.ReactNode;
}

type createContextType = {
    isAuthenticated: boolean,
    login: () => void,
    logout: () => void
}

const authContext = createContext<createContextType>({} as createContextType)


export const AuthProvider = (props: propsType) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const localKey: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localKey) {
            const intLocalKey: number = parseInt(localKey);
            setIsAuthenticated(intLocalKey === 1);
        }
    }, [])

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem(LOCAL_STORAGE_KEY, "1");
        return router.replace("/");
    }

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.setItem(LOCAL_STORAGE_KEY, "0");
        return router.replace(LOGOUT_REDIRECT);
    }

    return <authContext.Provider value={
        {
            isAuthenticated, login, logout
        }
    }>
        {props.children}
    </authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}