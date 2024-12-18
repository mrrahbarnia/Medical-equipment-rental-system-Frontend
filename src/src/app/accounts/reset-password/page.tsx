"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { errorHandler } from "@/utils/messageUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { useRouter } from "next/navigation";
import { useMessage } from "@/contexts/messageProvider";
import { useAuth } from "@/contexts/authProvider";

const EXTERNAL_RESET_PASSWORD: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/reset-password/`;

const Page = () => {
    const [phoneNumberValue, setPhoneNumberValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const router = useRouter();
    const message = useMessage();
    const auth = useAuth();

    useEffect(() => {
        auth.notAuthenticatedPages();
    }, [auth])

    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;

        axios.post(EXTERNAL_RESET_PASSWORD, {
                phoneNumber: eventForm.phoneNumber.value
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
            }
        ).then(() => {
                setIsLoading(false);
                message.setResetPasswordVerifyMessage(() => "رمز عبور پیامک شده را وارد کنید.")
                return router.replace("/accounts/reset-password/verify/")
            }
        ).catch(() => {
            setIsLoading(false);
            errorHandler("حساب کاربری فعالی با شماره موبایل وارد شده یافت نشد.", setFormError)
            setPhoneNumberValue("");
            return;
        })
    }


    const isSubmitDisabled = phoneNumberValue.length !== 11;
    return (
        <div className="pt-44 w-full min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5 px-2 m-auto h-screen">
            <form className="bg-gradient-to-b from-white to-gray-200 w-full py-16 px-6 rounded-lg shadow-lg flex flex-col gap-6" onSubmit={formSubmitHandler}>
                <h1 className="font-[Yekan-Bold] text-lg mx-auto">فرم بازیابی رمز عبور</h1>
                <p className="text-gray-500 font-[Yekan-Medium] text-xs leading-6" dir="rtl">بعد از وارد کردن شماره موبایل,رمز یکبار مصرفی برای شما ارسال میشود که بوسیله ی آن میتوانید رمز دلخواه خود را انتخاب نمایید.</p>

                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">شماره موبایل</label>
                    <input type="text" placeholder="09131234567" name="phoneNumber" className="rounded-md border-2 outline-1 py-2 px-3 w-full" onChange={(event) => setPhoneNumberValue(event.target.value)} value={phoneNumberValue} />
                </div>
                <div className="flex flex-col mx-auto gap-3">
                    <button className="hover:text-white hover:bg-gradient-to-tr from-orange-700 to-orange-300 transition mx-auto rounded-md py-2 px-4 font-[Yekan-Medium] disabled:pointer-events-none disabled:text-gray-400" disabled={isSubmitDisabled || isLoading} type="submit">{isLoading ? "صبر کنید" : "دریافت رمز یکبار مصرف"}</button>
                </div>
                {formError && <div dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</div>}
            </form>
        </div>
    )
};

export default Page;
