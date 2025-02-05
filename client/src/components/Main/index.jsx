import React, {useState} from "react";
import {Button, Col, Layout, Drawer, Dropdown} from "antd";
import {Logo} from "../../assets/constant";
import "./style.css";
import {FaUserLock} from "react-icons/fa";
import {RiUserLine, RiMenuLine, RiCloseLine} from "react-icons/ri";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useUserContext} from "../../context/UserContext";
import {IoChevronDownOutline, IoLogOut} from "react-icons/io5";
const {Header, Content, Sider} = Layout;

const Main = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mode, setMode] = useState("Leads");

  const {logout, user} = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const items = [
    {
      label: (
        <div className="flex items-center gap-2  justify-between">
          <div className="left">
            <img
              src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className="right">
            <div className="flex items-center gap-2">
              <RiUserLine /> <strong>{user && user.name}</strong>
            </div>
            <div className="flex items-center gap-2">
              <FaUserLock /> <strong>{user && user.role}</strong>
            </div>
          </div>
        </div>
      ),
      key: "0",
    },

    {
      type: "divider",
    },
    {
      label: (
        <div className="ProfileSection">
          <Button className="ProfileBtn logout" onClick={handleLogout} shape="round" icon={<IoLogOut />}>
            <p>
              <strong>Logout</strong>
            </p>
          </Button>
        </div>
      ),
      key: "3",
    },
  ];

  const menuProps = {
    items,
  };

  return (
    <Layout>
      {/* Header Section */}
      <Header className="ant-header  flex justify-between items-center  bg-white px-6 md:px-16 py-4">
        {/* Left side: Logo */}
        <Col>
          <Link to="/">
            <Logo className="w-28 h-auto sm:w-24 md:w-28 lg:w-32" />
          </Link>
        </Col>
        {/* Right side */}

        <Col className="flex items-center justify-end flex-1">
          {/* Hamburger menu for small screens */}
          <Button
            type="text"
            className="lg:hidden ml-auto" /* Adds alignment to right side */
            onClick={() => setDrawerVisible(true)}
            icon={<RiMenuLine size={24} style={{color: "#996830"}} />}
          />
          {/* Logout button visible on large screens */}
          {/* <Button
            onClick={handleLogout}
            className="primary-btn-active btn-logout hidden lg:flex hover:bg-transparent focus:outline-none"
          >
            <span className="text-lg text-white hover:text-white">
              <RiUserLine />
            </span>
            <span className="text-white hover:text-white">Logout</span>
          </Button> */}
          <Dropdown menu={menuProps}>
            <Button
              shape="round"
              className="primary-btn-active btn-logout hidden lg:flex hover:bg-transparent focus:outline-none"
            >
              {/* <Button className="CustomButtonA" shape="circle" icon={<RiUserLine />} /> */}
              <span className="text-lg text-white hover:text-white">
                <RiUserLine />
              </span>
              <IoChevronDownOutline />
            </Button>
          </Dropdown>
        </Col>
      </Header>
      {/* Sidebar Section */}
      <Layout className="h-dvh">
        <Sider
          breakpoint="lg"
          collapsed={collapsed}
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            setCollapsed(broken);
          }}
          width={200}
          className="bg-white relative py-6 pr-5 hidden lg:block"
        >
          <div className="flex p-3 flex-col gap-4 rounded-lg bg-[#99683033]">
            <Link to="/pannel/leads">
              <Button
                type="primary"
                className={mode === "Leads" ? "primary-btn-active w-full" : "primary-btn w-full"}
                onClick={() => setMode("Leads")}
              >
                Leads
              </Button>
            </Link>
            <Link to="/pannel/design">
              <Button
                type="primary"
                className={mode === "Design" ? "primary-btn-active w-full" : "primary-btn w-full"}
                onClick={() => setMode("Design")}
              >
                Design
              </Button>
            </Link>
            <Link to="/pannel/work">
              <Button
                type="primary"
                className={mode === "Work" ? "primary-btn-active w-full" : "primary-btn w-full"}
                onClick={() => setMode("Work")}
              >
                Work Progress
              </Button>
            </Link>

            {user && user.role === "master" && (
              <>
                {" "}
                <Link to="/pannel/activity">
                  <Button
                    type="primary"
                    className={mode === "Activity" ? "primary-btn-active w-full" : "primary-btn w-full"}
                    onClick={() => setMode("Activity")}
                  >
                    Activity Log
                  </Button>
                </Link>
                <Link to="/pannel/architect">
                  <Button
                    type="primary"
                    className={mode === "Architects" ? "primary-btn-active w-full" : "primary-btn w-full"}
                    onClick={() => setMode("Architects")}
                  >
                    Architects
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Sider>
        <Content className="m-0 h-dvh overflow-scroll font-Outfit md:px-10 px-5 bg-white ant-content">
          <Outlet />
        </Content>
      </Layout>
      {/* Drawer for small screens */}
      <Drawer
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
        className="lg:hidden"
        showHeader={false}
      >
        {/* Close button */}
        <Button
          type="text"
          className="absolute top-3 left-3 drawer-close-btn w-8 h-8 rounded-2xl  border border-[#996633] "
          icon={<RiCloseLine size={24} style={{color: "#996833"}} />}
          onClick={() => setDrawerVisible(false)}
        />
        {/* Drawer content */}
        <div className="flex flex-col px-4 py-10 gap-5 h-full">
          <Link to="/pannel/leads">
            <Button
              className={
                mode === "Leads"
                  ? "primary-btn-active w-full no-bg py-5"
                  : "primary-btn primary-btn-boarded w-full no-bg py-5 "
              }
              onClick={() => {
                setMode("Leads");
                setDrawerVisible(false);
              }}
            >
              Leads
            </Button>
          </Link>
          <Link to="/pannel/design">
            <Button
              className={
                mode === "Design"
                  ? "primary-btn-active w-full no-bg py-5"
                  : "primary-btn primary-btn-boarded w-full no-bg py-5"
              }
              onClick={() => {
                setMode("Design");
                setDrawerVisible(false);
              }}
            >
              Design
            </Button>
          </Link>
          <Link to="/pannel/work">
            <Button
              className={
                mode === "Work"
                  ? "primary-btn-active w-full no-bg py-5"
                  : "primary-btn primary-btn-boarded w-full no-bg py-5"
              }
              onClick={() => {
                setMode("Work");
                setDrawerVisible(false);
              }}
            >
              Work Progress
            </Button>
          </Link>
          <Link to="/pannel/activity">
            <Button
              className={
                mode === "Activity"
                  ? "primary-btn-active w-full no-bg py-5"
                  : "primary-btn primary-btn-boarded w-full no-bg py-5 "
              }
              onClick={() => {
                setMode("Activity");
                setDrawerVisible(false);
              }}
            >
              Activity Log
            </Button>
          </Link>
          <Link to="/pannel/architect">
            <Button
              className={
                mode === "Architects"
                  ? "primary-btn-active w-full no-bg py-5"
                  : "primary-btn primary-btn-boarded w-full py-5"
              }
              onClick={() => {
                setMode("Architects");
                setDrawerVisible(false);
              }}
            >
              Architects
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            className="primary-btn-active   w-full py-5 mt-auto"
            style={{
              backgroundColor: "#996830",
              color: "white",
            }}
          >
            <span className="text-lg mr-2">
              <RiUserLine />
            </span>
            Logout
          </Button>
        </div>
      </Drawer>
    </Layout>
  );
};
export default Main;
