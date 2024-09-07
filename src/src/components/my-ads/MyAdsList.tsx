import MyAdsItem from "./MyAdsItem";
import { MyAdsType } from "@/hooks/useMyAds";

const MyAdsList = ({adsList}: {adsList: MyAdsType[]}) => {
    return (
        <div className="mx-auto flex flex-col gap-3 w-full min-[500px]:w-[460px]">
            {adsList.map(ad => <MyAdsItem key={ad.id} ad={ad} />)}
        </div>
    )
};

export default MyAdsList;