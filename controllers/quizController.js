const { Quiz, Question } = require('../models/Quiz');

exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;

    if (questions && questions.length > 0) {
      quiz.questions = [];
      for (const questionData of questions) {
        const updatedQuestion = new Question(questionData);
        await updatedQuestion.save();
        quiz.questions.push(updatedQuestion._id); 
      }
    }

    await quiz.save();
    const populatedQuiz = await Quiz.findById(quiz._id).populate('questions');
    res.status(200).json(populatedQuiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

