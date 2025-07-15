import { Form, Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa"; 


export default function Profile() {
  return (
    <div id="wd-profile-screen" style={{ maxWidth: '350px' }}> 
      <h1 className="mb-4">Profile</h1> 

      <Form.Control
        id="wd-username"
        placeholder="username"
        defaultValue="Nishitha"
        className="mb-2"
      />

      <Form.Control
        id="wd-password"
        placeholder="password"
        type="password"
        defaultValue="pswd" 
        className="mb-2"
      />

      <Form.Control
        id="wd-firstname"
        placeholder="First Name"
        defaultValue="Nishitha" 
        className="mb-2"
      />

      <Form.Control
        id="wd-lastname"
        placeholder="Last Name"
        defaultValue="Madhu" 
        className="mb-2"
      />

      <InputGroup className="mb-2">
        <Form.Control
          id="wd-dob"
          type="date" 
          defaultValue="1998-01-23"
        />
        <InputGroup.Text className="bg-white border-start-0">
          <FaCalendarAlt />
        </InputGroup.Text>
      </InputGroup>

      <Form.Control
        id="wd-email"
        placeholder="email"
        type="email"
        defaultValue="nishitha@gmail.com" 
        className="mb-2"
      />

      <Form.Control
        id="wd-role"
        as="select"
        defaultValue="FACULTY" 
        className="mb-3"
      >

        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="STUDENT">Student</option>
        <option value="FACULTY">Faculty</option>
      </Form.Control>

      <Button
        id="wd-signout-btn"
        as={Link as any}
        to="/Kambaz/Account/Signin"
        className="w-100 mb-2"
        variant="danger"
      >
        Signout
      </Button>
    </div>
  );
}