"use client"
import { AiOutlineClockCircle } from "react-icons/ai";
import { HiOutlineEye } from "react-icons/hi";
import Image from "next/image"
import useMostViewedAds from "@/hooks/useMostViewedAds"
import TimeAgo from 'react-time-ago';
import TimeAgoModule from 'javascript-time-ago';
import fa from 'javascript-time-ago/locale/fa.json';
import useRecentAds from "@/hooks/useRecentAds"
import Link from "next/link"

TimeAgoModule.addDefaultLocale(fa);

export default function Page() {
  const {mostViewedData, mostViewedIsPending} = useMostViewedAds();
  const {recentAdsData, recentAdsIsPending} = useRecentAds();

  return (
    <div className="min-h-screen">
      <Image priority src={"/images/banner.jpeg"} alt="banner-image" width={500} height={500} className="w-full object-contain" />

      <div className="flex flex-col gap-12">

        {/* Recent Ads */}
        {recentAdsIsPending ? <p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p> : <div className="flex flex-col items-end gap-6 pt-12 pr-3">
          <h2 className="font-[Yekan-Bold]">جدیدترین آگهی ها</h2>
          <div dir="rtl" className="font-[Yekan-Medium] flex gap-3 overflow-x-auto no-scroll whitespace-nowrap w-full">
            {recentAdsData?.map(ad => {
              return <Link href={`/advertisement/${ad.id}/`} key={ad.id} className="bg-gray-100 p-1 rounded-md flex flex-col gap-2 w-60 flex-shrink-0 hover:bg-gray-300 active:bg-gray-300 transition duration-300">
                  <p className="text-sm overflow-hidden text-ellipsis">{ad.title}</p>
                  <Image src={ad.imageUrl} className="rounded-md w-full bg-white h-36 object-contain" alt={`${ad.title} image`} width={100} height={100}/>
                  <p className="text-xs bg-green-600 py-1 px-2 rounded-md text-white w-full overflow-hidden text-ellipsis">دسته بندی:{ad.categoryName}</p>
                  <div className="text-sm bg-gradient-to-l text-violet-800 from-violet-50 to-violet-300 rounded-md flex items-center gap-[1px]">
                    <AiOutlineClockCircle size={15} />
                    <TimeAgo date={ad.createdAt} locale="fa" />
                  </div>
              </Link>
            })}
          </div>
        </div>}

        {/* MostViewedAds */}
        {mostViewedIsPending ? <p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p> : <div className="flex flex-col items-end gap-6 pt-12 pr-3">
          <h2 className="font-[Yekan-Bold]">پربازدیدترین آگهی ها</h2>
          <div dir="rtl" className="font-[Yekan-Medium] flex gap-3 overflow-x-auto no-scroll whitespace-nowrap w-full">
            {mostViewedData?.map(ad => {
              return <Link href={`/advertisement/${ad.id}/`} key={ad.id} className="bg-gray-100 p-1 rounded-md flex flex-col gap-2 w-60 flex-shrink-0 hover:bg-gray-300 active:bg-gray-300 transition duration-300">
                  <p className="text-sm overflow-hidden text-ellipsis">{ad.title}</p>
                  <Image src={ad.imageUrl} className="rounded-md w-full bg-white h-36 object-contain" alt={`${ad.title} image`} width={100} height={100}/>
                  <div className="flex items-center justify-between">
                    <p className="text-xs bg-green-600 py-1 px-2 rounded-md text-white max-w-44 overflow-hidden text-ellipsis">دسته بندی:{ad.categoryName}</p>
                    <div className="flex items-start text-white bg-violet-500 px-2 py-1 rounded-md gap-[1px]">
                      <span className="text-xs">{ad.views}</span>
                      <HiOutlineEye size={15} />
                    </div>
                  </div>
                  <div className="text-sm bg-gradient-to-l text-violet-800 from-violet-50 to-violet-300 rounded-md flex items-center gap-[1px]">
                    <AiOutlineClockCircle size={15} />
                    <TimeAgo date={ad.createdAt} locale="fa" />
                  </div>
              </Link>
            })}
          </div>
        </div>}

      </div>
    </div>
  )
}
