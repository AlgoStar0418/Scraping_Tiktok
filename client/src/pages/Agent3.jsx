import { Form, Modal, Input, Select, Row, Button } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import LogoText from "../components/logo/LogoText";
import Dragger from "antd/es/upload/Dragger";
import logoImage from "../assets/logo.png";
import { InboxOutlined } from "@ant-design/icons";
import api from "../lib/axios";

const Agent3 = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const handleShowPostModal = () => {
    setShowPostModal(true);
  };
  const handleClosePostModal = () => {
    setShowPostModal(false);
  };

  const handleSavePost = (values) => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("file", values.file[0].originFileObj);
        formData.append("platforms", values.platforms);
        formData.append("file_format", values.file[0].type.split("/")[1]);
        const res = await api.post("/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        resolve(res.data);
      } catch (error) {
        console.log(error)
        reject(error.response.data.error);
      }
    });
  };

  const renderMessage = (message) => {
    // error.message might include url if there is url enclose it with anchor tags
    // but it can have brah brah url brah brah just enclose that particular url

    const regex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(regex);
    if (urls) {
      urls.forEach((url) => {
        message = message.replace(
          url,
          `<a href="${url}" class="text-[blue] hover:text-[blue]" target="_blank">${url}</a>`
        );
      });
    }

    return message;
  };
  return (
    <>
      <Modal
        open={showPostModal}
        onCancel={() => {
          handleClosePostModal();
        }}
        okButtonProps={{
          className: "hidden",
        }}
        cancelButtonProps={{
          className: "hidden",
        }}
        okText="Post"
      >
        <Form
          layout="vertical"
          onFinish={async (values) => {
            toast.promise(handleSavePost(values), {
              loading: "Posting...",

              error: (errors) => {
                return (
                  <div>
                    {errors.map((error, index) => (
                      <div key={index}>
                        {error.platform && (
                          <div>
                            <span className="text-[#4444d8] font-medium">
                              Platform
                            </span>{" "}
                            : {error.platform}
                          </div>
                        )}
                        <div>
                          <span className="text-[#4444d8] font-medium">
                            Message
                          </span>
                          :{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderMessage(error.message),
                            }}
                          ></span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              },
              success: (data) => {
                handleClosePostModal();
                return "Posted successfully";
              },
            });
          }}
          className="mt-6 mb-10 flex flex-col items-center"
        >
          <img src={logoImage} className="mb-2 w-[4rem]" />
          <LogoText />
          <Form.Item
            label="Post Title"
            name="title"
            rules={[
              {
                required: true,
                min: 3,
              },
            ]}
            className="mb-1 mt-5 w-full"
          >
            <Input placeholder="Post Title..." />
          </Form.Item>
          <Form.Item
            label="Post Description"
            name="description"
            className="mb-5 w-full"
            rules={[
              {
                required: true,
                min: 5,
              },
            ]}
          >
            <Input placeholder="Post Descriptioni..." />
          </Form.Item>

          <Form.Item
            className="mb-4"
            name="file"
            rules={[{ required: true }]}
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
          >
            <Dragger
              name="file"
              multiple={false}
              maxCount={1}
              beforeUpload={() => false}
              listType="picture-card"
              accept="video/*,image/*"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item
            name="platforms"
            className="w-full"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              allowClear
              className="w-full"
              placeholder="Please select"
              options={[
                {
                  value: "pinterest",
                  label: "Pinterest",
                },
                {
                  value: "instagram",
                  label: "Instagram",
                },
                {
                  value: "facebook",
                  label: "Facebook",
                },
                {
                  value: "twitter",
                  label: "Twitter",
                },
                {
                  value: "linkedin",
                  label: "Linkedin",
                },
                {
                  value: "tiktok",
                  label: "Tiktok",
                },
                {
                  value: "youtube",
                  label: "Youtube",
                },
                {
                  value: "gmb",
                  label: "Google My Business",
                },
                {
                  value: "reddit",
                  label: "Reddit",
                },
                {
                  value: "fbg",
                  label: "Facebook Group",
                },
                {
                  value: "telegram",
                  label: "Telegram",
                },
              ]}
            ></Select>
          </Form.Item>
          <Row justify="end" className="gap-4 w-full">
            <Button onClick={handleClosePostModal}>Cancel</Button>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#3636f8] hover:bg-[#2828df]"
              >
                Create
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
      <div className="w-full h-screen flex items-center justify-center">
        <button
          className="bg-[#3030f3] text-white py-2 px-4 rounded-md"
          onClick={() => {
            handleShowPostModal();
          }}
        >
          Post
        </button>
      </div>
    </>
  );
};

export default Agent3;
