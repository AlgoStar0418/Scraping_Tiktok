import { Modal } from "antd";
import { useState } from "react";
import ScrapTiktok from "../forms/dashboard/ScrapTiktok";
import TiktokTrending from "./tiktok/TiktokTrending";

const ProjectView = () => {
  const project = {
    uid: "13232-rewrq343-ras3432",
    key: "1",
    name: "Tiktok Video Downloader",
    type: "Tiktok",
    status: "Running",
    desc: "This is a project to download tiktok videos",
    lastUsedAt: "2 days ago",
    createdAt: "4 months ago",
  };
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [limit, setLimit] = useState(60);
  const handleChangeLimit = (limit) => setLimit(limit);
  const [scrap, setScrap] = useState(false);
  const [doScraping, setDoScraping] = useState(false);
  const handleScraping = () => {
    if (!scrap) setScrap(true);
    setDoScraping(!doScraping);
    handleCloseModal();
  };

  return (
    <div>
      <div className="border p-8 rounded-md ">
        <div className="text-lg border-b pb-4 font-bold text-gray-800">
          General
        </div>
        <div className="grid grid-cols-2 mt-4 gap-8 p-2">
          <div className="flex items-center gap-4">
            <div className="font-bold text-gray-600 w-[7rem] ">
              Name:&nbsp;&nbsp;
            </div>
            <div>{project.name}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-bold text-gray-600 w-[7rem] ">
              Type:&nbsp;&nbsp;
            </div>
            <div>{project.type}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="font-bold text-gray-600 w-[7rem] ">
                Status:&nbsp;&nbsp;
              </div>
              <div>{project.status}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="font-bold text-gray-600 w-[7rem] ">
                Description:&nbsp;&nbsp;
              </div>
              <div>{project.desc}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-bold text-gray-600 w-[7rem] ">
              Created:&nbsp;&nbsp;
            </div>
            <div>{project.createdAt}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-bold text-gray-600 w-[7rem] ">
              Last used:&nbsp;&nbsp;
            </div>
            <div>{project.lastUsedAt}</div>
          </div>
        </div>
      </div>
      <button
        onClick={handleShowModal}
        className="bg-[#3131ec] block text-white p-2 rounded-md mt-4  ml-auto w-fit"
      >
        Scrap Tiktok
      </button>
      <Modal
        open={showModal}
        title="Scrap Tiktok Trending Videos"
        onCancel={handleCloseModal}
        okText="Scrap"
        okButtonProps={{
          className: "bg-[#3131ec] text-white",
        }}
        onOk={handleScraping}
      >
        <ScrapTiktok handleChangeLimit={handleChangeLimit} />
      </Modal>
      <TiktokTrending limit={limit} doScraping={doScraping} scrap={scrap} />
    </div>
  );
};

export default ProjectView;
