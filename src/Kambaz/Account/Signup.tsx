import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
  
    <div id="wd-signup-screen" style={{ maxWidth: '350px' }}> 
      <h1 className="mb-4">Signup</h1> 
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
        id="wd-password-verify"
        placeholder="verify password"
        type="password"
        defaultValue="pswd" 
        className="mb-3" 
      />
      <Button
        id="wd-signup-btn"
        as={Link as any} 
        to="/Kambaz/Account/Profile" 
        className="w-100 mb-2" 
        variant="primary" 
      >
        Signup
      </Button>
      <Link
        id="wd-signin-link"
        to="/Kambaz/Account/Signin"
        className="d-block text-primary text-decoration-none"
      >
        Signin
      </Link>
    </div>
  );
}