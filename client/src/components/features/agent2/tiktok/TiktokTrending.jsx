import { useQuery } from "react-query";
import { Oval } from "react-loader-spinner";
import TikTokService from "../../../../services/tiktok.service";
import { Alert, Form, Input, Modal, Select } from "antd";
import TikTokData from "./TiktokData";
import { useState } from "react";
import LogoText from "../../../logo/LogoText";
import { AiOutlinePlus } from "react-icons/ai";
import logoImage from "../../../../assets/logo.png";

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
  const [openProfile, setOpenProfile] = useState(false);

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
    <>
      <Modal
        open={openProfile}
        onCancel={() => setOpenProfile(false)}
        onOk={() => {
          setOpenProfile(false);
        }}
        okButtonProps={{
          className: "bg-[#3131ec] text-white",
        }}
        title="Available Profiles"
      >
        <Form
          layout="vertical"
          onFinish={(values) => {}}
          className="mt-6 mb-10 flex flex-col items-center"
        >
          <img src={logoImage} className="mb-2 w-[4rem]" />
          <LogoText />
          <Form.Item
            className="mb-5 w-full"
            label="Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Name..." />
          </Form.Item>
          <Form.Item
            className="mb-5 w-full"
            name="voice"
            label="Voice"
            rules={[{ required: true }]}
          >
            <Input placeholder="Voice..." />
          </Form.Item>
          <Form.Item
            className="mb-5 w-full"
            name="Age"
            label="Age"
            rules={[{ required: true }]}
          >
            <Input placeholder="Age..." />
          </Form.Item>
          <Form.Item
            className="mb-5 w-full"
            name="gender"
            label="Gender"
            rules={[{ required: true, enum: ["male", "female"] }]}
          >
            <Select
              placeholder="Select Gender"
              options={[
                {
                  label: "Male",
                  value: "male",
                },
                {
                  label: "Female",
                  value: "female",
                },
              ]}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>

      <button
        onClick={() => {
          setOpenProfile(true);
        }}
        className="p-7 ml-10 mb-4 cursor-pointer border-2 border-[#2c2c2c] rounded-md w-fit"
      >
        <AiOutlinePlus size={35} />
      </button>

      <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.videos?.map((tiktok, index) => (
          <TikTokData
            key={index}
            onSelect={(id) => setSelected(id)}
            selected={selected}
            {...tiktok}
          />
        ))}
      </div>
    </>
  );
};

export default TiktokTrending;
