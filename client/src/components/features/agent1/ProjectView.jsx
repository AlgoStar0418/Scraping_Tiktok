import { Modal, Upload, Select } from "antd";
import { useState } from "react";
import ScrapTiktok from "../../forms/dashboard/ScrapTiktok";
import TiktokTrending from "./tiktok/TiktokTrending";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import ProjectService from "../../../services/project.service";
import { Oval } from "react-loader-spinner";
import Notfound from "../../../pages/Notfound";

const { Dragger } = Upload;

const ProjectView = () => {
  // const project = {
  //   uid: "13232-rewrq343-ras3432",
  //   key: "1",
  //   name: "Tiktok Video Downloader",
  //   type: "Tiktok",
  //   status: "Running",
  //   desc: "This is a project to download tiktok videos",
  //   lastUsedAt: "2 days ago",
  //   createdAt: "4 months ago",
  // };
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

  const searchParams = useParams();
  const projectId = searchParams["project_id"];

  const { data, isLoading, isError, error } = useQuery(
    ["project_id", projectId],
    async () => await ProjectService.getProjectById(projectId),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const renderDate = (date) => {
    return (
      new Date(date).toLocaleTimeString() +
      " " +
      new Date(date).toLocaleDateString()
    );
  };

  return isLoading ? (
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
  ) : isError ? (
    <Notfound />
  ) : (
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
            <div>{data.project.name}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-bold text-gray-600 w-[7rem] ">
              Type:&nbsp;&nbsp;
            </div>
            <div>{data.project.type}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="font-bold text-gray-600 w-[7rem] ">
                Status:&nbsp;&nbsp;
              </div>
              <div>{data.project.status}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="font-bold text-gray-600 w-[7rem] ">
                Description:&nbsp;&nbsp;
              </div>
              <div>{data.project.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-bold text-gray-600 w-[7rem] ">
              Created:&nbsp;&nbsp;
            </div>
            <div>{renderDate(data.project.created_at)}</div>
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

      <TiktokTrending
        limit={limit}
        doScraping={doScraping}
        scrap={scrap}
        project={projectId}
      />
    </div>
  );
};

export default ProjectView;
