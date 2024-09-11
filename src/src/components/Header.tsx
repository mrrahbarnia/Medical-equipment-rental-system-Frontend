"use client"
import { BiCategoryAlt } from "react-icons/bi"; 
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb"; 
import { RiLockPasswordLine } from "react-icons/ri"; 
import { MdManageAccounts } from "react-icons/md";
import { FaBriefcaseMedical } from "react-icons/fa";
import { BiMenu } from "react-icons/bi"; 
import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { useAuth } from "@/contexts/authProvider";
import Link from "next/link";

const INTERNAL_LOGOUT_API: string = "/apis/logout/"

export const Header = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const auth = useAuth();

    const logoutHandler = async() => {
        auth.logout()
        return await fetch(INTERNAL_LOGOUT_API);
    }

    const showProfileHandler = () => {
        setShowProfile(!showProfile);
        if (showMobileMenu) {
            return setShowMobileMenu(false);
        }
    }

    const showMobileMenuHandler = () => {
        setShowMobileMenu(!showMobileMenu);
        if (showProfile) {
            return setShowProfile(false);
        }
    }

    return <nav className="z-30 mt-4 flex items-center w-10/12 justify-between fixed left-0 right-0 mx-auto backdrop-blur-sm">
        <div className="flex items-center space-x-2">
            {auth.isAuthenticated && <div className="cursor-pointer relative" onClick={showProfileHandler}>
                <MdManageAccounts size={25} />
                {showProfile && <div className="z-40 shadow-lg bg-white absolute p-3 rounded-md min-w-40 space-y-2">
                    {auth.rule === "admin" && <div className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm ">
                        <Link href="/admin/" className="font-[Yekan-Bold]">همه آگهی ها</Link>
                        <MdOutlineAdminPanelSettings size={20} />
                    </div>}
                    {auth.rule === "admin" && <div className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm ">
                        <Link href="/categories/" className="font-[Yekan-Bold]">دسته بندی ها</Link>
                        <BiCategoryAlt size={20} />
                    </div>}
                    <div className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm ">
                        <Link href="/my-advertisement/" className="font-[Yekan-Bold]">آگهی های من</Link>
                        <TbBrandGoogleAnalytics size={20} />
                    </div>
                    <div className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm">
                        <Link href="/accounts/change-password/" className="font-[Yekan-Bold]">تغییر رمز عبور</Link>
                        <RiLockPasswordLine size={20} />
                    </div>
                    <hr />
                    <div className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm">
                        <li onClick={logoutHandler} className="font-[Yekan-Bold] -bottom-4 list-none">خروج</li>
                        <FaSignOutAlt size={20} />
                    </div>
                </div>}
            </div>}
            <div className="relative lg:hidden">
                <BiMenu size={25} className="block cursor-pointer" onClick={showMobileMenuHandler}/>
                {showMobileMenu && <div className="shadow-lg flex flex-col text-black gap-3 items-end justify-center min-w-40 p-3 absolute top-8 bg-white rounded-md">
                    {!auth.isAuthenticated && <div className="hover:bg-slate-100 w-full px-3 py-1 rounded-md flex items-center justify-end">
                        <Link href="/accounts/login" className="font-[Yekan-Medium] text-sm">ورود/ثبت نام</Link>
                        <RiAccountCircleFill size={25} className="cursor-pointer" />
                    </div>}
                    <Link href="/" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">خانه</Link>
                    <Link href="/advertisement" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">آگهی ها</Link>
                    <Link href="/add-advertisement/" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">ثبت آگهی</Link>
                    <Link href="/ticket/" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">تماس با ما</Link>
                </div>}
            </div>
        </div>
        
        {/* Menu links for lg */}
        <div className=" items-center space-x-10 hidden lg:inline-flex">
            {!auth.isAuthenticated && <div className="flex items-center space-x-2 hover:text-slate-400">
                <Link href="/accounts/login" className="font-[Yekan-Medium] text-sm">ورود/ثبت نام</Link>
                <RiAccountCircleFill size={25} className="cursor-pointer" />
            </div>}
            <Link href="/ticket/" className="font-[Yekan-Medium] text-sm hover:text-slate-400">تماس با ما</Link>
            <Link href="/add-advertisement/" className="font-[Yekan-Medium] text-sm hover:text-slate-400">ثبت آگهی</Link>
            <Link href="/advertisement" className="font-[Yekan-Medium] text-sm hover:text-slate-400">آگهی ها</Link>
            <Link href="/" className="font-[Yekan-Medium] text-sm hover:text-slate-400">خانه</Link>
            
        </div>

        <Link href="/" className="flex items-center space-x-4 cursor-pointer">
            <p className="font-[Yekan-Bold] text-3xl">جاره</p>
            <FaBriefcaseMedical size={30} />
        </Link>
    </nav>
};