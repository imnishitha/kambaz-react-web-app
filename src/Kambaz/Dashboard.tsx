import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard" style={{ marginLeft: "120px", padding: "20px" }}>
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 250px)",
          gap: "30px",
          justifyContent: "start",
        }}
      >
        <div className="wd-dashboard-course">
          <Card>
            <Link to="/Kambaz/Courses/1234/Home" className="text-decoration-none text-dark">
              <Card.Img variant="top" src="/images/reactjs.jpg" height={140} />
              <Card.Body>
                <Card.Title className="text-truncate">CS1234 React JS</Card.Title>
                <Card.Text style={{ height: 60 }}>Full Stack software developer</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Link>
          </Card>
        </div>

        <div className="wd-dashboard-course">
          <Card>
            <Link to="/Kambaz/Courses/1233/Home" className="text-decoration-none text-dark">
              <Card.Img variant="top" src="/images/python.png" height={140} />
              <Card.Body>
                <Card.Title className="text-truncate">CS1233 Python Basics</Card.Title>
                <Card.Text style={{ height: 60 }}>Introduction to Python programming</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Link>
          </Card>
        </div>

        <div className="wd-dashboard-course">
          <Card>
            <Link to="/Kambaz/Courses/1235/Home" className="text-decoration-none text-dark">
              <Card.Img variant="top" src="/images/js.png" height={140} />
              <Card.Body>
                <Card.Title className="text-truncate">CS1235 JavaScript Essentials</Card.Title>
                <Card.Text style={{ height: 60 }}>Introduction to JavaScript</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Link>
          </Card>
        </div>

        <div className="wd-dashboard-course">
          <Card>
            <Link to="/Kambaz/Courses/1236/Home" className="text-decoration-none text-dark">
              <Card.Img variant="top" src="/images/c++.png" height={140} />
              <Card.Body>
                <Card.Title className="text-truncate">CS1236 Programming in C++</Card.Title>
                <Card.Text style={{ height: 60 }}>Introduction to C++</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Link>
          </Card>
        </div>

        <div className="wd-dashboard-course">
          <Card>
            <Link to="/Kambaz/Courses/1237/Home" className="text-decoration-none text-dark">
              <Card.Img variant="top" src="/images/k8.png" height={140} />
              <Card.Body>
                <Card.Title className="text-truncate">CS1237 Kubernetes Basics</Card.Title>
                <Card.Text style={{ height: 60 }}>Introduction to Kubernetes</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Link>
          </Card>
        </div>

        <div className="wd-dashboard-course">
          <Card>
            <Link to="/Kambaz/Courses/1238/Home" className="text-decoration-none text-dark">
              <Card.Img variant="top" src="/images/aws.png" height={140} />
              <Card.Body>
                <Card.Title className="text-truncate">CS1238 AWS Cloud</Card.Title>
                <Card.Text style={{ height: 60 }}>Cloud computing fundamentals with AWS</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Link>
          </Card>
        </div>

        <div className="wd-dashboard-course">
          <Card>
            <Link to="/Kambaz/Courses/1239/Home" className="text-decoration-none text-dark">
              <Card.Img variant="top" src="/images/sql.png" height={140} />
              <Card.Body>
                <Card.Title className="text-truncate">CS1239 SQL Databases</Card.Title>
                <Card.Text style={{ height: 60 }}>Relational database design</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
