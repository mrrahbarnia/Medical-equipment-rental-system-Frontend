"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { useMessage } from "@/contexts/messageProvider";
import { useRouter } from "next/navigation";
import { errorHandler } from "@/utils/messageUtils";
import { useAuth } from "@/contexts/authProvider";

const EXTERNAL_RESEND_VERIFICATION_CODE: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/resend/verification-code/`;

const Page = () => {
    const message = useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const auth = useAuth();

    useEffect(() => {
        auth.notAuthenticatedPages();
    }, [auth])

    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;

        axios.post(EXTERNAL_RESEND_VERIFICATION_CODE, {
                phoneNumber: eventForm.phoneNumber.value
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).then(() => {
            setIsLoading(false);
            message.setVerifyAccountMessage(() => "کد تأییدیه جدید ارسال شد,لطفا حساب کاربری خود را فعال کنید.")
            return router.replace("/accounts/verify-account");
        }).catch(() => {
            setIsLoading(false);
            errorHandler("حساب کاربری فعالی با شماره موبایل وارد شده یافت نشد.", setFormError);
            setPhoneNumber("");
            return;
        })
    }

    const isSubmitDisabled = phoneNumber.length !== 11;
    return (
        <div className="pt-44 w-full min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5 px-2 m-auto h-screen">
            <form className="bg-gradient-to-b from-white to-gray-200 w-full py-16 px-6 rounded-lg shadow-lg flex flex-col gap-6" onSubmit={formSubmitHandler}>
                <h1 className="font-[Yekan-Bold] text-lg mx-auto">فرم دریافت مجدد کد تأییدیه</h1>
                <p className="text-gray-600 font-[Yekan-Medium] text-xs leading-6" dir="rtl">شماره موبایل خود را وارد کنید.</p>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">شماره موبایل</label>
                    <input type="text" name="phoneNumber" placeholder="09131234567" className="border-2 rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setPhoneNumber(event.target.value)} value={phoneNumber} />
                </div>
                <div className="flex flex-col mx-auto gap-3">
                    <button className="hover:text-white hover:bg-gradient-to-tr from-orange-700 to-orange-300 transition mx-auto rounded-md py-2 px-4 font-[Yekan-Medium] disabled:pointer-events-none disabled:text-gray-600" disabled={isSubmitDisabled || isLoading} type="submit">{isLoading ? "صبر کنید" : "ارسال مجدد کد تأییدیه"}</button>
                </div>
                {formError && <div dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</div>}
            </form>
        </div>
    )
};

export default Page;