import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Form, Card, ListGroup, FormControl } from "react-bootstrap";
import { FaEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import * as quizzesClient from "./client";
import './index.css';

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [searchParams, setSearchParams] = useSearchParams();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const currentQuestionIndex = parseInt(searchParams.get('question') || '0', 10);

  const fetchQuizData = async () => {
    if (qid) {
      try {
        const quizData = await quizzesClient.findQuizById(qid);
        const questionsData = await quizzesClient.findQuestionsForQuiz(qid);
        setQuiz(quizData);
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [qid]);

  const handleAnswerChange = (questionId: string, answer: any, blankIndex?: number) => {
    // Check if the answer is for a single-choice question
    if (blankIndex === undefined) {
      setAnswers({ ...answers, [questionId]: answer });
    } else {
      // For fill-in-the-blank, manage an array of answers
      const currentBlanks = answers[questionId] || [];
      const newBlanks = [...currentBlanks];
      newBlanks[blankIndex] = answer;
      setAnswers({ ...answers, [questionId]: newBlanks });
    }
  };

  const handleSubmitQuiz = () => {
    let newScore = 0;
    questions.forEach((q) => {
      const givenAnswer = answers[q._id];
      // This is a simplified example; a real implementation would be more complex
      if (givenAnswer && givenAnswer === q.correctAnswer) {
        newScore += q.points;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setSearchParams({ question: `${currentQuestionIndex + 1}` });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setSearchParams({ question: `${currentQuestionIndex - 1}` });
    }
  };

  if (!quiz || !questions) {
    return <div>Loading quiz preview...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div id="wd-quiz-preview" className="d-flex p-3">
      {/* Quiz Content Section (Left Side) */}
      <div className="flex-grow-1 me-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{quiz.title}</h2>
          <Button onClick={handleEditQuiz} variant="secondary">
            <FaEdit className="me-2" /> Edit Quiz
          </Button>
        </div>
        <hr />
        {submitted && (
          <div className="alert alert-info">
            Your score is: {score} / {quiz.points}
          </div>
        )}
        <Form>
          {currentQuestion && (
            <Card className="mb-3">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>Question {currentQuestionIndex + 1}</span>
                <span>{currentQuestion.points} pts</span>
              </Card.Header>
              <Card.Body>
                <p>{currentQuestion.questionText}</p>
                
                {/* Conditional Rendering for Question Types */}
                {currentQuestion.questionType === "FILL_IN_THE_BLANK" ? (
                  // UI for Fill in the Blank
                  (currentQuestion.blanks || []).map((blank: any, index: number) => (
                    <div key={index} className="mb-2">
                      <Form.Label>{index + 1}.</Form.Label>
                      <FormControl
                        type="text"
                        disabled={submitted}
                        value={answers[currentQuestion._id]?.[index] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value, index)}
                      />
                    </div>
                  ))
                ) : (
                  // Default UI for Multiple Choice
                  currentQuestion.options?.map((option: any, optIndex: number) => (
                    <Form.Check
                      key={optIndex}
                      type="radio"
                      id={`q-${currentQuestion._id}-opt-${optIndex}`}
                      name={`question-${currentQuestion._id}`}
                      label={option.text}
                      disabled={submitted}
                      checked={answers[currentQuestion._id] === option.text}
                      onChange={() => handleAnswerChange(currentQuestion._id, option.text)}
                    />
                  ))
                )}
              </Card.Body>
            </Card>
          )}

          {!submitted && (
            <div className="d-flex justify-content-between mt-3">
              <Button onClick={handlePreviousQuestion} variant="primary" disabled={currentQuestionIndex === 0}>
                <FaChevronLeft className="me-2" /> Previous
              </Button>
              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNextQuestion} variant="primary">
                  Next <FaChevronRight className="ms-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmitQuiz} variant="success">
                  Submit Quiz
                </Button>
              )}
            </div>
          )}
        </Form>
      </div>

      <div className="d-none d-md-block" style={{ width: '250px' }}>
        <Card>
          <Card.Header>Questions</Card.Header>
          <ListGroup variant="flush">
            {questions.map((q, index) => (
              <ListGroup.Item
                key={q._id}
                action
                className={currentQuestionIndex === index ? 'wd-question-nav-active' : ''}
                onClick={() => setSearchParams({ question: `${index}` })}
              >
                Question {index + 1}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </div>
    </div>
  );
}