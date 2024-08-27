import { Menu as AntdMenu, MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { useCallback } from "react";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "会议室管理",
  },
  {
    key: "2",
    label: "预定管理",
  },
  {
    key: "3",
    label: "用户管理",
  },
  {
    key: "4",
    label: "统计",
  },
];

export function Menu() {
  const navigaet = useNavigate();
  const localtion = useLocation();

  const handleMenuItemClick: MenuClickEventHandler = useCallback((info) => {
    let path = "";

    switch (info.key) {
      case "1":
        path = "/meeting_room_manage";
        break;
      case "2":
        path = "/booking_manage";
        break;
      case "3":
        path = "/user_manage";
        break;
      case "4":
        path = "/statistics";
        break;
    }
    navigaet(path);
  }, []);

  const getSelectedKeys = useCallback(() => {
    if (localtion.pathname === "/meeting_room_manage") {
      return ["1"];
    } else if (localtion.pathname === "/booking_manage") {
      return ["2"];
    } else if (localtion.pathname === "/user_manage") {
      return ["3"];
    } else if (localtion.pathname === "/statistics") {
      return ["4"];
    } else {
      return ["1"];
    }
  }, []);

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={getSelectedKeys()}
          items={items}
          onClick={handleMenuItemClick}
        ></AntdMenu>
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
