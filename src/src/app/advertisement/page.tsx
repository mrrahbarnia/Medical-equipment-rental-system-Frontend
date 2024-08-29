import { AiOutlineSearch } from "react-icons/ai";

const ADVERTISEMENT_LIST = [
    {"id": 1, "title": "تبلیغ اول", "description": }
]


const Page = () => {
    return (
        <div className="pt-40 w-11/12 mx-auto">
            <div className="flex flex-col gap-8">

                <h1 className="text-white font-[Yekan-Bold] text-center">لیست آگهی ها</h1>

                <div className="flex items-center justify-between">
                    <p className="text-white font-[Yekan-Medium]" dir="rtl">۱۲۰ آگهی</p>
                    <div className="flex gap-2 cursor-pointer">
                        <p className="text-white font-[Yekan-Medium]">فیلتر پیشرفته</p>
                        <AiOutlineSearch size={23} className="text-white" />
                    </div>
                </div>

            </div>

        </div>
    )
};

export default Page;