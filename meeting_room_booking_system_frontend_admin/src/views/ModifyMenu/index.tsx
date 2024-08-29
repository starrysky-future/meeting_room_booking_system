import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from "antd";
import { MenuClickEventHandler } from "rc-menu/es/interface";
import "./index.css";
import { useCallback, useMemo } from "react";

export function ModifyMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "信息修改",
      },
      {
        key: "2",
        label: "密码修改",
      },
    ],
    []
  );

  const handleMenuItemClick: MenuClickEventHandler = useCallback((info) => {
    if (info.key === "1") {
      navigate("/user/info_modify");
    } else {
      navigate("/user/password_modify");
    }
  }, []);

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={
            location.pathname === "/user/info_modify" ? ["1"] : ["2"]
          }
          items={items}
          onClick={handleMenuItemClick}
        />
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
