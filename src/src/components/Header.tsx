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
import Image from "next/image";

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

    return <nav className="z-30 mt-4 flex items-center w-10/12 rounded-full p-1 justify-between fixed left-0 right-0 mx-auto backdrop-blur-sm">
        <div className="flex items-center space-x-2">
            {auth.isAuthenticated && <div className="cursor-pointer relative" onClick={showProfileHandler}>
                <MdManageAccounts size={25} />
                {showProfile && <div className="z-40 shadow-lg bg-white absolute p-3 rounded-md min-w-40 space-y-2">
                    {auth.rule === "admin" && <Link href="/admin/" className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm ">
                        <span className="font-[Yekan-Bold]">همه آگهی ها</span>
                        <MdOutlineAdminPanelSettings size={20} />
                    </Link>}
                    {auth.rule === "admin" && <Link href="/categories/" className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm ">
                        <span className="font-[Yekan-Bold]">دسته بندی ها</span>
                        <BiCategoryAlt size={20} />
                    </Link>}
                    <Link href="/my-advertisement/"  className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm ">
                        <span className="font-[Yekan-Bold]">آگهی های من</span>
                        <TbBrandGoogleAnalytics size={20} />
                    </Link>
                    <Link href="/accounts/change-password/" className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm">
                        <span className="font-[Yekan-Bold]">تغییر رمز عبور</span>
                        <RiLockPasswordLine size={20} />
                    </Link>
                    <hr />
                    <div onClick={logoutHandler} className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm">
                        <li  className="font-[Yekan-Bold] -bottom-4 list-none">خروج</li>
                        <FaSignOutAlt size={20} />
                    </div>
                </div>}
            </div>}
            <div className="relative lg:hidden">
                <BiMenu size={25} className="block cursor-pointer" onClick={showMobileMenuHandler}/>
                {showMobileMenu && <div className="shadow-lg flex flex-col text-black gap-3 items-end justify-center min-w-40 p-3 absolute top-8 bg-white rounded-md">
                    {!auth.isAuthenticated && <Link onClick={() => {
                        setShowMobileMenu(false);
                    }} href="/accounts/login" className="hover:bg-slate-100 w-full px-3 py-1 rounded-md flex items-center justify-end">
                        <span className="font-[Yekan-Medium] text-sm">ورود/ثبت نام</span>
                        <RiAccountCircleFill size={25} className="cursor-pointer" />
                    </Link>}
                    <Link onClick={() => {
                        setShowMobileMenu(false);
                    }} href="/" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">خانه</Link>
                    <Link onClick={() => {
                        setShowMobileMenu(false);
                    }} href="/advertisement" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">آگهی ها</Link>
                    <Link onClick={() => {
                        setShowMobileMenu(false);
                    }} href="/add-advertisement/" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">ثبت آگهی</Link>
                    <Link onClick={() => {
                        setShowMobileMenu(false);
                    }} href="/ticket/" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">تماس با ما</Link>
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

        <Link href="/" className="flex items-center space-x-4 cursor-pointer hover:scale-125 transition-transform duration-300">
                <Image src="/images/Logo.png" alt="Logo image" width={1920} height={1200} className="w-12 h-12 object-contain bg-transparent" />
        </Link>
    </nav>
};