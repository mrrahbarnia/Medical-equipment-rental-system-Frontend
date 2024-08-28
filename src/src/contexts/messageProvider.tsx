"use client"
import React, { useState, useContext, createContext } from "react";

type propsType = {
    children: React.ReactNode;
}

type createContextType = {
    verifyAccountMessage: string,
    setVerifyAccountMessage: React.Dispatch<React.SetStateAction<string>>,
    loginAccountMessage: string,
    setLoginAccountMessage: React.Dispatch<React.SetStateAction<string>>,
    resetPasswordVerifyMessage: string,
    setResetPasswordVerifyMessage: React.Dispatch<React.SetStateAction<string>>,
}

const messageContext = createContext<createContextType>({
    verifyAccountMessage: "",
    setVerifyAccountMessage: () => "",
    loginAccountMessage: "",
    setLoginAccountMessage: () => "",
    resetPasswordVerifyMessage: "",
    setResetPasswordVerifyMessage: () => ""
});


export const MessageProvider = (props: propsType) => {
    const [verifyAccountMessage, setVerifyAccountMessage] = useState<string>("");
    const [loginAccountMessage, setLoginAccountMessage] = useState<string>("")
    const [resetPasswordVerifyMessage, setResetPasswordVerifyMessage] = useState<string>("")

    return <messageContext.Provider value={
        {
            verifyAccountMessage, setVerifyAccountMessage,
            loginAccountMessage, setLoginAccountMessage,
            resetPasswordVerifyMessage, setResetPasswordVerifyMessage,
        }
    }>
        {props.children}
    </messageContext.Provider>
}

export const useMessage = () => {
    return useContext(messageContext);
}
