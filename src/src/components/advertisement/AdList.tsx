import { AdvertisementInterface } from "./AdItem";
import AdItem from "./AdItem";

const AdList = ({adsList}: {adsList: AdvertisementInterface[]}) => {
    return (
        <div className="grid grid-cols-1 min-[800px]:grid-cols-2 w-full mx-auto space-x-2 space-y-5">
            {adsList && adsList.map(ad => <AdItem key={ad.id} ad={ad} />)}
        </div>
        
    )
};

export default AdList;