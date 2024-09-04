import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect, useState } from "react";
import "./index.css";
import { layout_6_18 } from "../layout";
import { InboxOutlined } from "@ant-design/icons";
import Dragger, { DraggerProps } from "antd/es/upload/Dragger";
import { BASE_URL } from "@api/request";
import { getUserInfo, updateInfo, updateUserInfoCaptcha } from "@/api";
import { useDispatch } from "react-redux";
import { setUserInfoValue } from "@/store/userInfoSlice";

export interface UserInfo {
  username: string;
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

export function InfoModify() {
  const [form] = useForm();
  const dispatch = useDispatch();

  const onFinish = useCallback(async (values: UserInfo) => {
    const res = await updateInfo(values);

    if (res.status === 201 || res.status === 200) {
      const { message: msg, data } = res.data;
      if (msg === "success") {
        message.success("用户信息更新成功");
        setUserInfoValue;
        dispatch(setUserInfoValue({ key: "headPic", value: values.headPic }));
      } else {
        message.error(data);
      }
    } else {
      message.error("系统繁忙，请稍后再试");
    }
  }, []);

  const sendCaptcha = useCallback(async function () {
    const res = await updateUserInfoCaptcha();
    if (res.status === 201 || res.status === 200) {
      message.success(res.data.data);
    } else {
      message.error("系统繁忙，请稍后再试");
    }
  }, []);

  useEffect(() => {
    async function query() {
      const res = await getUserInfo();

      const { data } = res.data;

      if (res.status === 201 || res.status === 200) {
        form.setFieldValue("headPic", data.headPic);
        form.setFieldValue("nickName", data.nickName);
        form.setFieldValue("email", data.email);
      }
    }
    query();
  }, []);

  return (
    <div id="updateInfo-container">
      <Form
        form={form}
        {...layout_6_18}
        onFinish={onFinish}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="头像"
          name="headPic"
          rules={[{ required: true, message: "请输入头像!" }]}
          shouldUpdate
        >
          <HeadPicUpload></HeadPicUpload>
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: "请输入昵称!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱!" },
            { type: "email", message: "请输入合法邮箱地址!" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <div className="captcha-wrapper">
          <Form.Item
            label="验证码"
            name="captcha"
            rules={[{ required: true, message: "请输入验证码!" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            发送验证码
          </Button>
        </div>

        <Form.Item {...layout_6_18} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

interface HeadPicUploadProps {
  value?: string;
  onChange?: Function;
}

let onChange: Function;

const props: DraggerProps = {
  name: "file",
  action: BASE_URL + "/user/upload",
  onChange(info) {
    const { status } = info.file;
    if (status === "done") {
      onChange(info.file.response.data.url);
      message.success(`${info.file.name} 文件上传成功`);
    } else if (status === "error") {
      message.error(`${info.file.name} 文件上传失败`);
    }
  },
};

const dragger = (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
  </Dragger>
);

export function HeadPicUpload(props: HeadPicUploadProps) {
  onChange = props.onChange!;

  return props?.value ? (
    <div>
      <img src={props.value} alt="头像" width="100" height="100" />
      {dragger}
    </div>
  ) : (
    <div>{dragger}</div>
  );
}
