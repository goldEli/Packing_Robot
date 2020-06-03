import * as React from "react";
import { Form, Input, Button, Select, Checkbox } from "antd";
import styled from "styled-components";
import "antd/dist/antd.css";

interface IHomeProps {}

const formInfo = {
  project: { label: "项目名称", key: "project" },
  branch: { label: "分支", key: "branch" },
  mention: { label: "@谁", key: "mention" },
  note: { label: "备注", key: "note" },
  command: { label: "打包命令", key: "command" },
};

const data = {
  project: [
    { id: "1", name: "ue智能化" },
    { id: "2", name: "miner" },
  ],
  branch: [
    { id: "1", name: "div" },
    { id: "2", name: "master" },
  ],
  mention: [
    { id: "1", name: "xiangguojun" },
    { id: "2", name: "zhangli" },
  ],
};

type Project = { id: string; name: string }[];

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const [project] = useProject();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Box>
      <FormArea>
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label={formInfo.project.label}
            name={formInfo.project.key}
            rules={[{ required: true, message: "请选择工程" }]}
          >
            <Select placeholder="请选择工程">
              {project.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label={formInfo.branch.label} name={formInfo.branch.key}>
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={formInfo.mention.label} name={formInfo.mention.key}>
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={formInfo.note.label} name={formInfo.note.key}>
            <Input></Input>
          </Form.Item>
          <Form.Item label={formInfo.command.label} name={formInfo.command.key}>
            <Input></Input>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </FormArea>
    </Box>
  );
};

const useProject = (): [Project] => {
  const [data, setData] = React.useState<Project>([]);
  React.useEffect(() => {
    fetch("/getProject")
      .then((response) => response.json())
      .then((data) => data.status === 1 ? data.data : Promise.reject())
      .then((data) => setData(data))
  }, []);
  return [data];
};

const Box = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding-top: 32px;
`;
const FormArea = styled.div`
  width: 500px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default Home;
