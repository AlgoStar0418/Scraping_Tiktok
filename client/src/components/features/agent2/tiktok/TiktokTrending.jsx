import { useQuery } from "react-query";
import { Oval } from "react-loader-spinner";
import TikTokService from "../../../../services/tiktok.service";
import { Alert } from "antd";
import TikTokData from "./TiktokData";
import { useState } from "react";

const TiktokTrending = ({ limit, redo }) => {
  const { data, isLoading, isError, error } = useQuery(
    ["tiktok-trending", limit, redo],
    async () => await TikTokService.getTrending(limit),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  const [selected, setSelected] = useState(null);
  return isError ? (
    <div className="mt-7">
      <Alert
        message={error.message}
        description={error.response.data.error}
        className="p-7 font-bold"
        type="error"
      />
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
    <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.trending?.map((tiktok, index) => (
        <TikTokData
          key={index}
          onSelect={(id) => setSelected(id)}
          selected={selected}
          {...tiktok}
        />
      ))}
    </div>
  );
};

export default TiktokTrending;
