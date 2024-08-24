import { Button, Form, Input, message } from "antd";
import { layout_4_20 } from "../layout";
import { useCallback } from "react";
import "./index.css";
import { login } from "@api/index";
import { useNavigate } from "react-router-dom";

export interface LoginUser {
  username: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();

  const onFinish = useCallback(async (values: LoginUser) => {
    const res = await login(values);

    const { data } = res.data;

    if (res.status === 200 || res.status === 201) {
      message.success("登录成功");

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user_info", JSON.stringify(data.userInfo));

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      message.error(data || "系统繁忙，请稍后再试");
    }
  }, []);

  return (
    <div id="login-container">
      <h1>会议室预订系统</h1>
      <Form
        {...layout_4_20}
        colon={false}
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名！" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码！" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
