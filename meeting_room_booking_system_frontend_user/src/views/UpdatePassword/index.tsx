import { Form, Button, Input, message } from "antd";
import { layout6_18, layout0_24 } from "../layout";
import { useForm } from "antd/es/form/Form";
import { useCallback } from "react";
import "./index.css";
import { updatePassword, updatePasswordCaptcha } from "@api/index";
import { Navigate, useNavigate } from "react-router-dom";

export interface UpdatePassword {
  username: string;
  email: string;
  captcah: string;
  password: string;
  confirmPassword: string;
}

export function UpdatePassword() {
  const [form] = useForm();
  const navigate = useNavigate();

  const onFinish = useCallback(async (values: UpdatePassword) => {
    if (values.password !== values.confirmPassword) {
      return message.error("两次密码不一致");
    }

    const res = await updatePassword(values);

    if (res.status === 200 || res.status === 201) {
      message.success("密码修改成功！");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      message.error(res.data.data || "系统繁忙，请稍后再试");
    }
  }, []);

  const sendCaptcha = useCallback(async () => {
    const address = form.getFieldValue("email");
    console.log(address);

    if (!address) {
      return message.error("请输入邮箱地址");
    }

    const res = await updatePasswordCaptcha(address);

    if (res.status === 200 || res.status === 201) {
      message.success(res.data.data);
    } else {
      message.error("系统繁忙，请稍后再试");
    }
  }, []);

  return (
    <div id="updatePassword-container">
      <h1>会议室预订系统</h1>
      <Form
        form={form}
        {...layout6_18}
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
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱地址！" },
            { type: "email", message: "邮箱地址合适不正确" },
          ]}
        >
          <Input />
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

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[{ required: true, message: "请输入确认密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...layout0_24} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
