
import { Quiz, QuizCreate, QuizStatus, EmailRecipients } from '@/types/quiz';

const API_URL = 'http://localhost:8000';

export const fetchQuizzes = async (status?: QuizStatus): Promise<Quiz[]> => {
  const url = status
    ? `${API_URL}/quizzes/?status=${status}`
    : `${API_URL}/quizzes/`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching quizzes: ${response.statusText}`);
  }
  
  return await response.json();
};

export const fetchQuizById = async (id: string): Promise<Quiz> => {
  const response = await fetch(`${API_URL}/quizzes/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching quiz: ${response.statusText}`);
  }
  
  return await response.json();
};

export const createQuiz = async (quiz: QuizCreate): Promise<Quiz> => {
  const response = await fetch(`${API_URL}/quizzes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quiz),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error creating quiz: ${JSON.stringify(errorData)}`);
  }
  
  return await response.json();
};

export const approveQuiz = async (quizId: string, emailData: EmailRecipients): Promise<Quiz> => {
  const response = await fetch(`${API_URL}/quizzes/${quizId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error approving quiz: ${JSON.stringify(errorData)}`);
  }
  
  return await response.json();
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Error deleting quiz: ${response.statusText}`);
  }
};
