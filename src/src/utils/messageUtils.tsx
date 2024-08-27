export const errorHandler = (error: string, callBackUseState: React.Dispatch<React.SetStateAction<string>>) => {
    callBackUseState(error);
    setTimeout(() => {
        callBackUseState("");
    }, 6000)
}

export const contextMessageHandler = (message: string, callBackUseState: React.Dispatch<React.SetStateAction<string>>) => {
    callBackUseState(message);
    setTimeout(() => {
        callBackUseState("");
    }, 6000)
}
