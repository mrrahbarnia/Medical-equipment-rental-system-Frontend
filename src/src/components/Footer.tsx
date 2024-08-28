"use client"
import Link from "next/link";
import { FaBriefcaseMedical } from "react-icons/fa";
import { Fragment } from "react";

export const Footer = () => {
    return (
        <Fragment>
            <hr className="mb-3 mt-20"/>
            <nav className="flex items-center justify-between w-11/12 mx-auto my-6">
                
                <div className="text-gray-400 space-x-6 flex items-center">
                    <div className="hover:text-gray-300 cursor-pointer font-[Yekan-Medium] text-xs hover:scale-105 transition">
                        <Link href="/ticket/">تماس با ما</Link>
                    </div>
                    <div className="hover:text-gray-300 cursor-pointer font-[Yekan-Medium] text-xs hover:scale-105 transition">
                        <Link href="#">قوانین و شرایط</Link>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="font-[Yekan-Bold] text-white text-xl">جاره</span>
                    <FaBriefcaseMedical size={25} className="text-white" />
                </div>
            </nav>
        </Fragment>
    )
};
