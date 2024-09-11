import { adminAdType } from "@/hooks/useAllAds";
import AdminItemAd from "./AdminItemAd";

const AdminListAds = ({ads}: {ads: adminAdType[]}) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            {ads.map(ad => <AdminItemAd key={ad.id} ad={ad} />)}
        </div>
    )
    
};

export default AdminListAds;