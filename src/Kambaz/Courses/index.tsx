import CourseNavigation from "./Navigation";
import { Route, Routes, useParams, useLocation, Navigate } from "react-router-dom";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import PeopleTable from "./People/Table";
import { Provider } from "react-redux";
import store from "../store";
import { useEffect, useState } from "react";
import * as client from "./client";
import QuizList from "./Quizzes/list";
import QuizEditor from "./Quizzes/editor"; 
import QuizDetails from "./Quizzes/details";
import QuizDetailsEditor from "./Quizzes/details";
import QuizQuestionsEditor from "./Quizzes/quizQuestionsEditor";
import QuizPreview from "./Quizzes/quizPreview";

export default function Courses({ courses }: { courses: any[]; }) {

  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();

  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      if (cid) {
        const enrolledUsers = await client.findUsersForCourse(cid);
        setUsers(enrolledUsers);
      }
    };
    fetchUsers();
  }, [cid]);
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]} </h2> <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">
        <Provider store={store}>
          <Routes>
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="People" element={<PeopleTable users={users} />} />
            <Route path="Quizzes" element={<QuizList />} />
            <Route path="Quizzes/:qid" element={<QuizDetails />} />
            <Route path="Quizzes/:qid/edit" element={<QuizEditor />} >
              <Route path="details" element={<QuizDetailsEditor />} /> 
              <Route path="questions" element={<QuizQuestionsEditor />} /> 
              {/* <Route path="preview" element={<QuizPreview />} /> */}
              <Route path="*" element={<Navigate to="details" />} />
            </Route>
            <Route path="Quizzes/:qid/preview" element={<QuizPreview />} ></Route>
          </Routes>
          </Provider>
        </div></div>
    </div>


  );
}
