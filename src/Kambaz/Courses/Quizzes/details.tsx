import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEye, FaEdit, FaPlay } from "react-icons/fa";
import * as quizzesClient from "./client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = async () => {
    if (qid) {
      try {
        const quizData = await quizzesClient.findQuizById(qid);
        setQuiz(quizData);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [qid]);

  const formatDateShort = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatDateTime = (date: string) => {
    if (!date) return "";
    const dateStr = formatDateShort(date);
    const timeStr = formatTime(date);
    return `${dateStr} at ${timeStr}`;
  };

  const isInstructor = currentUser?.role === "FACULTY";
  const canTakeQuiz = !isInstructor && quiz?.published;

  const handleEdit = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };

  const handlePreview = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  const handleStartQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="alert alert-danger">
        Quiz not found
      </div>
    );
  }

  return (
    <div id="wd-quiz-details" className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{quiz.title}</h1>
        
        <div className="d-flex gap-2">
          {isInstructor ? (
            <>
              <button 
                className="btn btn-outline-secondary"
                onClick={handlePreview}
              >
                <FaEye className="me-1" /> Preview
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleEdit}
              >
                <FaEdit className="me-1" /> Edit
              </button>
            </>
          ) : canTakeQuiz ? (
            <button 
              className="btn btn-success btn-lg"
              onClick={handleStartQuiz}
            >
              <FaPlay className="me-2" /> Take Quiz
            </button>
          ) : null}
        </div>
      </div>

      <hr />

      {/* Quiz Details - Matching the exact layout from image */}
      <div className="quiz-details-grid">
        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Quiz Type</strong>
          </div>
          <div className="col-9">
            {quiz.quizType || "Graded Quiz"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Points</strong>
          </div>
          <div className="col-9">
            {quiz.points}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Assignment Group</strong>
          </div>
          <div className="col-9">
            {quiz.assignmentGroup?.toUpperCase() || "QUIZZES"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Shuffle Answers</strong>
          </div>
          <div className="col-9">
            {quiz.shuffleAnswers ? "Yes" : "No"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Time Limit</strong>
          </div>
          <div className="col-9">
            {quiz.timeLimit} Minutes
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Multiple Attempts</strong>
          </div>
          <div className="col-9">
            {quiz.multipleAttempts ? "Yes" : "No"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>View Responses</strong>
          </div>
          <div className="col-9">
            Always
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Show Correct Answers</strong>
          </div>
          <div className="col-9">
            {quiz.showCorrectAnswers || "Immediately"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>One Question at a Time</strong>
          </div>
          <div className="col-9">
            {quiz.oneQuestionAtATime ? "Yes" : "No"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Require Respondus LockDown Browser</strong>
          </div>
          <div className="col-9">
            {quiz.webcamRequired ? "Yes" : "No"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Required to View Quiz Results</strong>
          </div>
          <div className="col-9">
            No
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3 text-end pe-4">
            <strong>Webcam Required</strong>
          </div>
          <div className="col-9">
            {quiz.webcamRequired ? "Yes" : "No"}
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-3 text-end pe-4">
            <strong>Lock Questions After Answering</strong>
          </div>
          <div className="col-9">
            {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* Date Table - Matching the exact layout from image */}
      <table className="table table-bordered mt-4">
        <thead>
          <tr className="table-light">
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDateTime(quiz.dueDate) || "-"}</td>
            <td>Everyone</td>
            <td>{formatDateTime(quiz.availableDate) || "-"}</td>
            <td>{formatDateTime(quiz.untilDate) || "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}