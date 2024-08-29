import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import "./index.css";

export function Main() {
  return (
    <div id="main-container">
      <div className="header">
        <Link to="/meeting_room_manage" className="sys_name">
          <h1>会议室预定系统-后台管理</h1>
        </Link>
        <Link to="/user/info_modify">
          <UserOutlined className="icon" />
        </Link>
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
