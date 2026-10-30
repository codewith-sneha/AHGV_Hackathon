import { useState } from "react";
import { X, CheckCircle2, XCircle, Lightbulb, ArrowRight } from "lucide-react";

const QuizModal = ({ quiz, onClose }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) return null;

  const { question, options, correct, explanation } = quiz;
  const isCorrect = selected === correct;

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-modal-backdrop-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-content-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">
              Quick Check
            </p>
            <h2 className="text-white text-lg font-bold">
              Let's see what you learned!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Question */}
        <div className="p-6">
          <p className="text-sm font-semibold text-gray-900 mb-4 leading-relaxed">
            {question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isRight = idx === correct;
              const showRight = submitted && isRight;
              const showWrong = submitted && isSelected && !isRight;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all
                    ${
                      showRight
                        ? "border-green-500 bg-green-50 text-green-800"
                        : showWrong
                          ? "border-red-400 bg-red-50 text-red-800"
                          : isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-800"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700"
                    }
                    ${submitted ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${
                      showRight
                        ? "bg-green-500 text-white"
                        : showWrong
                          ? "bg-red-500 text-white"
                          : isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600"
                    }
                  `}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showRight && (
                    <CheckCircle2
                      size={18}
                      className="text-green-600 shrink-0"
                    />
                  )}
                  {showWrong && (
                    <XCircle size={18} className="text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {submitted && (
            <div
              className={`mt-4 p-4 rounded-xl text-sm animate-message-in
              ${isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}
            `}
            >
              <p
                className={`font-semibold mb-1 flex items-center gap-1.5
                ${isCorrect ? "text-green-800" : "text-amber-800"}
              `}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 size={16} /> Correct!
                  </>
                ) : (
                  <>
                    <Lightbulb size={16} /> Not quite — the answer is{" "}
                    {String.fromCharCode(65 + correct)}
                  </>
                )}
              </p>
              <p className={isCorrect ? "text-green-700" : "text-amber-700"}>
                {explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            disabled={!submitted}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue Watching
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
