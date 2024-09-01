import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from "antd";
import { useCallback, useMemo } from "react";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import "./index.css";

export function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "会议室列表",
      },
      {
        key: "2",
        label: "预定历史",
      },
    ],
    []
  );

  const getSelectKeys = useCallback(() => {
    if (location.pathname === "/booking_history") {
      return ["2"];
    } else {
      return ["1"];
    }
  }, []);

  const handleMenuItemClick: MenuClickEventHandler = useCallback((info) => {
    let path = "";

    switch (info.key) {
      case "1":
        path = "/meeting_room_list";
        break;
      case "2":
        path = "/booking_history";
        break;
    }

    navigate(path);
  }, []);

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          items={items}
          defaultSelectedKeys={getSelectKeys()}
          onClick={handleMenuItemClick}
        ></AntdMenu>
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
