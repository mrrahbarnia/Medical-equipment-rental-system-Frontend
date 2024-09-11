"use client"
import React, { useState, useEffect, useContext, createContext } from "react";
import { useRouter } from "next/navigation";

const LOCAL_STORAGE_KEY: string = "is-logged-in";
const LOCAL_RULE_KEY: string = "rule"
const LOGOUT_REDIRECT: string = "/"

type propsType = {
    children: React.ReactNode;
}

type createContextType = {
    isAuthenticated: boolean,
    rule: string,
    login: () => void,
    logout: () => void,
    authenticatedPages: () => void,
    notAuthenticatedPages: () => void,
    adminPages: () => void
}

const authContext = createContext<createContextType>({} as createContextType)


export const AuthProvider = (props: propsType) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [rule, setRule] = useState<"admin" | "user">("user");
    const router = useRouter();

    useEffect(() => {
        const localKey: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
        const userRule = localStorage.getItem(LOCAL_RULE_KEY)
        if (localKey) {
            const intLocalKey: number = parseInt(localKey);
            setIsAuthenticated(intLocalKey === 1);
        }
        if (userRule === "admin") {
            setRule("admin");
        }
    }, [])

    const login = () => {
        setIsAuthenticated(true);
        return localStorage.setItem(LOCAL_STORAGE_KEY, "1");
    }

    const logout = () => {
        setIsAuthenticated(false);
        return localStorage.setItem(LOCAL_STORAGE_KEY, "0");
    }
    // return router.replace(LOGOUT_REDIRECT);
    const authenticatedPages = () => {
        if (!isAuthenticated) {
            return router.back();
        }
    };

    const notAuthenticatedPages = () => {
        if (isAuthenticated) {
            return router.back();
        }
    };

    const adminPages = () => {
        if (rule !== "admin") {
            return router.back()
        }
    }

    return <authContext.Provider value={
        {
            isAuthenticated,
            login, logout,
            authenticatedPages, notAuthenticatedPages,
            rule,
            adminPages
        }
    }>
        {props.children}
    </authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}