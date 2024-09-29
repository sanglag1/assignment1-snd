const { Quiz, Question } = require('../models/Quiz');

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

    // Log dữ liệu nhận được từ frontend
    console.log("Dữ liệu nhận được từ client:", req.body);

    const newQuiz = new Quiz({
      title,
      description,
      questions: [] // Khởi tạo mảng câu hỏi
    });

    // Lưu quiz mới vào cơ sở dữ liệu
    await newQuiz.save();

    // Thêm từng câu hỏi vào quiz
    for (const questionData of questions) {
      const newQuestion = new Question(questionData);
      await newQuestion.save(); // Lưu câu hỏi vào cơ sở dữ liệu
      newQuiz.questions.push(newQuestion._id); // Thêm ID của câu hỏi vào quiz
    }

    // Lưu lại quiz đã được cập nhật với các câu hỏi
    await newQuiz.save();

    // Populate câu hỏi để trả về dữ liệu đầy đủ
    const populatedQuiz = await Quiz.findById(newQuiz._id).populate('questions');
    res.status(201).json(populatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add a question to a quiz
exports.addQuestionToQuiz = async (req, res) => {
  try {
    const { text, options, correctAnswerIndex } = req.body;
    const newQuestion = new Question({ text, options, correctAnswerIndex });
    await newQuestion.save();

    const quiz = await Quiz.findById(req.params.quizId);
    quiz.questions.push(newQuestion._id);
    await quiz.save();

    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
