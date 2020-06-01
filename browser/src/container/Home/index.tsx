import * as React from "react";
import { Form, Input, Button, Select } from "antd";
import styled from "styled-components";
import "antd/dist/antd.css";

interface IHomeProps {}

const formInfo = {
  projectName: { label: "项目名称", key: "projectName" },
  branch: { label: "分支", key: "branch" },
  mention: { label: "@谁", key: "mention" },
  note: { label: "备注", key: "note" },
};

const Home: React.FunctionComponent<IHomeProps> = (props) => {
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
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label={formInfo.projectName.label}
            name={formInfo.projectName.key}
          >
            <Select placeholder="">
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={formInfo.branch.label}
            name={formInfo.branch.key}
          >
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={formInfo.mention.label}
            name={formInfo.mention.key}
          >
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={formInfo.note.label}
            name={formInfo.note.key}
          >
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
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default Home;
