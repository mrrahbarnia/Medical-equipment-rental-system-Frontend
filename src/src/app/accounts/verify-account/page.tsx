"use client"
import { useState, useEffect, Fragment } from "react";
import { FormEvent } from "react";
import Link from "next/link";
import { useMessage } from "@/contexts/messageProvider";
import { useRouter } from "next/navigation";
import { errorHandler, contextMessageHandler } from "@/utils/messageUtils";
import { useAuth } from "@/contexts/authProvider";

const INTERNAL_VERIFY_ACCOUNT: string = "/apis/verify-account/"

const Page = () => {
    const message = useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const router = useRouter();
    const [verificationCode, setVerificationCode] = useState("");
    const [contextMessage, setContextMessage] = useState<string>("")
    const auth = useAuth();

    useEffect(() => {
        auth.notAuthenticatedPages();
        if (message.verifyAccountMessage) {
            contextMessageHandler(message.verifyAccountMessage, setContextMessage)
        }
    }, [message, auth])

    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;

        const response = await fetch(INTERNAL_VERIFY_ACCOUNT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                verificationCode: eventForm.verificationCode.value
            })
        })

        if (response.ok) {
            setIsLoading(false);
            message.setLoginAccountMessage(() => "حساب کاربری شما با موفقیت فعال شد,لطفا وارد شوید.")
            return router.replace("/accounts/login");
        }
        if (!response.ok) {
            setIsLoading(false);
            errorHandler("کد تأییدیه معتبر نیست.", setFormError);
            setVerificationCode("");
            return;
        }
    }


    const isSubmitDisabled = verificationCode.length === 0;
    return (
        <Fragment>
            {contextMessage && <div className="pt-28">
                <p dir="rtl" className="animate-fadeIn text-white pr-6 py-2 text-right bg-gradient-to-l from-green-950 via-green-600 to-green-400 font-[Yekan-Medium] text-sm">{contextMessage}</p>
            </div>}
            <div className="pt-44 w-full min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5 px-2 m-auto h-screen">
                <form className="w-full py-16 px-6 rounded-lg shadow-sm shadow-blue-900 flex flex-col gap-6" onSubmit={formSubmitHandler}>
                    <h1 className="text-white font-[Yekan-Bold] text-lg mx-auto">فرم تأیید حساب کاربری</h1>
                    <p className="text-gray-400 font-[Yekan-Medium] text-xs leading-6" dir="rtl">کد تأییدیه پیامک شده را وارد کنید.</p>
                    <div className="flex flex-col gap-2 items-end">
                        <label className="text-white font-[Yekan-Medium]">کد تأییدیه</label>
                        <input type="text" name="verificationCode" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setVerificationCode(event.target.value)} value={verificationCode} />
                    </div>
                    <div className="flex flex-col mx-auto gap-3">
                        <button className="text-white hover:bg-gradient-to-tr from-orange-700 to-orange-300 transition mx-auto rounded-md py-2 px-4 font-[Yekan-Medium] disabled:pointer-events-none disabled:text-gray-600" disabled={isSubmitDisabled || isLoading} type="submit">{isLoading ? "صبر کنید" : "فعال سازی حساب کاربری"}</button>
                        <Link href="/accounts/verify-account/resend" className="text-white font-[Yekan-Medium] hover:text-gray-300 text-center">دریافت کد تأییدیه جدید</Link>
                    </div>
                    {formError && <div dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</div>}
                </form>
            </div>
        </Fragment>
    )
};

export default Page;