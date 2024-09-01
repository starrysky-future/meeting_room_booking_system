import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/api/request";

export function Main() {
  const [headPic, setHeadPic] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      const info = JSON.parse(userInfo);
      const pic = BASE_URL + "/" + info.headPic;

      setHeadPic(pic);
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div id="main-container">
      <div className="header">
        <h1>
          <Link to={"/"}>会议室预定系统</Link>
        </h1>
        <Link to={"update_info"}>
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
