import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as quizzesClient from "./client";
import { setQuizzes, addQuiz, deleteQuiz, updateQuiz } from "./reducer";

export default function QuizList() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    if (cid) {
      const quizzes = await quizzesClient.findQuizzesForCourse(cid);
      dispatch(setQuizzes(quizzes));
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const formatDate = (date: string) => {
    if (!date) return "No Due Date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const getAvailabilityStatus = (quiz: any) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (!quiz.published) {
      return "Not Published";
    }

    if (availableDate && now < availableDate) {
      return `Not available until ${formatDate(quiz.availableDate)}`;
    }
    
    if (untilDate && now > untilDate) {
      return "Closed";
    }
    
    return "Available";
  };

  const handleCreateQuiz = async () => {
    console.log("Create quiz clicked, cid:", cid);
    
    if (cid) {
      try {
        const newQuiz = {
          title: "New Quiz",
          course: cid,
          description: "",
          quizType: "Graded Quiz",
          points: 0,
          assignmentGroup: "Quizzes",
          shuffleAnswers: true,
          timeLimit: 20,
          multipleAttempts: false,
          howManyAttempts: 1,
          showCorrectAnswers: "Immediately",
          accessCode: "",
          oneQuestionAtATime: true,
          webcamRequired: false,
          lockQuestionsAfterAnswering: false,
          published: false,
          questions: []
        };
        
        console.log("Creating quiz with data:", newQuiz);
        const quiz = await quizzesClient.createQuizForCourse(cid, newQuiz);
        console.log("Quiz created successfully:", quiz);
        
        dispatch(addQuiz(quiz));
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit`);
      } catch (error) {
        console.error("Error creating quiz:", error);
        alert("Failed to create quiz. Check console for details.");
      }
    } else {
      console.error("No course ID found");
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const handlePublishToggle = async (quiz: any) => {
    const updatedPublished = !quiz.published;
    await quizzesClient.publishQuiz(quiz._id, updatedPublished);
    dispatch(updateQuiz({ ...quiz, published: updatedPublished }));
  };

  const handleEditQuiz = (quizId: string) => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`);
  };

  const isInstructor = currentUser?.role === "FACULTY";

  console.log("Current user:", currentUser);
  console.log("Is instructor:", isInstructor);
  console.log("Course ID:", cid);

  return (
    <div id="wd-quizzes">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <input 
          type="text" 
          className="form-control me-2" 
          placeholder="Search for Quiz" 
          style={{ maxWidth: "300px" }}
        />
        {isInstructor && (
          <button 
            className="btn btn-danger"
            onClick={handleCreateQuiz}
          >
            <BsPlus className="fs-4" /> Quiz
          </button>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-4">No quizzes available</p>
          {isInstructor && (
            <p className="text-muted">Click the + Quiz button to create your first quiz</p>
          )}
        </div>
      ) : (
        <ul className="list-group rounded-0">
          <li className="list-group-item p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              Assignment Quizzes
            </div>
            
            <ul className="wd-assignment-list list-group rounded-0">
              {quizzes.map((quiz: any) => (
                <li key={quiz._id} className="wd-assignment-list-item list-group-item p-3 ps-1">
                  <div className="row align-items-center">
                    <div className="col-1">
                      <BsGripVertical className="me-2 fs-3" />
                    </div>
                    
                    <div className="col-1 text-center">
                      {quiz.published ? (
                        <FaCheckCircle 
                          className="text-success fs-4" 
                          style={{ cursor: isInstructor ? "pointer" : "default" }}
                          onClick={isInstructor ? () => handlePublishToggle(quiz) : undefined}
                        />
                      ) : (
                        <FaBan 
                          className="text-muted fs-4" 
                          style={{ cursor: isInstructor ? "pointer" : "default" }}
                          onClick={isInstructor ? () => handlePublishToggle(quiz) : undefined}
                        />
                      )}
                    </div>
                    
                    <div className="col-8">
                      <a 
                        className="wd-assignment-link text-decoration-none text-dark"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`);
                        }}
                      >
                        <strong>{quiz.title}</strong>
                      </a>
                      <div className="text-muted">
                        <small>
                          <strong>{getAvailabilityStatus(quiz)}</strong>
                          {quiz.dueDate && (
                            <span> | <strong>Due</strong> {formatDate(quiz.dueDate)}</span>
                          )}
                          <span> | {quiz.points} pts</span>
                          <span> | {quiz.questions ? quiz.questions.length : 0} Questions</span>
                        </small>
                      </div>
                    </div>
                    
                    <div className="col-2 text-end">
                      {isInstructor && (
                        <div className="dropdown">
                          <button
                            className="btn btn-link text-dark"
                            onClick={() => setShowContextMenu(
                              showContextMenu === quiz._id ? null : quiz._id
                            )}
                          >
                            <IoEllipsisVertical />
                          </button>
                          
                          {showContextMenu === quiz._id && (
                            <div className="dropdown-menu show position-absolute end-0">
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  handleEditQuiz(quiz._id);
                                  setShowContextMenu(null);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  handleDeleteQuiz(quiz._id);
                                  setShowContextMenu(null);
                                }}
                              >
                                Delete
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  handlePublishToggle(quiz);
                                  setShowContextMenu(null);
                                }}
                              >
                                {quiz.published ? 'Unpublish' : 'Publish'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      )}
    </div>
  );
}