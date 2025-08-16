import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Row,
  Col,
  InputGroup,
  Button,
  Tabs,
  Tab,
  Card,
  FormControl,
} from "react-bootstrap";
import * as quizzesClient from "./client";
import { setCurrentQuiz, updateQuiz } from "./reducer";
import { FaCheckCircle, FaBan, FaCalendarAlt } from "react-icons/fa";
import QuizQuestionsEditor from "./quizQuestionsEditor";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [quiz, setQuiz] = useState<any>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const fetchQuiz = async () => {
    if (qid) {
      try {
        const quizData = await quizzesClient.findQuizById(qid);
        setQuiz(quizData);
        dispatch(setCurrentQuiz(quizData));
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [qid]);

  const handleSaveansPublish = async (published = false) => {
    try {
      if (qid) {
        const updatedQuizObject = { ...quiz, published };
        await quizzesClient.updateQuiz(qid, updatedQuizObject);
        dispatch(updateQuiz(updatedQuizObject));
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const handleSave = async (published = false) => {
    try {
      if (qid) {
        const updatedQuizObject = { ...quiz, published };
        await quizzesClient.updateQuiz(qid, updatedQuizObject);
        dispatch(updateQuiz(updatedQuizObject));
        // navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const handleChange = (field: string, value: any) => {
    setQuiz({ ...quiz, [field]: value });
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const isInstructor = currentUser?.role === "FACULTY";

  if (!isInstructor) {
    return (
      <div className="alert alert-warning">
        You don't have permission to edit quizzes.
      </div>
    );
  }

  if (!quiz) {
    return <div>Loading quiz data...</div>;
  }

  return (
    <div id="wd-quiz-editor" className="container-fluid">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <div className="me-2">
          <span className="me-2">Points: {quiz.points}</span>
          {quiz.published ? (
            <span className="me-2 text-success"><FaCheckCircle /> Published</span>
          ) : (
            <span className="me-2 text-muted"><FaBan /> Not Published</span>
          )}
        </div>
      </div>
      <hr />

      <Tabs defaultActiveKey="details" id="quiz-editor-tabs" className="mb-4">
        <Tab eventKey="details" title="Details">
          <Card className="mt-3">
            <Card.Body>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Quiz Title"
                  value={quiz.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Quiz Instructions:</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Quiz Instructions"
                  value={quiz.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label">Quiz Type</label>
                  <select
                    className="form-select"
                    value={quiz.quizType}
                    onChange={(e) => handleChange("quizType", e.target.value)}
                  >
                    <option value="Graded Quiz">Graded Quiz</option>
                    <option value="Practice Quiz">Practice Quiz</option>
                    <option value="Graded Survey">Graded Survey</option>
                    <option value="Ungraded Survey">Ungraded Survey</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Assignment Group</label>
                  <select
                    className="form-select"
                    value={quiz.assignmentGroup}
                    onChange={(e) => handleChange("assignmentGroup", e.target.value)}
                  >
                    <option value="Quizzes">Quizzes</option>
                    <option value="Exams">Exams</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label">Points</label>
                  <input
                    type="number"
                    className="form-control"
                    value={quiz.points}
                    onChange={(e) => handleChange("points", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Time Limit (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={quiz.timeLimit}
                    onChange={(e) => handleChange("timeLimit", parseInt(e.target.value) || 20)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={quiz.multipleAttempts}
                    onChange={(e) => handleChange("multipleAttempts", e.target.checked)}
                  />
                  <label className="form-check-label">
                    Allow Multiple Attempts
                  </label>
                </div>
                {quiz.multipleAttempts && (
                  <div className="mt-2">
                    <label className="form-label">How Many Attempts</label>
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: "100px" }}
                      value={quiz.howManyAttempts}
                      onChange={(e) => handleChange("howManyAttempts", parseInt(e.target.value) || 1)}
                    />
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Show Correct Answers</label>
                <select
                  className="form-select"
                  value={quiz.showCorrectAnswers}
                  onChange={(e) => handleChange("showCorrectAnswers", e.target.value)}
                >
                  <option value="Immediately">Immediately</option>
                  <option value="Never">Never</option>
                  <option value="After Due Date">After Due Date</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Access Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={quiz.accessCode}
                  onChange={(e) => handleChange("accessCode", e.target.value)}
                />
              </div>

              <div className="mb-3">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={quiz.oneQuestionAtATime}
                    onChange={(e) => handleChange("oneQuestionAtATime", e.target.checked)}
                  />
                  <label className="form-check-label">
                    One Question at a Time
                  </label>
                </div>
                
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={quiz.lockQuestionsAfterAnswering}
                    onChange={(e) => handleChange("lockQuestionsAfterAnswering", e.target.checked)}
                  />
                  <label className="form-check-label">
                    Lock Questions After Answering
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={quiz.shuffleAnswers}
                    onChange={(e) => handleChange("shuffleAnswers", e.target.checked)}
                  />
                  <label className="form-check-label">
                    Shuffle Answers
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={quiz.webcamRequired}
                    onChange={(e) => handleChange("webcamRequired", e.target.checked)}
                  />
                  <label className="form-check-label">
                    Webcam Required
                  </label>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="row mt-4">
            <div className="col-12">
              <div className="mb-4">
                <h5>Assign</h5>
                <div className="border p-3 rounded">
                  <div className="row">
                    <div className="col-12 mb-2">
                      <label className="form-label"><strong>Assign to</strong></label>
                      <div className="border p-2 bg-light d-flex align-items-center">
                        <span>Everyone</span>
                        <Button variant="light" size="sm" className="ms-auto" onClick={() => {}}>
                          &times;
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label"><strong>Due</strong></label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formatDateForInput(quiz.dueDate)}
                        onChange={(e) => handleChange("dueDate", e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label"><strong>Available from</strong></label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formatDateForInput(quiz.availableDate)}
                        onChange={(e) => handleChange("availableDate", e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label"><strong>Until</strong></label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formatDateForInput(quiz.untilDate)}
                        onChange={(e) => handleChange("untilDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
                    <Button variant="secondary" className="w-100">+ Add</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleSave(false)}
            >
              Save
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleSaveansPublish(true)}
            >
              Save & Publish
            </button>
          </div>
        </Tab>

        <Tab eventKey="questions" title="Questions">
        <QuizQuestionsEditor/> 
        </Tab>
      </Tabs>
    </div>
  );
}