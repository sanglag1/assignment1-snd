const express = require('express');
const router = express.Router();
const { getQuizzes, getQuizById, createQuiz, addQuestionToQuiz, deleteQuiz, updateQuiz } = require('../controllers/quizController');

// Route for getting all quizzes
router.get('/quizzes', getQuizzes);

// Route for getting a quiz by its ID
router.get('/quizzes/:quizId', getQuizById);

// Route for creating a new quiz
router.post('/quizzes', createQuiz);

// Route for adding a question to a quiz
router.post('/quizzes/:quizId/question', addQuestionToQuiz);

// Route for deleting a quiz
router.delete('/quizzes/:quizId', deleteQuiz);

// Route for update a quiz
router.put('/quizzes/:quizId', updateQuiz);

module.exports = router;
