import { Link } from "react-router-dom";
import { Card, Button, FormControl } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Dashboard(
  { allCourses, enrolledCourses, course, setCourse,
    addNewCourse, deleteCourse, updateCourse,
      enrolling, setEnrolling, updateEnrollment }: {
      allCourses: any[];
      enrolledCourses: any[];
      course: any;
      setCourse: (course: any) => void;
      addNewCourse: () => void;
      deleteCourse: (course: any) => void;
      updateCourse: () => void;
      // enroll: (courseId: string) => void;
      // unenroll: (courseId: string) => void;
      // enrolledCourseIds: Set<string>;
      enrolling: boolean; 
      setEnrolling: (enrolling: boolean) => void;
      updateEnrollment: (courseId: string, enrolled: boolean) => void;
    }
)
 {

  useSelector((state: any) => state.accountReducer);
  
  // Filter courses into enrolled and not-enrolled lists for the dropdowns
  // const myCourses = allCourses.filter(c => enrolledCourseIds.has(c._id));
  // const otherCourses = allCourses.filter(c => !enrolledCourseIds.has(c._id));

  return (
    <div id="wd-dashboard" style={{ marginLeft: "120px", padding: "20px" }}>
      <h1 id="wd-dashboard-title">Dashboard</h1>
      

      <button onClick={() => setEnrolling(!enrolling)} className="float-end btn btn-primary" >
          {enrolling ? "My Courses" : "All Courses"}
        </button>
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
        {allCourses.map((course) => (
            <div key={course._id} className="wd-dashboard-course">
                 <h5 className="wd-dashboard-course-title card-title">
                 {enrolling && (
              <button onClick={(event) => {
                        event.preventDefault();
                        updateEnrollment(course._id, !course.enrolled);
                      }}
                      className={`btn ${ course.enrolled ? "btn-danger" : "btn-success" } float-end`} >
                {course.enrolled ? "Unenroll" : "Enroll"}
              </button>
            )}
            {course.name}
          </h5>

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