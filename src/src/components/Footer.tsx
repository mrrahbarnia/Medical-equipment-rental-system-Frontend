"use client"
import Link from "next/link";
import { FaBriefcaseMedical } from "react-icons/fa";
import { Fragment } from "react";
import Image from "next/image";

export const Footer = () => {
    return (
        <Fragment>
            <hr className="mb-3 mt-20"/>
            <nav className="flex items-center justify-between w-11/12 mx-auto my-6">
                
                <div className="space-x-6 flex items-center">
                    <div className="hover:text-gray-600 cursor-pointer font-[Yekan-Medium] text-xs hover:scale-105 transition">
                        <Link href="/ticket/">تماس با ما</Link>
                    </div>
                    <div className="hover:text-gray-600 cursor-pointer font-[Yekan-Medium] text-xs hover:scale-105 transition">
                        <Link href="#">قوانین رنتشو</Link>
                    </div>
                </div>

                <Link href="/" className="flex items-center space-x-2">
                <Image src="/images/Logo.png" alt="Logo image" width={1920} height={1200} className="w-12 h-12 object-contain bg-transparent" />
                </Link>
            </nav>
        </Fragment>
    )
};
