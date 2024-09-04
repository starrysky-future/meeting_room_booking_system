import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/store/userInfoSlice";
import { StateType } from "@/store/store";

export function Main() {
  const [headPic, setHeadPic] = useState("");
  const userInfo = useSelector((state: StateType) => state.userInfo);
  const dispatch = useDispatch();

  console.log("userInfo", userInfo);

  useEffect(() => {
    const user_Info = localStorage.getItem("user_info");
    if (user_Info) {
      const info = JSON.parse(user_Info);

      if (!info.isAdmin) {
        window.location.href = "/login";
      }

      dispatch(setUserInfo(info));
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (userInfo.headPic) {
      const user_Info = localStorage.getItem("user_info");
      const info = JSON.parse(user_Info as string);
      info.headPic = userInfo.headPic;
      localStorage.setItem("user_info", JSON.stringify(info));
      setHeadPic(userInfo.headPic);
    }
  }, [userInfo.headPic]);

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
