import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [],
  currentQuiz: null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, { payload: quiz }) => {
      const newQuiz: any = {
        _id: quiz._id,
        title: quiz.title || "New Quiz",
        course: quiz.course,
        description: quiz.description || "",
        quizType: quiz.quizType || "Graded Quiz",
        points: quiz.points || 0,
        assignmentGroup: quiz.assignmentGroup || "Quizzes",
        shuffleAnswers: quiz.shuffleAnswers ?? true,
        timeLimit: quiz.timeLimit || 20,
        multipleAttempts: quiz.multipleAttempts || false,
        howManyAttempts: quiz.howManyAttempts || 1,
        showCorrectAnswers: quiz.showCorrectAnswers || "Immediately",
        accessCode: quiz.accessCode || "",
        oneQuestionAtATime: quiz.oneQuestionAtATime ?? true,
        webcamRequired: quiz.webcamRequired || false,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || false,
        dueDate: quiz.dueDate,
        availableDate: quiz.availableDate,
        untilDate: quiz.untilDate,
        published: quiz.published || false,
        questions: quiz.questions || []
      };
      state.quizzes = [...state.quizzes, newQuiz] as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q
      ) as any;
    },
    setCurrentQuiz: (state, action) => {
      state.currentQuiz = action.payload;
    },
    editQuiz: (state, { payload: quizId }) => {
      state.currentQuiz = state.quizzes.find(
        (q: any) => q._id === quizId
      );
    },
  },
});

export const { 
  setQuizzes, 
  addQuiz, 
  deleteQuiz, 
  updateQuiz, 
  setCurrentQuiz, 
  editQuiz 
} = quizzesSlice.actions;

export default quizzesSlice.reducer;