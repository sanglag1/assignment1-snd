// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const newQuiz = new Quiz({
      title,
      description,
      questions: [] // Khởi tạo mảng câu hỏi rỗng
    });

    // Lưu quiz mới vào database
    await newQuiz.save();

    // Thêm từng câu hỏi vào quiz
    for (const questionData of questions) {
      const newQuestion = new Question(questionData);
      await newQuestion.save(); // Lưu câu hỏi vào cơ sở dữ liệu
      newQuiz.questions.push(newQuestion._id); // Thêm ID của câu hỏi vào quiz
    }

    // Lưu lại quiz đã được cập nhật với các câu hỏi
    await newQuiz.save();

    // Trả về quiz sau khi thêm câu hỏi
    const populatedQuiz = await Quiz.findById(newQuiz._id).populate('questions');
    res.status(201).json(populatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    quiz.title = req.body.title || quiz.title;
    await quiz.save();
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a quiz by ID
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a question to a quiz
exports.addQuestionToQuiz = async (req, res) => {
  try {
    const { text, options, correctAnswerIndex } = req.body;
    const newQuestion = new Question({ text, options, correctAnswerIndex });
    await newQuestion.save();

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    quiz.questions.push(newQuestion._id);
    await quiz.save();

    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const { Quiz, Question } = require('../models/Quiz');

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params; // ID của câu hỏi từ URL
    const { text, options, correctAnswerIndex } = req.body; // Dữ liệu mới từ body

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.text = text || question.text;
    question.options = options || question.options;
    question.correctAnswerIndex = correctAnswerIndex !== undefined ? correctAnswerIndex : question.correctAnswerIndex;

    await question.save(); // Lưu câu hỏi đã cập nhật

    res.status(200).json(question); // Trả về câu hỏi đã được cập nhật
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};