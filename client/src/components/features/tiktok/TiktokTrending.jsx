import { useQuery } from "react-query";
import { Oval } from "react-loader-spinner";
import TikTokService from "../../../services/tiktok.service";
import { Alert } from "antd";
import TikTokData from "./TiktokData";

const TiktokTrending = ({ limit, scrap, doScraping }) => {
  const { data, isLoading, isError, error } = useQuery(
    ["tiktok-trending", scrap, doScraping],
    () => TikTokService.getTrending(limit),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: scrap,
    }
  );
  return isError ? (
    <div className="mt-7">
      <Alert message={error.message} className="p-7 font-bold" type="error" />
    </div>
  ) : isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Oval
        height={80}
        width={80}
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4fa94d"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  ) : (
    scrap && (
      <div className="grid grid-cols-3 gap-4">
        {data.map((tiktok, index) => (
          <TikTokData key={index} {...tiktok} />
        ))}
      </div>
    )
  );
};

export default TiktokTrending;
