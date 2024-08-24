import { UserOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import "./style/index.css";

export function Main() {
  return (
    <div id="main-container">
      <div className="header">
        <h1>会议室预定系统-后台管理</h1>
        <UserOutlined className="icon"></UserOutlined>
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
