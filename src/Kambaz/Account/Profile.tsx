import { Link } from "react-router-dom";
export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input defaultValue="Nishitha" placeholder="username" className="wd-username"/><br/>
      <input defaultValue="pswd"   placeholder="password" type="password"
             className="wd-password" /><br/>
      <input defaultValue="Nishitha" placeholder="First Name" id="wd-firstname" /><br/>
      <input defaultValue="Madhu" placeholder="Last Name" id="wd-lastname" /><br/>
      <input defaultValue="1998-01-23" type="date" id="wd-dob" /><br/>
      <input defaultValue="nishitha@gmail.com" type="email" id="wd-email" /><br/>
      <select defaultValue="FACULTY" id="wd-role">
        <option value="USER">User</option>       <option value="ADMIN">Admin</option>
        <option value="STUDENT">Faculty</option> <option value="FACULTY">Student</option>
      </select><br/>
      <Link to="/Kambaz/Account/Signin" >Sign out</Link>
    </div>
);}
