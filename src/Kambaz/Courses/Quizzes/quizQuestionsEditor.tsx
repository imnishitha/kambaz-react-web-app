


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Button, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { FaPlusCircle, FaTrash, FaPen, FaCheck, FaTimes } from "react-icons/fa";
import * as quizzesClient from "./client";

export default function QuizQuestionsEditor() {

const {cid,  qid } = useParams();
const navigate = useNavigate();
const { currentUser } = useSelector((state: any) => state.accountReducer);

const [questions, setQuestions] = useState<any[]>([]);
const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
const [saving, setSaving] = useState(false);

useEffect(() => {
  if (qid) {
    // Fetch questions for the current quiz
    quizzesClient.findQuestionsForQuiz(qid).then(data => {
      console.log("Raw data from findQuestionsForQuiz:", data);
      
      // TEMP FIX: Remove the last element if it's a quiz object
      let questionsData = [...data];
      const lastItem = questionsData[questionsData.length - 1];
      
      // If last item has quiz properties, remove it
      if (lastItem && (lastItem.course || lastItem.quizType || lastItem.questions)) {
        console.log("Removing quiz object from end:", lastItem);
        questionsData = questionsData.slice(0, -1);
      }
      
      console.log("Final questions data:", questionsData);
      setQuestions(questionsData);
    });
  }
}, [qid]);

console.log("Rendering QuizQuestionsEditor");
console.log("Current questions:", questions);

const handleNewQuestion = async () => {
  console.log("Creating new question for quiz:", qid);
  if (!qid) return;

  const newQuestion = {
    title: "New Question",
    points: 1,
    questionType: "MULTIPLE_CHOICE",
    questionText: "Question text...",
    options: [{ text: "Possible Answer", isCorrect: true }],
    blanks: [],
    correctAnswer: null, // For TRUE_FALSE questions
    quizId: qid // Ensure the question is tied to this quiz
  };
  
  try {
    const createdQuestion = await quizzesClient.createQuestion(qid, newQuestion);
    console.log("Created question:", createdQuestion);
    setQuestions([...questions, createdQuestion]);
    setEditingQuestionId(createdQuestion._id);
  } catch (error) {
    console.error("Error creating question:", error);
    alert("Failed to create new question. Please try again.");
  }};
  const handleAddBlank = (questionId: string) => {
    updateQuestionInState(questionId, {
      blanks: [
        ...questions.find((q) => q._id === questionId)?.blanks,
        { text: "Another Possible Answer", caseSensitive: false }
      ]
    });
  };
  
  const handleRemoveBlank = (questionId: string, blankIndex: number) => {
    const currentBlanks = questions.find((q) => q._id === questionId)?.blanks || [];
    const updatedBlanks = currentBlanks.filter((_: any, i: number) => i !== blankIndex);
    updateQuestionInState(questionId, { blanks: updatedBlanks });
  };



const handleSaveQuestion = async (questionData: any) => {
  try {
    setSaving(true);
    console.log("Saving question:", questionData);
    
    const questionToSave = {
      title: questionData.title || "Untitled Question",
      points: questionData.points,
      questionType: questionData.questionType,
      questionText: questionData.questionText,
      options: questionData.options || [],
      blanks: questionData.blanks || [],
      correctAnswer: questionData.correctAnswer, // For TRUE_FALSE questions
      multipleCorrectAnswers: questionData.multipleCorrectAnswers || false, // For MULTIPLE_CHOICE
      quizId: qid
    };
    
    const updatedQuestion = await quizzesClient.updateQuestion(qid!, questionData._id, questionToSave);
    console.log("Question saved successfully:", updatedQuestion);
    
    // Update the questions state with the returned data from server
    // setQuestions(questions.map(q =>
    //   q._id === questionData._id ? updatedQuestion : q
    // ));
    setQuestions(updatedQuestion);

    setEditingQuestionId(null);
  } catch (error) {
    console.error("Error saving question:", error);
    // alert("Failed to save question. Please try again.");
  } finally {
    setSaving(false);
  }
};

const handleSaveAllQuestions = async () => {
  try {
    setSaving(true);
    console.log("Saving all questions:", questions);

    // Save all questions with proper question data structure
    const updatePromises = questions.map(async (questionData) => {
      const questionToSave = {
        title: questionData.title || "Untitled Question",
        points: questionData.points,
        questionType: questionData.questionType,
        questionText: questionData.questionText,
        options: questionData.options || [],
        blanks: questionData.blanks || [],
        correctAnswer: questionData.correctAnswer, // For TRUE_FALSE questions
        multipleCorrectAnswers: questionData.multipleCorrectAnswers || false, // For MULTIPLE_CHOICE
        quizId: qid
      };
      
      const updatedQuestion = await quizzesClient.updateQuestion(qid!, questionData._id, questionToSave);
      return updatedQuestion;
    });

    const updatedQuestions = await Promise.all(updatePromises);

    // Update state with the server responses
    setQuestions(updatedQuestions);

    alert("All questions saved successfully!");
  } catch (error) {
    console.error("Error saving questions:", error);
    // alert("Failed to save some questions. Please try again.");
  } finally {
    setSaving(false);
  }
};

const handleDeleteQuestion = async (questionId: string) => {
  if (window.confirm("Are you sure you want to delete this question?")) {
    try {
      await quizzesClient.deleteQuestion(qid!, questionId);
      setQuestions(questions.filter(q => q._id !== questionId));
      console.log("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      // alert("Failed to delete question. Please try again.");
    }
  }
};

const handleAddOption = (questionId: string) => {
  setQuestions(questions.map(q => q._id === questionId ? {
    ...q,
    options: [...(q.options || q.choices || []), { text: " Another Possible Answer", isCorrect: false }]
  } : q));
};

const handleRemoveOption = (questionId: string, optionIndex: number) => {
  setQuestions(questions.map(q => q._id === questionId ? {
    ...q,
    options: (q.options || []).filter((_: any, i: number) => i !== optionIndex)
  } : q));
};

// Helper function to update question in state
const updateQuestionInState = (questionId: string, updates: Partial<any>) => {
  setQuestions(questions.map(q => 
    q._id === questionId ? { ...q, ...updates } : q
  ));
};

// Handle question type change
const handleQuestionTypeChange = (questionId: string, newType: string) => {
  const updates: any = { questionType: newType };
  
  if (newType === "TRUE_FALSE") {
    // Initialize True/False question
    updates.correctAnswer = true;
    updates.options = [
      { text: "True", isCorrect: true },
      { text: "False", isCorrect: false }
    ];
    updates.blanks = [];
    updates.multipleCorrectAnswers = false;
  } else if (newType === "MULTIPLE_CHOICE") {
    // Initialize Multiple Choice question
    updates.correctAnswer = null;
    updates.options = [{ text: "Possible Answer", isCorrect: true }];
    updates.blanks = [];
    updates.multipleCorrectAnswers = false;
  } else if (newType === "FILL_IN_THE_BLANK") {
    // Initialize Fill in the Blank question
    updates.correctAnswer = null;
    updates.options = [];
    updates.blanks = [{ text: "Possible Answer", caseSensitive: false }];
    updates.multipleCorrectAnswers = false;
  }
  
  updateQuestionInState(questionId, updates);
};

const isInstructor = currentUser?.role === "FACULTY";

return (
  <div id="wd-quiz-questions-editor" className="mt-4">
    <div className="d-flex justify-content-end mb-3">
      {isInstructor && (
        <Button onClick={handleNewQuestion} variant="secondary" disabled={saving}>
          <FaPlusCircle className="me-2" />
          New Question
        </Button>
      )}
    </div>

    <div className="list-group">
    {questions && questions.filter(q => q).map((questionItem) => (
        <div key={questionItem._id} className="list-group-item mb-3">
          {editingQuestionId === questionItem._id ? (
            // Question Edit View
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Select 
                  className="w-25" 
                  value={questionItem.questionType || "MULTIPLE_CHOICE"}
                  onChange={e => handleQuestionTypeChange(questionItem._id, e.target.value)}
                >
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                </Form.Select>
                <div className="d-flex align-items-center">
                  <span className="me-2">pts:</span>
                  <FormControl 
                    type="number" 
                    style={{ width: '60px' }} 
                    value={questionItem.points || 1} 
                    onChange={e => updateQuestionInState(questionItem._id, { points: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              {/* Title Field - Missing for all types */}
              <Form.Group className="mb-3">
                <Form.Label>Title:</Form.Label>
                <FormControl 
                  type="text"
                  placeholder="Question Title"
                  value={questionItem.title || ""} 
                  onChange={e => updateQuestionInState(questionItem._id, { title: e.target.value })}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Question:</Form.Label>
                <FormControl 
                  as="textarea" 
                  rows={3} 
                  placeholder="Enter your question text here..."
                  value={questionItem.questionText || ""} 
                  onChange={e => updateQuestionInState(questionItem._id, { questionText: e.target.value })}
                />
              </Form.Group>
              
              <h5 className="mt-4">Answers:</h5>
              

              {questionItem.questionType === "FILL_IN_THE_BLANK" ? (
                <div className="mb-3">
                  <p className="text-muted mb-3">Enter your question text, then define all possible correct answers for the blank. Students will see the question followed by a single text box to type their answer.</p>
                  
                  <div className="mb-3">
                    <h6>Possible Correct Answers:</h6>
                    {(questionItem.blanks || []).map((blank: any, index: number) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <FormControl 
                          type="text"
                          placeholder="Possible Answer"
                          className="me-2"
                          value={blank.text || blank || ""} 
                          onChange={e => {
                            const updatedBlanks = (questionItem.blanks || []).map((b: any, i: number) => 
                              i === index ? (typeof b === 'string' ? e.target.value : { ...b, text: e.target.value }) : b
                            );
                            updateQuestionInState(questionItem._id, { blanks: updatedBlanks });
                          }}
                        />
                        <Form.Check 
                          type="checkbox"
                          className="me-2"
                          label="Case Sensitive"
                          checked={blank.caseSensitive || false}
                          onChange={(e) => {
                            const updatedBlanks = (questionItem.blanks || []).map((b: any, i: number) => 
                              i === index ? { ...(typeof b === 'string' ? {text: b} : b), caseSensitive: e.target.checked } : b
                            );
                            updateQuestionInState(questionItem._id, { blanks: updatedBlanks });
                          }}
                        />
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleRemoveBlank(questionItem._id, index)}
                          disabled={saving}
                          title="Remove Answer"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    ))}
                    
                    {(questionItem.blanks || []).length === 0 && (
                      <div className="text-muted mb-2">No possible answers added yet.</div>
                    )}
                    
                    <div className="d-flex justify-content-center mt-3">
                      <Button 
                        variant="link" 
                        className="text-danger"
                        onClick={() => handleAddBlank(questionItem._id)}
                        disabled={saving}
                      >
                        + Add Another Answer
                      </Button>
                    </div>
                  </div>
                </div>
              ) : 
              /* TRUE/FALSE Question Type */
              questionItem.questionType === "TRUE_FALSE" ? (
                <div className="mb-3">
                  <p className="text-muted mb-3">Enter your question text, then select if True or False is the correct answer:</p>
                  
                  <div className="d-flex flex-column gap-2">
                    <Form.Check 
                      type="radio" 
                      id={`true-${questionItem._id}`}
                      name={`trueFalse-${questionItem._id}`} 
                      label="True"
                      checked={questionItem.correctAnswer === true || questionItem.correctAnswer === "true"}
                      onChange={() => updateQuestionInState(questionItem._id, { 
                        correctAnswer: true,
                        options: [
                          { text: "True", isCorrect: true },
                          { text: "False", isCorrect: false }
                        ]
                      })}
                    />
                    <Form.Check 
                      type="radio" 
                      id={`false-${questionItem._id}`}
                      name={`trueFalse-${questionItem._id}`} 
                      label="False"
                      checked={questionItem.correctAnswer === false || questionItem.correctAnswer === "false"}
                      onChange={() => updateQuestionInState(questionItem._id, { 
                        correctAnswer: false,
                        options: [
                          { text: "True", isCorrect: false },
                          { text: "False", isCorrect: true }
                        ]
                      })}
                    />
                  </div>
                </div>
              ) : (
                /* MULTIPLE_CHOICE Question Type */
                <>
                  <div className="mb-2">
                    <Form.Check 
                      type="checkbox"
                      label="Allow multiple correct answers"
                      checked={questionItem.multipleCorrectAnswers || false}
                      onChange={(e) => updateQuestionInState(questionItem._id, { multipleCorrectAnswers: e.target.checked })}
                    />
                  </div>
                  <p className="text-muted small mb-3">
                    {questionItem.multipleCorrectAnswers ? 
                      "Students can select multiple correct answers (checkboxes)." : 
                      "Students can select only one correct answer (radio buttons)."}
                  </p>
                  
                  {(questionItem.options || questionItem.choices || []).map((option: any, index: number) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                          <Form.Check 
                            type={questionItem.multipleCorrectAnswers ? "checkbox" : "radio"}
                            name={questionItem.multipleCorrectAnswers ? undefined : `correctAnswer-${questionItem._id}`}
                            checked={option.isCorrect || false} 
                            onChange={() => {
                              const currentOptions = questionItem.options || questionItem.choices || [];
                              let updatedOptions;
                              
                              if (questionItem.multipleCorrectAnswers) {
                                // For multiple correct answers, toggle this option
                                updatedOptions = currentOptions.map((o: any, i: number) => ({
                                  ...o,
                                  isCorrect: i === index ? !o.isCorrect : o.isCorrect
                                }));
                              } else {
                                // For single correct answer, only this option is correct
                                updatedOptions = currentOptions.map((o: any, i: number) => ({
                                  ...o,
                                  isCorrect: i === index
                                }));
                              }
                              updateQuestionInState(questionItem._id, { options: updatedOptions });
                            }} 
                          />
                          <FormControl 
                            className="ms-2" 
                            value={option.text || ""} 
                            placeholder="Answer choice"
                            onChange={e => {
                              const currentOptions = questionItem.options || questionItem.choices || [];
                              const updatedOptions = currentOptions.map((o: any, i: number) => 
                                i === index ? { ...o, text: e.target.value } : o
                              );
                              updateQuestionInState(questionItem._id, { options: updatedOptions });
                            }}
                          />
                          <Button 
                            variant="outline-danger" 
                            className="ms-2" 
                            onClick={() => handleRemoveOption(questionItem._id, index)}
                            disabled={saving}
                            title="Remove Option"
                          >
                            <FaTrash />
                          </Button>
                      </div>
                  ))}
                  <div className="d-flex justify-content-center mt-3">
                      <Button 
                        variant="link"
                        className="text-danger"
                        onClick={() => handleAddOption(questionItem._id)}
                        disabled={saving}
                      >
                        + Add Another Answer
                      </Button>
                  </div>
                </>
              )}
              
              <div className="d-flex justify-content-end mt-4 gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setEditingQuestionId(null)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => handleSaveQuestion(questionItem)}
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Question"}
                </Button>
              </div>
            </div>
          ) : (
            // Question Preview View
            <div className="d-flex justify-content-between align-items-center">
              <span>
                {questionItem.title || questionItem.questionText || "Untitled Question"}
                {questionItem.points && ` (${questionItem.points} pts)`}
              </span>
              <div className="d-flex gap-2">
                <Button 
                  variant="light" 
                  onClick={() => setEditingQuestionId(questionItem._id)}
                  disabled={saving}
                >
                  <FaPen />
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDeleteQuestion(questionItem._id)}
                  disabled={saving}
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
    
    {/* Buttons for overall quiz save */}
    <div className="d-flex justify-content-end mt-4 gap-2">
      <Button 
        variant="secondary" 
        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
        disabled={saving}
      >
        Cancel
      </Button>
      <Button 
        variant="danger" 
        onClick={handleSaveAllQuestions}
        disabled={saving || questions.length === 0}
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  </div>
);
}