"use client"
import { MdOutlineDangerous } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { adminAdType } from "@/hooks/useAllAds";
import Link from "next/link";
import { Fragment, useState } from "react";
import usePublishAd from "@/hooks/usePublishAd";
import useUnpublishAd from "@/hooks/useUnpublishAd";
import useDeleteAd from "@/hooks/useDeleteAd";
import useBlockUser from "@/hooks/useBlockUser";
import useUnblockUser from "@/hooks/useUnblockUser";

const AdminItemAd = ({ad}: {ad: adminAdType}) => {
    const {publishedMutate} = usePublishAd();
    const {UnpublishedMutate} = useUnpublishAd();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const {deletePending, deleteMutate} = useDeleteAd();
    const {blockUserMutate} = useBlockUser();
    const {unblockUserMutate} = useUnblockUser();

    const publishedHandler = (id: string) => {
        publishedMutate(id);
    }

    const unPublishedHandler = (id: string) => {
        UnpublishedMutate(id);
    }

    const deleteHandler = (id: string) => {
        deleteMutate(id).then(() => setIsOpenModal(false));
    }

    const blockUserHandler = (phoneNumber: string) => {
        blockUserMutate(phoneNumber);
    }

    const unblockUserHandler = (phoneNumber: string) => {
        unblockUserMutate(phoneNumber);
    }

    return (
        <Fragment>
            {isOpenModal && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-50 bg-white rounded-lg h-56 items-center justify-center gap-7 w-80">
                <div className="flex items-center justify-center gap-1 p-3">
                    <p dir="rtl" className="font-[Yekan-Medium] overflow-hidden">مطمئن هستید؟</p>
                    <MdOutlineDangerous size={25} className="text-red-600" /> 
                </div>
                <div className="flex items-center gap-2">
                    <button className="font-[Yekan-Medium] bg-green-50 text-green-600 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200" onClick={() => setIsOpenModal(false)}>خیر</button>
                    <button className="font-[Yekan-Black] bg-red-50 text-red-500 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200" onClick={() => deleteHandler(ad.id)}>{!deletePending ? "بله" : <AiOutlineLoading3Quarters size={22} className="animate-spin" />}</button>
                </div>
            </div>}
            <div className="flex gap-6 flex-col items-center">
                <Link href={`/admin/${ad.id}/`} className="rounded-md  hover:bg-gray-200 p-2 flex gap-3 items-center justify-center">
                    <p className="font-mono">{ad.phoneNumber}</p>
                    <span className={`font-[Yekan-Medium] text-sm text-white px-2 py-1 rounded-md ${ad.published ? "bg-green-600" : "bg-red-600"}`}>{ad.published ? "منتشر شده" : "منتشر نشده" }</span>
                    <span className={`font-[Yekan-Medium] text-sm text-white px-2 py-1 rounded-md ${ad.isDeleted ? "bg-red-600" : "bg-green-600"}`}>{ad.isDeleted ? "پاک شده" : "پاک نشده" }</span>
                </Link>
                {ad.isBanned && <span className="font-[Yekan-Medium] text-sm bg-red-200 rounded-md px-1 text-red-600" dir="rtl">حساب کاربری مسدود شده است.</span>}
                <div className="flex items-center gap-3">
                    {ad.isBanned && <button onClick={() => unblockUserHandler(ad.phoneNumber)} type="button" className="font-[Yekan-Medium] p-1 rounded-md bg-green-50 text-green-600 hover:bg-green-200 active:bg-green-200">لغو مسدودیت حساب</button>}
                    {!ad.isBanned && <button onClick={() => blockUserHandler(ad.phoneNumber)} type="button" className="font-[Yekan-Medium] p-1 rounded-md bg-red-50 text-red-600 hover:bg-red-200 active:bg-red-200">بستن حساب کاربری</button>}
                    {!ad.published && <button type="button" className="font-[Yekan-Medium] p-1 bg-violet-100 hover:bg-violet-300 active:bg-violet-300 transition-colors text-violet-800 rounded-md" onClick={() => publishedHandler(ad.id)}>انتشار</button>}
                    {ad.published && <button type="button" className="font-[Yekan-Medium] p-1 bg-yellow-100 hover:bg-yellow-300 active:bg-yellow-300 transition-colors text-yellow-800 rounded-md" onClick={() => unPublishedHandler(ad.id)}>لغو انتشار</button>}
                    <button type="button" className="p-1 bg-red-50 hover:bg-red-200 active:bg-red-200 transition-colors text-red-500 rounded-md" onClick={() => setIsOpenModal(true)}><MdOutlineDeleteOutline size={25} /></button>
                </div>
            </div>
            <hr className="border-1 border-gray-300 w-10/12" />
            {isOpenModal && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
        </Fragment>
    )
};

export default AdminItemAd;