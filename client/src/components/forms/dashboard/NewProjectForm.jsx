import { Input, Form } from "antd";
import logoImage from "../../../assets/logo.png";
import LogoText from "../../logo/LogoText";

const NewProjectForm = () => {
  return (
    <Form layout="vertical" className="mt-6 mb-10 flex flex-col items-center">
      <img src={logoImage} className="mb-2 w-[7rem]"/>
      <LogoText />
      <Form.Item label="Project Name" className="mb-1 w-full">
        <Input placeholder="Project name" />
      </Form.Item>
      <Form.Item label="Type" className="mb-1 w-full">
        <Input placeholder="Project type" />
      </Form.Item>
      <Form.Item label="Description" className="mb-1 w-full">
        <Input placeholder="Description" />
      </Form.Item>
    </Form>
  );
};

export default NewProjectForm;
