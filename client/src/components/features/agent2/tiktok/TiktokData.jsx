import { Button } from "antd";
import React from "react";
import { BsCheck } from "react-icons/bs";
import { CheckOutlined } from "@ant-design/icons";

const TikTokData = ({ selected, onSelect, ...data }) => {
  return (
    <div className="flex flex-col items-end gap-4">
      <Button
        className={selected === data.id ? "bg-[#5555f5]" : ""}
        type={selected === data.id ? "primary" : "default"}
        size="large"
        shape="circle"
        icon={
          <CheckOutlined size={25} color={selected === data.id ? "white" : ""} />
        }
        onClick={() => {
          onSelect(data.id);
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: generateIframe(data.id),
        }}
      />
    </div>
  );
};

const generateIframe = (id) => {
  return `
  <iframe
  style="
  width: 100%;
  height: 739px;
  display: block;
  visibility: unset;
  max-height: 739px;
  "
  name="__tt_embed__v58417145012895540"
  sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
  src="https://www.tiktok.com/embed/v2/${id}?lang=en-US&embedFrom=oembed"
  ></iframe>
  `;
};

export default TikTokData;
