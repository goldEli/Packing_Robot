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

type Project = { id: string; name: string; url: string }[];

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const [form] = Form.useForm();
  const [projectList] = useProject();
  const [branchList, setBranchList] = React.useState([]);

  React.useEffect(() => {
    const defaultData = getDefaultFromStorage();

    form.setFieldsValue({ [formInfo.mention.key]: defaultData.mention });
    form.setFieldsValue({ [formInfo.command.key]: defaultData.command });
  }, [form]);

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const onProjectChange = (id: string) => {
    postData("/branch_list", { id }).then((data) => {
      setBranchList(data);
      form.setFieldsValue({ [formInfo.branch.key]: data[0] });
    });
  };
  console.log(typeof branchList, branchList);
  return (
    <Box>
      <FormArea>
        <Form
          {...layout}
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label={formInfo.project.label}
            name={formInfo.project.key}
            rules={[{ required: true, message: "请选择工程" }]}
          >
            <Select onChange={onProjectChange} placeholder="请选择工程">
              {projectList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={formInfo.branch.label}
            name={formInfo.branch.key}
            rules={[{ required: true, message: "请选择分支" }]}
          >
            <Select placeholder="请选择分支">
              {branchList.map((item) => {
                return (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={formInfo.mention.label}
            name={formInfo.mention.key}
            rules={[{ required: true, message: "请输入企业微信@的人" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formInfo.note.label}
            name={formInfo.note.key}
            rules={[{ required: true, message: "请输入备注信息" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label={formInfo.command.label}
            name={formInfo.command.key}
            rules={[{ required: true, message: "请输入打包命令" }]}
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

const useProject = (): [Project] => {
  const [data, setData] = React.useState<Project>([]);
  React.useEffect(() => {
    postData("/project_list").then((data) => setData(data));
  }, []);
  return [data];
};

async function postData(url: string, data: Object = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  // parses JSON response into native JavaScript objects
  return response
    .json()
    .then((data) =>
      data.status === 1 ? stringToObject(data.data) : Promise.reject()
    );
}

function getDefaultFromStorage() {
  const mention = formInfo.mention.key;
  const command = formInfo.command.key;
  const o = {
    mention: "xiangguojun",
    command: "npm run build",
  };
  const mentionValue = localStorage.getItem(mention);
  const commandValue = localStorage.getItem(command);
  if (mentionValue) {
    o.mention = mentionValue;
  } else {
    localStorage.setItem(mention, o.mention);
  }
  if (commandValue) {
    o.command = commandValue;
  } else {
    localStorage.setItem(command, o.command);
  }
  return o;
}

function stringToObject(str: any) {
  if (typeof str === "string") {
    return JSON.parse(str);
  }
  return str;
}

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
