"use client"
import { RiLockPasswordLine } from "react-icons/ri"; 
import { MdManageAccounts } from "react-icons/md";
import { FaBriefcaseMedical } from "react-icons/fa";
import { BiMenu } from "react-icons/bi"; 
import { MdOutlineManageAccounts } from "react-icons/md"; 
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
                <MdManageAccounts size={25} className="text-white" />
                {showProfile && <div className="bg-white absolute p-3 rounded-md min-w-40 space-y-2">
                    <div className="flex items-center justify-end space-x-2 hover:bg-slate-100 rounded-md px-3 py-1 text-sm ">
                        <Link href="#" className="font-[Yekan-Bold]">داشبورد</Link>
                        <MdOutlineManageAccounts size={20} />
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
                <BiMenu size={25} className="text-white block cursor-pointer" onClick={showMobileMenuHandler}/>
                {showMobileMenu && <div className="flex flex-col text-black gap-3 items-end justify-center min-w-40 p-3 absolute top-8 bg-white rounded-md">
                    {!auth.isAuthenticated && <div className="hover:bg-slate-100 w-full px-3 py-1 rounded-md flex items-center justify-end">
                        <Link href="/accounts/login" className="font-[Yekan-Medium] text-sm">ورود/ثبت نام</Link>
                        <RiAccountCircleFill size={25} className="cursor-pointer" />
                    </div>}
                    <Link href="/" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">خانه</Link>
                    <Link href="#" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">کودک</Link>
                    <Link href="#" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">استوری لاین</Link>
                    <Link href="#" className="hover:bg-slate-100 w-full text-right px-3 py-1 rounded-md font-[Yekan-Medium] text-sm">جدیدترین ها</Link>
                </div>}
            </div>
        </div>
        
        {/* Menu links for lg */}
        <div className=" items-center space-x-10 hidden lg:inline-flex">
            {!auth.isAuthenticated && <div className="flex items-center space-x-2 hover:text-slate-400 text-white">
                <Link href="/accounts/login" className="font-[Yekan-Medium] text-sm">ورود/ثبت نام</Link>
                <RiAccountCircleFill size={25} className="cursor-pointer" />
            </div>}
            <Link href="#" className="text-white font-[Yekan-Medium] text-sm hover:text-slate-400">جدیدترین ها</Link>
            <Link href="#" className="text-white font-[Yekan-Medium] text-sm hover:text-slate-400">استوری لاین</Link>
            <Link href="#" className="text-white font-[Yekan-Medium] text-sm hover:text-slate-400">کودک</Link>
            <Link href="/" className="text-white font-[Yekan-Medium] text-sm hover:text-slate-400">خانه</Link>
            
        </div>

        <Link href="/" className="flex items-center space-x-4 cursor-pointer">
            <p className="font-[Yekan-Bold] text-white text-3xl">جاره</p>
            <FaBriefcaseMedical size={30} className="text-white" />
        </Link>
    </nav>
};