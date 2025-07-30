import { Link } from "react-router-dom"; 
import { useSelector } from "react-redux";


export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  // const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  // const { pathname } = useLocation(); 

  // const links = [
  //   { name: "Signin", path: "/Kambaz/Account/Signin" },
  //   { name: "Signup", path: "/Kambaz/Account/Signup" },
  //   { name: "Profile", path: "/Kambaz/Account/Profile" },
  // ];

  return (
    <div
      id="wd-account-navigation"
    >
{!currentUser && (<>
<Link to={'/Kambaz/Account/Signin' }> Signin </Link> <br /> 
<Link to={'/Kambaz/Account/Signup'}> Signup </Link> <br />
</>)}
{currentUser &&(<>
  <Link to={'/Kambaz/Account/Profile'}> Profile </Link> <br/>
</>)}
    </div>
  );
}