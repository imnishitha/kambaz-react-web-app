import { Link } from "react-router-dom";
import { Card, Button, FormControl, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as db from "./Database";

export default function Dashboard(
  { allCourses, enrolledCourses, course, setCourse,
    addNewCourse, deleteCourse, updateCourse,
    enroll, unenroll, enrolledCourseIds }: {
      allCourses: any[];
      enrolledCourses: any[];
      course: any;
      setCourse: (course: any) => void;
      addNewCourse: () => void;
      deleteCourse: (course: any) => void;
      updateCourse: () => void;
      enroll: (courseId: string) => void;
      unenroll: (courseId: string) => void;
      enrolledCourseIds: Set<string>;
    }
)
 {

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = db;
  
  // Filter courses into enrolled and not-enrolled lists for the dropdowns
  const myCourses = allCourses.filter(c => enrolledCourseIds.has(c._id));
  const otherCourses = allCourses.filter(c => !enrolledCourseIds.has(c._id));

  return (
    <div id="wd-dashboard" style={{ marginLeft: "120px", padding: "20px" }}>
      <h1 id="wd-dashboard-title">Dashboard</h1>
      
      <div className="mb-4">
        <h4 className="mb-3">Manage Enrollments</h4>
        <div className="d-flex align-items-center">
          
          <Dropdown className="me-3">
            <Dropdown.Toggle variant="success" id="wd-enroll-dropdown">
              Enroll in a Course
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {otherCourses.length > 0 ? (
                otherCourses.map(c => (
                  <Dropdown.Item key={c._id} onClick={() => enroll(c._id)}>
                    {c.name}
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item disabled>No new courses available</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          
          <Dropdown>
            <Dropdown.Toggle variant="danger" id="wd-unenroll-dropdown">
              Unenroll from a Course
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {myCourses.length > 0 ? (
                myCourses.map(c => (
                  <Dropdown.Item key={c._id} onClick={() => unenroll(c._id)}>
                    {c.name}
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item disabled>You are not enrolled in any courses</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <hr />

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
      <h2 id="wd-dashboard-published">Published Courses ({enrolledCourses.length})</h2>
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
        {enrolledCourses.map((course) => (
            <div key={course._id} className="wd-dashboard-course">
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
                  </Card.Body>
                </Link>
                <div className="p-2">
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
                </div>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );
}