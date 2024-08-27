"use client"
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMessage } from "@/contexts/messageProvider";
import { errorHandler } from "@/utils/messageUtils";

const INTERNAL_REGISTER_API: string = "/apis/register/";

const Page = () => {
    const message = useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const router = useRouter();
    const [phoneNumberValue, setPhoneNumberValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [showPassword, setShowPassword] = useState<"show" | "hidden">("show");
    const [showConfirmPassword, setShowConfirmPassword] = useState<"show" | "hidden">("show");


    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;        

        if (eventForm.password.value !== eventForm.confirmPassword.value) {
            errorHandler("رمز های ورود مطابقت ندارند.", setFormError);
            return setIsLoading(false);        
        }

        const response = await fetch(INTERNAL_REGISTER_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phoneNumber: eventForm.phoneNumber.value,
                password: eventForm.password.value,
                confirmPassword: eventForm.confirmPassword.value
            })
        })
        const jsonResponse = await response.json();
        console.log(jsonResponse);

        if (jsonResponse?.detail && jsonResponse.detail === "Phone number already exists") {
            errorHandler("با شماره موبایل وارد شده قبلا ثبت نام شده است.", setFormError)
            setIsLoading(false);
            return;
        }
        if (jsonResponse?.detail && jsonResponse.detail[0]?.msg.includes("Password must contain at least 8 chars")) {
            errorHandler("طول رمز عبور باید حداقل هشت کاراکتر,یک حرف انگلیسی کوچک,یک حرف انگلیسی بزرگ,یک عدد و یک کاراکتر خاص(@,&,$,..)باشد.", setFormError)
            setIsLoading(false);
            return;
        }
        if (response.ok) {
            setIsLoading(false);
            message.setVerifyAccountMessage(() => "با موفقیت ثبت نام شدید,لطفا حساب کاربری خود را فعال کنید");
            return router.replace("/accounts/verify-account");
        }
    }

    const showPasswordHandler = () => {
        if (showPassword === "hidden") {
            setShowPassword("show");
        } else {
            setShowPassword("hidden");
        }
    }

    const showConfirmPasswordHandler = () => {
        if (showConfirmPassword === "hidden") {
            setShowConfirmPassword("show");
        } else {
            setShowConfirmPassword("hidden");
        }
    }

    const isSubmitDisabled = phoneNumberValue.length !== 11 || passwordValue.length === 0 || confirmPasswordValue.length === 0
    return (
        <div className="pt-44 w-full min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5 px-2 m-auto h-screen">
            <form className="w-full py-16 px-6 rounded-lg shadow-sm shadow-blue-900 flex flex-col gap-6" onSubmit={formSubmitHandler}>
                <h1 className="text-white font-[Yekan-Bold] text-lg mx-auto">فرم ثبت نام</h1>
                <div className="flex flex-col gap-2 items-end">
                    <label className="text-white font-[Yekan-Medium]">شماره موبایل</label>
                    <input type="text" name="phoneNumber" placeholder="09131234567" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setPhoneNumberValue(event.target.value)}/>
                </div>
                <div className="relative flex flex-col gap-2 items-end">
                    <label className="text-white font-[Yekan-Medium]">رمز عبور</label>
                    {passwordValue.length > 0 && showPassword === "show" ? <AiFillEye size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showPasswordHandler} /> : passwordValue.length > 0 && showPassword === "hidden" ? <AiFillEyeInvisible size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showPasswordHandler} />: undefined}
                    <input type={showPassword === "show" ? "password" : "text"} name="password" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setPasswordValue(event.target.value)} />
                </div>
                <div className="relative flex flex-col gap-2 items-end">
                    <label className="text-white font-[Yekan-Medium]">تکرار رمز عبور</label>
                    {confirmPasswordValue.length > 0 && showConfirmPassword === "show" ? <AiFillEye size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showConfirmPasswordHandler} /> : confirmPasswordValue.length > 0 && showConfirmPassword === "hidden" ? <AiFillEyeInvisible size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showConfirmPasswordHandler} />: undefined}
                    <input type={showConfirmPassword === "show" ? "password" : "text"} name="confirmPassword" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setConfirmPasswordValue(event.target.value)} />
                </div>
                <div className="flex flex-col mx-auto gap-3">
                    <button className="text-white hover:bg-gradient-to-tr from-orange-700 to-orange-300 w-24 transition mx-auto rounded-md py-2 font-[Yekan-Medium] disabled:pointer-events-none disabled:text-gray-600" disabled={isSubmitDisabled || isLoading} type="submit">{isLoading ? "صبر کنید" : "ثبت نام"}</button>
                </div>
                {formError && <div dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</div>}
                <Link href="/accounts/login" className="bg-green-600 hover:border-4 border-green-400 rounded-md w-1/3 mx-auto py-2 font-[Yekan-Medium] text-center text-white">ورود</Link>
            </form>
        </div>
    )
};

export default Page;
