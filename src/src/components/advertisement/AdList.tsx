import { AdvertisementInterface } from "./AdItem";
import AdItem from "./AdItem";

const AdList = ({adsList}: {adsList: AdvertisementInterface[]}) => {
    return (
        <div className="grid grid-cols-1 min-[650px]:grid-cols-2 min-[520px]:w-10/12 min-[650px]:w-full mx-auto min-[1070px]:grid-cols-3 space-x-2 space-y-5">
            {adsList.map(ad => <AdItem key={ad.id} ad={ad} />)}
        </div>
        
    )
};

export default AdList;