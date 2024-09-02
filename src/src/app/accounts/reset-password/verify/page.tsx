"use client"
import axios from "axios";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useState, useEffect, Fragment } from "react";
import { FormEvent } from "react";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { useMessage } from "@/contexts/messageProvider";
import { useRouter } from "next/navigation";
import { errorHandler, contextMessageHandler } from "@/utils/messageUtils";
import Link from "next/link";
import { useAuth } from "@/contexts/authProvider";

const EXTERNAL_RESET_PASSWORD_VERIFY_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/reset-password/verify/`

const Page = () => {
    const message = useMessage();
    const [passwordValue, setPasswordValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<"show" | "hidden">("show");
    const [contextMessage, setContextMessage] = useState<string>("")
    const auth = useAuth();

    useEffect(() => {
        auth.notAuthenticatedPages();
        if (message.resetPasswordVerifyMessage) {
            contextMessageHandler(message.resetPasswordVerifyMessage, setContextMessage);
            message.setResetPasswordVerifyMessage("");
        }
    }, [message, auth])


    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;

        axios.post(EXTERNAL_RESET_PASSWORD_VERIFY_API, {
                randomPassword: eventForm.randomPassword.value
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).then(() => {
                setIsLoading(false);
                message.setLoginAccountMessage(() => "رمز عبور با موفقیت تغییر کرد,بعد از ورود میتوانید رمز عبور دلخواه را انتخاب کنید")
                return router.replace("/accounts/login/");
            }
        ).catch(() => {
            setIsLoading(false);
            errorHandler("رمز عبور وارد شده نامعتبر است,لطفا رمز عبور دیگری درخواست کنید.", setFormError);
            setPasswordValue("");
            return;
        })
    }

    const showPasswordHandler = () => {
        if (showPassword === "hidden") {
            setShowPassword("show");
        } else {
            setShowPassword("hidden");
        }
    }


    const isSubmitDisabled = passwordValue.length === 0;
    return (
        <Fragment>
            {contextMessage && <div className="pt-28">
                <p dir="rtl" className="animate-fadeIn text-white pr-6 py-2 text-right bg-gradient-to-l from-green-950 via-green-600 to-green-400 font-[Yekan-Medium] text-sm">{contextMessage}</p>
            </div>}
            <div className="pt-44 w-full min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5 px-2 m-auto h-screen">
                <form className="bg-gradient-to-b from-white to-gray-200 w-full py-16 px-6 rounded-lg shadow-lg flex flex-col gap-6" onSubmit={formSubmitHandler}>
                    <h1 className="font-[Yekan-Bold] text-lg mx-auto">فرم تأیید رمز یکبار مصرف</h1>
                    <p className="text-gray-600 font-[Yekan-Medium] text-xs leading-6" dir="rtl">رمز یکبار مصرف دریافت شده را وارد کنید.</p>
                    <div className="relative flex flex-col gap-2 items-end">
                        <label className="font-[Yekan-Medium]">رمز یکبار مصرف</label>
                        {passwordValue.length > 0 && showPassword === "show" ? <AiFillEye size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showPasswordHandler} /> : passwordValue.length > 0 && showPassword === "hidden" ? <AiFillEyeInvisible size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showPasswordHandler} />: undefined}
                        <input type={showPassword === "show" ? "password" : "text"} name="randomPassword" className="border-2 rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setPasswordValue(event.target.value)} value={passwordValue} />
                    </div>
                    <div className="flex flex-col mx-auto gap-3">
                        <button className="hover:text-white hover:bg-gradient-to-tr from-orange-700 to-orange-300 transition mx-auto rounded-md py-2 px-4 font-[Yekan-Medium] disabled:pointer-events-none disabled:text-gray-400" disabled={isSubmitDisabled || isLoading} type="submit">{isLoading ? "صبر کنید" : "تأیید رمز یکبار مصرف"}</button>
                        <Link href="/accounts/reset-password/" className="font-[Yekan-Medium] hover:text-gray-600 text-center">دریافت رمز عبور جدید</Link>
                    </div>
                    {formError && <div dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</div>}
                </form>
            </div>
        </Fragment>
    )
};

export default Page;
