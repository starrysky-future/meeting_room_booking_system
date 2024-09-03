import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";

export function Main() {
  const [headPic, setHeadPic] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      const info = JSON.parse(userInfo);
      if (!info.isAdmin) {
        window.location.href = "/login";
      }

      const pic = info.headPic;
      setHeadPic(pic);
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div id="main-container">
      <div className="header">
        <Link to="/meeting_room_manage" className="sys_name">
          <h1>会议室预定系统-后台管理</h1>
        </Link>
        <Link to="/user/info_modify">
          {headPic ? (
            <img src={headPic} width={40} height={40} className="icon" />
          ) : (
            <UserOutlined className="icon" />
          )}
        </Link>
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
