import { useState, useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/tokyo-night-dark.css';

export default function QuizSection({ quiz }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    hljs.highlightAll();
  }, [currentIndex, quizFinished]);

  if (!quiz || quiz.length === 0) return null;

  const currentQuestion = quiz[currentIndex];

  const handleOptionSelect = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="quiz-container finished">
        <div className="quiz-header">
          <span className="quiz-badge">Quiz Concluído</span>
          <h3 className="quiz-question">Resultado Final</h3>
        </div>
        <div className="quiz-result">
          <div className="result-score">{Math.round((score / quiz.length) * 100)}%</div>
          <p className="result-text">Você acertou {score} de {quiz.length} questões.</p>
        </div>
        <button className="quiz-next-btn" onClick={handleReset}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <span className="quiz-badge">Desafio de Revisão ({currentIndex + 1}/{quiz.length})</span>
        <h3 className="quiz-question">{currentQuestion.question}</h3>
        
        {currentQuestion.code && (
          <div className="quiz-code-block">
            <pre>
              <code className={`language-${currentQuestion.code_language || 'text'}`}>
                {currentQuestion.code}
              </code>
            </pre>
          </div>
        )}
      </div>

      <div className="quiz-options">
        {currentQuestion.options.map((option, index) => {
          let optionClass = "quiz-option";
          if (showFeedback) {
            if (index === currentQuestion.answer) optionClass += " correct";
            else if (index === selectedOption) optionClass += " wrong";
            else optionClass += " disabled";
          } else if (selectedOption === index) {
            optionClass += " selected";
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => handleOptionSelect(index)}
              disabled={showFeedback}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {showFeedback && index === currentQuestion.answer && (
                <svg className="option-status-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="quiz-feedback-area">
          <div className={`feedback-banner ${selectedOption === currentQuestion.answer ? 'success' : 'error'}`}>
            {selectedOption === currentQuestion.answer ? '🎉 Resposta Correta!' : '❌ Ops, não foi dessa vez.'}
          </div>
          {currentQuestion.explanation && (
            <p className="quiz-explanation">
              <strong>Explicação:</strong> {currentQuestion.explanation}
            </p>
          )}
          <button className="quiz-next-btn" onClick={handleNext}>
            {currentIndex < quiz.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
