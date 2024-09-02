import Image from "next/image";
import Link from "next/link";
export interface AdvertisementInterface {
    id: string,
    title: string,
    description: string,
    place: string,
    image: string,
    categoryName: string
}

const AdItem = ({ad}: {key: string, ad: AdvertisementInterface}) => {
    return (
        <Link href="/" className="shadow-md cursor-pointer h-auto gap-2 flex flex-col p-2 rounded-md justify-end hover:-translate-y-1 transition duration-500">
            <div className="flex gap-3 h-32">
                <div className="flex flex-col gap-3">
                    <p className="font-[Yekan-Medium] text-right text-sm">{ad.title}</p>
                    <p className="leading-4 overflow-hidden h-full font-[Yekan-Medium] text-xs text-right">{ad.description}</p>
                </div>
                <Image className="w-32 h-32 object-fill" width={100} height={100} alt={ad.title} src={ad.image} />
            </div>
            <hr />
            <div className="flex flex-col items-end gap-2">
                <span className="text-white font-[Yekan-Medium] text-sm text-right bg-green-600 w-fit py-1 px-2 rounded-md">دسته بندی:{ad.categoryName}</span>
                <span className="font-[Yekan-Medium] text-sm">آدرس:{ad.place}</span>
            </div>
        </Link>
    )
}

export default AdItem;