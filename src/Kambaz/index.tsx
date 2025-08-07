import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import KambazNavigation from "./Navigation";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import "./style.css";
import * as userClient from "./Account/Client";
import { useEffect, useState, useMemo } from "react"; // <-- ADD useMemo
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import { useSelector } from "react-redux";
import * as courseClient from "./Courses/client";
import * as enrollmentClient from "./Enrollments/enrollmentClient";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const fetchCourses = async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses();
      setCourses(allCourses);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchEnrollments = async () => {
    if (currentUser) {
      try {
        const userEnrollments = await enrollmentClient.findEnrollmentsForUser(currentUser._id);
        setEnrollments(userEnrollments);
      } catch (error) {
        console.error(error);
      }
    } else {
      setEnrollments([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [currentUser]);

  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });

  const addNewCourse = async () => {
    const newCourse = await userClient.createCourse(course);
    setCourses([...courses, newCourse]);
  };

  const deleteCourse = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course) => course._id !== courseId));
  };

  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(
      courses.map((c) => {
        if (String(c._id) === String(course._id)) {
          return course;
        } else {
          return c;
        }
      })
    );
  };

  const enroll = async (courseId: string) => {
    if (currentUser) {
      await enrollmentClient.enrollUserInCourse(currentUser._id, courseId);
      fetchEnrollments();
    }
  };
  const unenroll = async (courseId: string) => {
    if (currentUser) {
      await enrollmentClient.unenrollUser(currentUser._id, courseId);
      fetchEnrollments();
    }
  };
  
  // Create a memoized set of enrolled course IDs for efficient lookup in Dashboard
  const enrolledCourseIds = useMemo(() => new Set(enrollments.map(e => e.course)), [enrollments]);

  return (
    <Session>
    <div id="wd-kambaz">

      <KambazNavigation />
      <div  className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="/Kambaz/Account" />} />
          <Route path="/Account/*" element={<Account />} />
          <Route path="/Dashboard" element={
<ProtectedRoute>
<Dashboard
      allCourses={courses}
      enrolledCourses={courses.filter(c => enrolledCourseIds.has(c._id))}
      course={course}
      setCourse={setCourse}
      addNewCourse={addNewCourse}
      deleteCourse={deleteCourse}
      updateCourse={updateCourse}
      enroll={enroll}
      unenroll={unenroll}
      enrolledCourseIds={enrolledCourseIds}
/>
</ProtectedRoute>} />
          <Route path="/Courses/:cid/*" element={<ProtectedRoute><Courses courses={courses} /></ProtectedRoute>} />
          <Route path="/Calendar" element={<h1>Calendar</h1>} />
          <Route path="/Inbox" element={<h1>Inbox</h1>} />
          
        </Routes>
      </div>
    </div>
    </Session>
  );

}
