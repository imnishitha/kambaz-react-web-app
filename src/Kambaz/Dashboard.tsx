import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> 
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> 
      <hr />
      <div id="wd-dashboard-courses">
        
        <div className="wd-dashboard-course">
        <Link to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/reactjs.jpg" width={200} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1233/Home" className="wd-dashboard-course-link">
            <img src="/images/python.png" width={200} alt="Python" />
            <div>
              <h5>CS1233 Python Basics</h5>
              <p className="wd-dashboard-course-title">
                Introduction to Python programming
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1235/Home" className="wd-dashboard-course-link">
            <img src="/images/js.png" width={200} alt="JavaScript" />
            <div>
              <h5>CS1235 JavaScript Essentials</h5>
              <p className="wd-dashboard-course-title">
              Introduction to Javascript
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1236/Home" className="wd-dashboard-course-link">
            <img src="/images/c++.png" width={200} alt="C++" />
            <div>
              <h5>CS1236 C++s</h5>
              <p className="wd-dashboard-course-title">
                Introduction to C++
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1237/Home" className="wd-dashboard-course-link">
            <img src="/images/k8.png" width={200} alt="Kubernetes Basics" />
            <div>
              <h5>CS1237 Kubernetes Basics</h5>
              <p className="wd-dashboard-course-title">
                Introduction to kubernetes
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1238/Home" className="wd-dashboard-course-link">
            <img src="/images/aws.png" width={200} alt="AWS Cloud" />
            <div>
              <h5>CS1238 AWS Cloud</h5>
              <p className="wd-dashboard-course-title">
                Cloud computing fundamentals with AWS
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1239/Home" className="wd-dashboard-course-link">
            <img src="/images/sql.png" width={200} alt="SQL Databases" />
            <div>
              <h5>CS1239 SQL Databases</h5>
              <p className="wd-dashboard-course-title">
                Relational database design
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
