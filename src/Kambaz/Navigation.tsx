import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { TfiWrite } from "react-icons/tfi";

export default function KambazNavigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 110 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 text-center"
    >
      <ListGroup.Item
        id="wd-neu-link"
        target="_blank"
        action
        href="https://www.northeastern.edu/"
        className="bg-black border-0 text-center"
      >
        <img src="/images/NEU.png" width="70px" alt="NEU logo" />
      </ListGroup.Item>

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Account"
        className={`border-0 ${
          isActive("/Kambaz/Account")
            ? "bg-white text-danger"
            : "bg-black text-white"
        }`}
      >
        <FaRegCircleUser
          className={`fs-1 ${isActive("/Kambaz/Account") ? "text-danger" : "text-white"}`}
        />
        <div>Account</div>
      </ListGroup.Item>

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Dashboard"
        className={`border-0 ${
          isActive("/Kambaz/Dashboard")
            ? "bg-white text-danger"
            : "bg-black text-white"
        }`}
      >
        <AiOutlineDashboard className="fs-1 text-danger" />
        <div>Dashboard</div>
      </ListGroup.Item>

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Dashboard"
        className={`border-0 ${
          isActive("/Kambaz/Courses")
            ? "bg-white text-danger"
            : "bg-black text-white"
        }`}
      >
        <LiaBookSolid className="fs-1 text-danger" />
        <div>Courses</div>
      </ListGroup.Item>

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Calendar"
        className={`border-0 ${
          isActive("/Kambaz/Calendar")
            ? "bg-white text-danger"
            : "bg-black text-white"
        }`}
      >
        <IoCalendarOutline className="fs-1 text-danger" />
        <div>Calendar</div>
      </ListGroup.Item>

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Inbox"
        className={`border-0 ${
          isActive("/Kambaz/Inbox")
            ? "bg-white text-danger"
            : "bg-black text-white"
        }`}
      >
        <FaInbox className="fs-1 text-danger" />
        <div>Inbox</div>
      </ListGroup.Item>

      <ListGroup.Item
        as={Link}
        to="/Kambaz/Settings"
        className={`border-0 ${
          isActive("/Kambaz/Settings")
            ? "bg-white text-danger"
            : "bg-black text-white"
        }`}
      >
        <LiaCogSolid className="fs-1 text-danger" />
        <div>Settings</div>
      </ListGroup.Item>

      <ListGroup.Item
        as={Link}
        to="/Labs"
        className={`border-0 ${
          isActive("/Labs")
            ? "bg-white text-danger"
            : "bg-black text-white"
        }`}
      >
        <TfiWrite className="fs-1 text-danger" />
        <div>Labs</div>
      </ListGroup.Item>

    </ListGroup>
  );
}
