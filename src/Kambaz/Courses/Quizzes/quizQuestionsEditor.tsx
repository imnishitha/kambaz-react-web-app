import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Button, FormControl } from "react-bootstrap";
import { FaPlusCircle, FaTrash, FaPen} from "react-icons/fa";
import * as quizzesClient from "./client";

export default function QuizQuestionsEditor() {
  const {cid, qid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [questions, setQuestions] = useState<any[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    points: 0,
  });



  // Helper function to extract correct answers based on question type

  // Helper function to extract correct answers based on question type
  const extractCorrectAnswers = (questionData: any) => {
    const { questionType, options, choices, blanks, correctAnswer: currentCorrectAnswer } = questionData;
    
    switch (questionType) {
      case "TRUE_FALSE":
        // For true/false, return the boolean value or extract from options
        if (currentCorrectAnswer !== undefined && currentCorrectAnswer !== null) {
          return currentCorrectAnswer;
        }
        // Fallback: extract from options if correctAnswer is not set
        const trueOption = (options || []).find((opt: any) => opt.text === "True");
        return trueOption?.isCorrect === true;
        
      case "MULTIPLE_CHOICE":
        const currentOptions = options || choices || [];
        
        if (questionData.multipleCorrectAnswers) {
          // Multiple correct answers - return array of correct answer texts
          return currentOptions
            .filter((opt: any) => opt.isCorrect)
            .map((opt: any) => opt.text);
        } else {
          // Single correct answer - return the text of the correct option
          const correctOption = currentOptions.find((opt: any) => opt.isCorrect);
          return correctOption?.text || null;
        }
        
      case "FILL_IN_THE_BLANK":
        // Return all possible correct answers for fill in the blank
        return (blanks || []).map((blank: any) => ({
          text: typeof blank === 'string' ? blank : blank.text,
          caseSensitive: typeof blank === 'object' ? blank.caseSensitive : false
        }));
        
      default:
        return null;
    }
  };

  // Function to calculate total points from all questions
  const calculateTotalPoints = (questions: any[]) => {
    return questions.reduce((total, question) => total + (question.points || 0), 0);
  };

  // Function to update quiz points in database
  const updateQuizPoints = async (newTotalPoints: number) => {
    try {
      await quizzesClient.updateQuiz(qid!, { points: newTotalPoints });
      console.log(`Quiz points updated to: ${newTotalPoints}`);
    } catch (error) {
      console.error("Error updating quiz points:", error);
    }
  };

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
        
        // Calculate and update total points
        const totalPoints = calculateTotalPoints(questionsData);
        setQuizInfo(prev => ({ ...prev, points: totalPoints }));
      });
    }
  }, [qid]);

  // Update total points when questions change
  useEffect(() => {
    const newTotalPoints = calculateTotalPoints(questions);
    if (newTotalPoints !== quizInfo.points) {
      setQuizInfo(prev => ({ ...prev, points: newTotalPoints }));
    }
  }, [questions]);

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
      correctAnswer: "Possible Answer", // Initialize with the correct answer
      multipleCorrectAnswers: false,
      quizId: qid
    };
    
    try {
      const createdQuestion = await quizzesClient.createQuestion(qid, newQuestion);
      console.log("Created question:", createdQuestion);
      
      const updatedQuestions = [...questions, createdQuestion];
      setQuestions(updatedQuestions);
      setEditingQuestionId(createdQuestion._id);
      
      // Update total points
      const newTotalPoints = calculateTotalPoints(updatedQuestions);
      setQuizInfo(prev => ({ ...prev, points: newTotalPoints }));
      await updateQuizPoints(newTotalPoints);
      
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Failed to create new question. Please try again.");
    }
  };

  // Enhanced answer change handlers
  const handleTrueFalseChange = (questionId: string, isTrue: boolean) => {
    updateQuestionInState(questionId, { 
      correctAnswer: isTrue,
      options: [
        { text: "True", isCorrect: isTrue },
        { text: "False", isCorrect: !isTrue }
      ]
    });
  };

  

  

  const handleMultipleChoiceChange = (questionId: string, optionIndex: number, questionData: any) => {
    const currentOptions = questionData.options || questionData.choices || [];
    let updatedOptions;
    let correctAnswer;

    if (questionData.multipleCorrectAnswers) {
      // Multiple correct answers
      updatedOptions = currentOptions.map((o: any, i: number) => ({
        ...o,
        isCorrect: i === optionIndex ? !o.isCorrect : o.isCorrect
      }));
      // Extract all correct answers
      correctAnswer = updatedOptions
        .filter((opt: any) => opt.isCorrect)
        .map((opt: any) => opt.text);
    } else {
      // Single correct answer
      updatedOptions = currentOptions.map((o: any, i: number) => ({
        ...o,
        isCorrect: i === optionIndex
      }));
      // Extract the single correct answer
      correctAnswer = updatedOptions.find((opt: any) => opt.isCorrect)?.text || null;
    }

    updateQuestionInState(questionId, { 
      options: updatedOptions,
      correctAnswer: correctAnswer
    });
  };

  const handleBlankChange = (questionId: string, blankIndex: number, newText: string, questionData: any) => {
    const updatedBlanks = (questionData.blanks || []).map((b: any, i: number) => 
      i === blankIndex ? (typeof b === 'string' ? newText : { ...b, text: newText }) : b
    );
    
    // Update correctAnswer to match the blanks
    const correctAnswer = updatedBlanks.map((blank: any) => ({
      text: typeof blank === 'string' ? blank : blank.text,
      caseSensitive: typeof blank === 'object' ? blank.caseSensitive : false
    }));
    
    updateQuestionInState(questionId, { 
      blanks: updatedBlanks,
      correctAnswer: correctAnswer
    });
  };

  const handleAddBlank = (questionId: string) => {
    const currentQuestion = questions.find((q) => q._id === questionId);
    const newBlank = { text: "Another Possible Answer", caseSensitive: false };
    const updatedBlanks = [...(currentQuestion?.blanks || []), newBlank];
    const correctAnswer = updatedBlanks.map((blank: any) => ({
      text: typeof blank === 'string' ? blank : blank.text,
      caseSensitive: typeof blank === 'object' ? blank.caseSensitive : false
    }));
    
    updateQuestionInState(questionId, { 
      blanks: updatedBlanks,
      correctAnswer: correctAnswer
    });
  };
  
  const handleRemoveBlank = (questionId: string, blankIndex: number) => {
    const currentBlanks = questions.find((q) => q._id === questionId)?.blanks || [];
    const updatedBlanks = currentBlanks.filter((_: any, i: number) => i !== blankIndex);
    const correctAnswer = updatedBlanks.map((blank: any) => ({
      text: typeof blank === 'string' ? blank : blank.text,
      caseSensitive: typeof blank === 'object' ? blank.caseSensitive : false
    }));
    
    updateQuestionInState(questionId, { 
      blanks: updatedBlanks,
      correctAnswer: correctAnswer
    });
  };

  const handleSaveQuestion = async (questionData: any) => {
    try {
      setSaving(true);
      console.log("Saving question:", questionData);

      // Extract the correct answers based on question type
      const correctAnswers = extractCorrectAnswers(questionData);
      console.log("Extracted correct answers:", correctAnswers);

      const questionToSave = {
        title: questionData.title || "Untitled Question",
        points: questionData.points,
        questionType: questionData.questionType,
        questionText: questionData.questionText,
        options: questionData.options || [],
        blanks: questionData.blanks || [],
        correctAnswer: correctAnswers, // This now contains the properly extracted answers
        multipleCorrectAnswers: questionData.multipleCorrectAnswers || false,
        quizId: qid
      };

      console.log("Question to save:", questionToSave);

      const updatedQuestion = await quizzesClient.updateQuestion(qid!, questionData._id, questionToSave);
      console.log("Question saved successfully:", updatedQuestion);

      setQuestions(updatedQuestion);
      
      // Update total points after saving question
      const newTotalPoints = calculateTotalPoints(updatedQuestion);
      setQuizInfo(prev => ({ ...prev, points: newTotalPoints }));
      await updateQuizPoints(newTotalPoints);

      setEditingQuestionId(null);
    } catch (error) {
      console.error("Error saving question:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllQuestions = async () => {
    try {
      setSaving(true);
      console.log("Saving all questions:", questions);

      const updatePromises = questions.map(async (questionData) => {
        // Extract correct answers for each question
        const correctAnswers = extractCorrectAnswers(questionData);
        
        const questionToSave = {
          title: questionData.title || "Untitled Question",
          points: questionData.points,
          questionType: questionData.questionType,
          questionText: questionData.questionText,
          options: questionData.options || [],
          blanks: questionData.blanks || [],
          correctAnswer: correctAnswers, // Properly extracted answers
          multipleCorrectAnswers: questionData.multipleCorrectAnswers || false,
          quizId: qid
        };

        const updatedQuestion = await quizzesClient.updateQuestion(qid!, questionData._id, questionToSave);
        return updatedQuestion;
      });

      const updatedQuestions = await Promise.all(updatePromises);
      setQuestions(updatedQuestions);
      alert("All questions saved successfully!");
    } catch (error) {
      console.error("Error saving questions:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await quizzesClient.deleteQuestion(qid!, questionId);
        
        const updatedQuestions = questions.filter(q => q._id !== questionId);
        setQuestions(updatedQuestions);
        
        // Update total points after deletion
        const newTotalPoints = calculateTotalPoints(updatedQuestions);
        setQuizInfo(prev => ({ ...prev, points: newTotalPoints }));
        await updateQuizPoints(newTotalPoints);
        
        console.log("Question deleted successfully");
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  const handleAddOption = (questionId: string) => {
    setQuestions(questions.map(q => q._id === questionId ? {
      ...q,
      options: [...(q.options || q.choices || []), { text: "Another Possible Answer", isCorrect: false }]
    } : q));
  };

  const handleRemoveOption = (questionId: string, optionIndex: number) => {
    const currentQuestion = questions.find(q => q._id === questionId);
    const currentOptions = currentQuestion?.options || currentQuestion?.choices || [];
    const updatedOptions = currentOptions.filter((_: any, i: number) => i !== optionIndex);
    
    let correctAnswer;
    if (currentQuestion?.multipleCorrectAnswers) {
      correctAnswer = updatedOptions
        .filter((opt: any) => opt.isCorrect)
        .map((opt: any) => opt.text);
    } else {
      const correctOption = updatedOptions.find((opt: any) => opt.isCorrect);
      correctAnswer = correctOption?.text || null;
    }
    
    updateQuestionInState(questionId, { 
      options: updatedOptions,
      correctAnswer: correctAnswer
    });
  };

  // Helper function to update question in state
  const updateQuestionInState = (questionId: string, updates: Partial<any>) => {
    setQuestions(questions.map(q => 
      q._id === questionId ? { ...q, ...updates } : q
    ));
  };

  // Enhanced handleQuestionTypeChange to set proper initial correct answers
  const handleQuestionTypeChange = (questionId: string, newType: string) => {
    const updates: any = { questionType: newType };

    if (newType === "TRUE_FALSE") {
      updates.correctAnswer = true; // Set default correct answer
      updates.options = [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ];
      updates.blanks = [];
      updates.multipleCorrectAnswers = false;
    } else if (newType === "MULTIPLE_CHOICE") {
      updates.options = [{ text: "Possible Answer", isCorrect: true }];
      updates.correctAnswer = "Possible Answer"; // Set default correct answer
      updates.blanks = [];
      updates.multipleCorrectAnswers = false;
    } else if (newType === "FILL_IN_THE_BLANK") {
      updates.blanks = [{ text: "Possible Answer", caseSensitive: false }];
      updates.correctAnswer = [{ text: "Possible Answer", caseSensitive: false }]; // Set default
      updates.options = [];
      updates.multipleCorrectAnswers = false;
    }

    updateQuestionInState(questionId, updates);
  };

  const isInstructor = currentUser?.role === "FACULTY";

  // Points Display Component
  const PointsDisplay = () => (
    <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
      <span>Total Quiz Points: <strong>{quizInfo.points}</strong></span>
      <small className="text-muted">
        {questions.length} question{questions.length !== 1 ? 's' : ''}
      </small>
    </div>
  );

  return (
    <div id="wd-quiz-questions-editor" className="mt-4">
      <PointsDisplay />
      
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
                
                {/* Title Field */}
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
                
                {/* FILL_IN_THE_BLANK Question Type - Updated */}
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
                            onChange={e => handleBlankChange(questionItem._id, index, e.target.value, questionItem)}
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
                              
                              // Update correctAnswer to match the blanks
                              const correctAnswer = updatedBlanks.map((blank: any) => ({
                                text: typeof blank === 'string' ? blank : blank.text,
                                caseSensitive: typeof blank === 'object' ? blank.caseSensitive : false
                              }));
                              
                              updateQuestionInState(questionItem._id, { 
                                blanks: updatedBlanks,
                                correctAnswer: correctAnswer
                              });
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
                /* TRUE/FALSE Question Type - Updated */
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
                        onChange={() => handleTrueFalseChange(questionItem._id, true)}
                      />
                      <Form.Check 
                        type="radio" 
                        id={`false-${questionItem._id}`}
                        name={`trueFalse-${questionItem._id}`} 
                        label="False"
                        checked={questionItem.correctAnswer === false || questionItem.correctAnswer === "false"}
                        onChange={() => handleTrueFalseChange(questionItem._id, false)}
                      />
                    </div>
                  </div>
                ) : (
                  /* MULTIPLE_CHOICE Question Type - Updated */
                  <>
                    <div className="mb-2">
                      <Form.Check 
                        type="checkbox"
                        label="Allow multiple correct answers"
                        checked={questionItem.multipleCorrectAnswers || false}
                        onChange={(e) => {
                          // When toggling multiple answers, update the correctAnswer format
                          const isMultiple = e.target.checked;
                          const currentOptions = questionItem.options || questionItem.choices || [];
                          
                          let correctAnswer;
                          if (isMultiple) {
                            // Convert to array format
                            correctAnswer = currentOptions
                              .filter((opt: any) => opt.isCorrect)
                              .map((opt: any) => opt.text);
                          } else {
                            // Convert to single value format
                            const correctOption = currentOptions.find((opt: any) => opt.isCorrect);
                            correctAnswer = correctOption?.text || null;
                          }
                          
                          updateQuestionInState(questionItem._id, { 
                            multipleCorrectAnswers: isMultiple,
                            correctAnswer: correctAnswer
                          });
                        }}
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
                          onChange={() => handleMultipleChoiceChange(questionItem._id, index, questionItem)}
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
                            
                            // Update correctAnswer when option text changes
                            let correctAnswer;
                            if (questionItem.multipleCorrectAnswers) {
                              correctAnswer = updatedOptions
                                .filter((opt: any) => opt.isCorrect)
                                .map((opt: any) => opt.text);
                            } else {
                              const correctOption = updatedOptions.find((opt: any) => opt.isCorrect);
                              correctAnswer = correctOption?.text || null;
                            }
                            
                            updateQuestionInState(questionItem._id, { 
                              options: updatedOptions,
                              correctAnswer: correctAnswer
                            });
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