
import { Link } from "react-router-dom";
import { Card, Button, FormControl } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as db from "./Database";

export default function Dashboard(
  { courses, course, setCourse, addNewCourse,
    deleteCourse, updateCourse }: {
      courses: any[]; course: any; setCourse: (course: any) => void;
      addNewCourse: () => void; deleteCourse: (course: any) => void;
      updateCourse: () => void;
    }) {

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = db;





  return (
    <div id="wd-dashboard" style={{ marginLeft: "120px", padding: "20px" }}>
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <h5>New Course
        <button className="btn btn-primary float-end"
          id="wd-add-new-course-click"
          onClick={addNewCourse} > Add </button>
        <button className="btn btn-warning float-end me-2"
          onClick={updateCourse} id="wd-update-course-click">
          Update
        </button>
      </h5><br />
      <FormControl value={course.name} className="mb-2" onChange={(e) => setCourse({ ...course, name: e.target.value })} />
      <FormControl value={course.description}  onChange={(e) => setCourse({ ...course, description: e.target.value })} />
      <hr />

      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.filter((_course) =>
        enrollments.some(
          (enrollment) =>
            enrollment.user === currentUser._id
        )).length})</h2>
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
        {courses.filter((_course) =>
          enrollments.some(
            (enrollment) =>
              enrollment.user === currentUser._id
          ))
          .map((course) => (
            <div key={course.id} className="wd-dashboard-course">
              <Card>
                <Link
                  to={`/Kambaz/Courses/${encodeURIComponent(course._id)}/Home`}
                  className="text-decoration-none text-dark"
                >
                  <Card.Img variant="top" src={course.image} height={140} />
                  <Card.Body>
                    <Card.Title className="text-truncate">{course.name}</Card.Title>
                    <Card.Text style={{ height: 60 }}>{course.description}</Card.Text>
                    <Button variant="primary">Go</Button>
                    <button onClick={(event) => {
                      event.preventDefault();
                      deleteCourse(course._id);
                    }} className="btn btn-danger float-end"
                      id="wd-delete-course-click">
                      Delete
                    </button>
                    <button id="wd-edit-course-click"
                      onClick={(event) => {
                        event.preventDefault();
                        setCourse(course);
                      }}
                      className="btn btn-warning me-2 float-end" >
                      Edit
                    </button>

                  </Card.Body>
                </Link>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );
}


