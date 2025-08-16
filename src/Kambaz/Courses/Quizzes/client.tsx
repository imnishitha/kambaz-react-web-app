import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api`;

export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/courses/${courseId}/quizzes`
  );
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/quizzes/${quizId}`
  );
  return response.data;
};

export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/courses/${courseId}/quizzes`,
    quiz
  );
  return response.data;
};

export const updateQuiz = async (quizId: string, quizUpdates: any) => {
  const response = await axiosWithCredentials.put(
    `${QUIZZES_API}/quizzes/${quizId}`,
    quizUpdates
  );
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUIZZES_API}/quizzes/${quizId}`
  );
  return response.data;
};

export const publishQuiz = async (quizId: string, published: boolean) => {
  const response = await axiosWithCredentials.put(
    `${QUIZZES_API}/quizzes/${quizId}/publish`,
    { published }
  );
  return response.data;
};

export const findQuestionsForQuiz = async (quizId: string) => {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/quizzes/${quizId}/questions`);
    return response.data;
  };
  
  export const createQuestion = async (quizId: string, question: any) => {
    console.log("Creating question for quiz:", quizId, question, QUIZZES_API);
    const response = await axiosWithCredentials.post(
      `${QUIZZES_API}/quizzes/${quizId}/questions`, question
    );
    return response.data;
  };

  export const updateQuestion = async (quizId: string, questionId: string, questionUpdates: any) => {
    const response = await axiosWithCredentials.put(
      `${REMOTE_SERVER}/api/quizzes/${quizId}/questions/${questionId}`, 
      questionUpdates
    );
    return response.data;
  };
  
  export const deleteQuestion = async (quizId: string, questionId: string) => {
    const response = await axiosWithCredentials.delete(
      `${REMOTE_SERVER}/api/quizzes/${quizId}/questions/${questionId}`
    );
    return response.data;
  };