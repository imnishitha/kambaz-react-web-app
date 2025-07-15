import { Link, useLocation } from "react-router-dom"; 

export default function AccountNavigation() {
  const { pathname } = useLocation(); 

  const links = [
    { name: "Signin", path: "/Kambaz/Account/Signin" },
    { name: "Signup", path: "/Kambaz/Account/Signup" },
    { name: "Profile", path: "/Kambaz/Account/Profile" },
  ];

  return (
    <div
      id="wd-account-navigation"
      className="me-5 pe-5 border-end border-2 border-dark d-flex flex-column justify-content-start"
    >
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.path}
          className={`d-block text-decoration-none mb-2 ${
            pathname === link.path ? 'text-danger fw-bold' : 'text-danger'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}