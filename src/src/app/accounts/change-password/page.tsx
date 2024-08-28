"use client"
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { errorHandler } from "@/utils/messageUtils";
import { useAuth } from "@/contexts/authProvider";
import { useMessage } from "@/contexts/messageProvider";

const INTERNAL_CHANGE_PASSWORD_API: string = "/apis/change-password/"

const Page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");
    const message = useMessage();
    const auth = useAuth();
    const router = useRouter();
    const [oldPasswordValue, setOldPasswordValue] = useState("");
    const [newPasswordValue, setNewPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [showOldPassword, setShowOldPassword] = useState<"show" | "hidden">("show");
    const [showNewPassword, setShowNewPassword] = useState<"show" | "hidden">("show");
    const [showConfirmPassword, setShowConfirmPassword] = useState<"show" | "hidden">("show");

    useEffect(() => {
        auth.authenticatedPages();
    }, [auth])

    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;

        if (eventForm.newPassword.value !== eventForm.confirmPassword.value) {
            errorHandler("رمز های ورود جدید مطابقت ندارند.", setFormError);
            return setIsLoading(false);        
        }

        const response = await fetch(INTERNAL_CHANGE_PASSWORD_API, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oldPassword: eventForm.oldPassword.value,
                newPassword: eventForm.newPassword.value,
                confirmPassword: eventForm.confirmPassword.value
            })
        })
        const responseJson = await response.json()

        if (response.status === 401) {
            setIsLoading(false);
            return router.replace("/accounts/login/")
        }   
        
        if (responseJson?.detail === 'Old password is wrong') {
            errorHandler("رمز عبور قبلی وارد شده اشتباه است.", setFormError)
            setIsLoading(false);
            return;
        }

        if (response.ok) {
            setIsLoading(false);
            message.setLoginAccountMessage(() => "رمز عبور با موفقیت تغییر کرد,لطفا با رمز جدید وارد شوید.")
            return router.replace("/accounts/login/")
        }
    }

    const showOldPasswordHandler = () => {
        if (showOldPassword === "hidden") {
            setShowOldPassword("show");
        } else {
            setShowOldPassword("hidden");
        }
    }

    const showNewPasswordHandler = () => {
        if (showNewPassword === "hidden") {
            setShowNewPassword("show");
        } else {
            setShowNewPassword("hidden");
        }
    }

    const showConfirmPasswordHandler = () => {
        if (showConfirmPassword === "hidden") {
            setShowConfirmPassword("show");
        } else {
            setShowConfirmPassword("hidden");
        }
    }

    const isSubmitDisabled = oldPasswordValue.length === 0 || newPasswordValue.length === 0 || confirmPasswordValue.length === 0
    return (
        <div className="pt-44 w-full min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5 px-2 m-auto h-screen">
            <form className="w-full py-16 px-6 rounded-lg shadow-sm shadow-blue-900 flex flex-col gap-6" onSubmit={formSubmitHandler}>
                <h1 className="text-white font-[Yekan-Bold] text-lg mx-auto">فرم تغییر رمز عبور</h1>
                <div className="relative flex flex-col gap-2 items-end">
                    <label className="text-white font-[Yekan-Medium]">رمز عبور قبلی</label>
                    {oldPasswordValue.length > 0 && showOldPassword === "show" ? <AiFillEye size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showOldPasswordHandler} /> : oldPasswordValue.length > 0 && showOldPassword === "hidden" ? <AiFillEyeInvisible size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showOldPasswordHandler} />: undefined}
                    <input type={showOldPassword === "show" ? "password" : "text"} name="oldPassword" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setOldPasswordValue(event.target.value)} />
                </div>
                <div className="relative flex flex-col gap-2 items-end">
                    <label className="text-white font-[Yekan-Medium]">رمز عبور جدید</label>
                    {newPasswordValue.length > 0 && showNewPassword === "show" ? <AiFillEye size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showNewPasswordHandler} /> : newPasswordValue.length > 0 && showNewPassword === "hidden" ? <AiFillEyeInvisible size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showNewPasswordHandler} />: undefined}
                    <input type={showNewPassword === "show" ? "password" : "text"} placeholder="mM@123456" name="newPassword" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setNewPasswordValue(event.target.value)} />
                </div>
                <div className="relative flex flex-col gap-2 items-end">
                    <label className="text-white font-[Yekan-Medium]">تکرار رمز عبور جدید</label>
                    {confirmPasswordValue.length > 0 && showConfirmPassword === "show" ? <AiFillEye size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showConfirmPasswordHandler} /> : confirmPasswordValue.length > 0 && showConfirmPassword === "hidden" ? <AiFillEyeInvisible size={20} className="text-gray-500 absolute bottom-2 right-2 cursor-pointer" onClick={showConfirmPasswordHandler} />: undefined}
                    <input type={showConfirmPassword === "show" ? "password" : "text"} name="confirmPassword" className="rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setConfirmPasswordValue(event.target.value)} />
                </div>
                <div className="flex flex-col mx-auto gap-3">
                    <button className="text-white hover:bg-gradient-to-tr from-orange-700 to-orange-300 px-4 transition rounded-md py-2 font-[Yekan-Medium] disabled:pointer-events-none disabled:text-gray-600" disabled={isSubmitDisabled || isLoading} type="submit">{isLoading ? "صبر کنید" : "تغییر رمز عبور"}</button>
                </div>
                {formError && <div dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</div>}
            </form>
        </div>
    )
};

export default Page;
