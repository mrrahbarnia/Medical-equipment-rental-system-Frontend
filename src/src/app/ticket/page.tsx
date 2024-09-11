"use client"
import axios from "axios";
import { useState } from "react";
import { FormEvent } from "react";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { errorHandler } from "@/utils/messageUtils";

const EXTERNAL_SEND_TICKET_API: string = `${EXTERNAL_BASE_ENDPOINTS}/tickets/create-ticket/`;

const Page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    const [feedBack, setFeedBack] = useState<string>("");

    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;        

        axios.post(EXTERNAL_SEND_TICKET_API, {
                email: eventForm.email.value,
                name: eventForm.userName.value,
                message: eventForm.message.value
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).then(() => {
            setIsLoading(false);
            setName(""),
            setEmail("");
            setMessage("");
            return errorHandler("نظر شما با موفقیت ارسال شد,در صورت لزوم با شما ارتباط برقرار خواهیم کرد.", setFeedBack)
        }).catch(() => {
            setIsLoading(false);
            return errorHandler("دوباره تلاش کنید.", setFormError);
        })
    }

    const isSubmitDisabled = email.length === 0 || name.length === 0 || message.length === 0
    return (
        <div className="pt-44 w-full min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5 px-2 m-auto h-screen">
            <form className="w-full py-16 px-6 rounded-lg flex flex-col gap-6 shadow-lg bg-gradient-to-b from-white to-gray-200" onSubmit={formSubmitHandler}>
                <h1 className="font-[Yekan-Bold] text-lg mx-auto">فرم ارسال نظر</h1>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">ایمیل</label>
                    <input type="email" name="email" placeholder="example@gmail.com" className="rounded-md border-2 outline-1 py-2 px-3 w-full" onChange={(event) => setEmail(event.target.value)} value={email}/>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">نام</label>
                    <input dir="rtl" type="text" name="userName" className="rounded-md border-2 outline-1 py-2 px-3 w-full" onChange={(event) => setName(event.target.value)} value={name}/>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">پیام</label>
                    <textarea dir="rtl" name="message" rows={5} className="resize-none rounded-md outline-1 py-2 px-3 w-full" onChange={(event) => setMessage(event.target.value)} value={message}/>
                </div>
                <div className="flex flex-col mx-auto gap-3">
                    <button className="hover:text-white hover:bg-gradient-to-tr from-orange-700 to-orange-300 w-24 transition mx-auto rounded-md py-2 font-[Yekan-Medium] disabled:pointer-events-none disabled:text-gray-400" disabled={isSubmitDisabled || isLoading} type="submit">{isLoading ? "صبر کنید" : "ارسال نظر"}</button>
                </div>
                {feedBack && <div dir="rtl" className="bg-green-700 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{feedBack}</div>}
                {formError && <div dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</div>}
            </form>
        </div>
    )
};

export default Page;
