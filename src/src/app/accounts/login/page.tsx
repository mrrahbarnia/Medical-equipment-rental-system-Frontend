"use client"
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useState, useEffect, Fragment, FormEvent } from "react";
import { useMessage } from "@/contexts/messageProvider";
import { errorHandler, contextMessageHandler } from "@/utils/messageUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authProvider";

const INTERNAL_LOGIN_API: string = "/apis/login/"

const Page = () => {
    const message = useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [contextMessage, setContextMessage] = useState<string>("")
    const router = useRouter();
    const [phoneNumberValue, setPhoneNumberValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [showPassword, setShowPassword] = useState<"show" | "hidden">("show");
    const auth = useAuth();

    useEffect(() => {
        if (message.loginAccountMessage !== "رمز عبور با موفقیت تغییر کرد,لطفا با رمز جدید وارد شوید.") {
            auth.notAuthenticatedPages();
        }
        if (message.loginAccountMessage) {
            contextMessageHandler(message.loginAccountMessage, setContextMessage);
        }
    }, [message, auth])

    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;
        const formData = new FormData(eventForm)

        const response = await fetch(INTERNAL_LOGIN_API, {
            method: "POST",
            body: formData
        })

        if (response.ok) {
            auth.login();
            return router.replace("/");
        } else {
            const responseJson = await response.json();
            if (responseJson.detail && responseJson.detail === 'There is no active account with the provided info') {
                setIsLoading(false);
                errorHandler("حساب کاربری فعالی با مشخصات داده شده یافت نشد.", setFormError)
                return;
            }
        }
    }

    const showPasswordHandler = () => {
        if (showPassword === "hidden") {
            setShowPassword("show");
        } else {
            setShowPassword("hidden");
        }
    }

    const isSubmitDisabled = phoneNumberValue.length !== 11 || passwordValue.length === 0
    return (
        <Fragment>
            {contextMessage && <div className="pt-28">
                <p dir="rtl" className="animate-fadeIn text-white pr-6 py-2 text-right bg-gradient-to-l from-green-950 via-green-600 to-green-400 font-[Yekan-Medium] text-sm">{contextMessage}</p>
            </div>}
            <div className="pt-44 w-full min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5 px-2 m-auto h-screen">
                <form className="w-full py-16 px-6 rounded-lg shadow-sm shadow-blue-900 flex flex-col gap-6" onSubmit={formSubmitHandler}>
                    <h1 className="text-white font-[Yekan-Bold] text-lg mx-auto">فرم ورود</h1>
                    <div className="flex flex-col gap-2 items-end">
                        <label className="text-white font-[Yekan-Medium]">شماره موبایل</label>
                        <input type="text" placeholder="09131234567" name="username" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setPhoneNumberValue(event.target.value)} value={phoneNumberValue} />
                    </div>
                    <div className="relative flex flex-col gap-2 items-end">
                        <label className="text-white font-[Yekan-Medium]">رمز عبور</label>
                        {passwordValue.length > 0 && showPassword === "show" ? <AiFillEye size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showPasswordHandler} /> : passwordValue.length > 0 && showPassword === "hidden" ? <AiFillEyeInvisible size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showPasswordHandler} />: undefined}
                        <input type={showPassword === "show" ? "password" : "text"} name="password" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setPasswordValue(event.target.value)} value={passwordValue} />
                    </div>
                    <div className="flex flex-col mx-auto gap-3">
                        <button className="text-white hover:bg-gradient-to-tr from-orange-700 to-orange-300 w-24 transition mx-auto rounded-md py-2 font-[Yekan-Medium] disabled:pointer-events-none disabled:text-gray-600" disabled={isSubmitDisabled || isLoading} type="submit">{isLoading ? "صبر کنید" : "ورود"}</button>
                        <Link href="/accounts/reset-password" className="text-white font-[Yekan-Medium] hover:text-gray-300">رمز عبور خود را فراموش کرده ام</Link>
                    </div>
                    <Link href="/accounts/register" className="bg-green-600 hover:border-4 border-green-400 rounded-md w-1/3 mx-auto py-2 font-[Yekan-Medium] text-center text-white">ثبت نام</Link>
                    {formError && <div dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</div>}
                </form>
            </div>
        </Fragment>
    )
};

export default Page;