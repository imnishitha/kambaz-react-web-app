import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import courses from "./Database/Courses.json"; 

export default function Dashboard() {
  return (
    <div id="wd-dashboard" style={{ marginLeft: "120px", padding: "20px" }}>
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
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
        {courses.map((course) => (
          <div key={course.id} className="wd-dashboard-course">
            <Card>
              <Link
                to={`/Kambaz/Courses/${encodeURIComponent(course.id)}/Home`}
                className="text-decoration-none text-dark"
              >
                <Card.Img variant="top" src={course.image} height={140} />
                <Card.Body>
                  <Card.Title className="text-truncate">{course.name}</Card.Title>
                  <Card.Text style={{ height: 60 }}>{course.description}</Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
