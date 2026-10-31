import { useState } from "react";
import { X, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const QuizModal = ({ quiz, onClose }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) return null;

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);
  };

  const isCorrect = selected === quiz.correct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3E3AF7] to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-xs font-medium uppercase tracking-wide">
              End of Video Quiz
            </p>
            <h2 className="text-white text-lg font-bold">Quick Check</h2>
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
          <p className="text-sm font-semibold text-gray-100 mb-4 leading-relaxed">
            {quiz.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {quiz.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrectOpt = idx === quiz.correct;
              const showCorrect = submitted && isCorrectOpt;
              const showWrong = submitted && isSelected && !isCorrectOpt;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : showWrong
                        ? "border-red-400 bg-red-500/10 text-red-400"
                        : isSelected
                          ? "border-[#3E3AF7] bg-[#3E3AF7]/10 text-[#3E3AF7]"
                          : "border-gray-700 hover:border-[#3E3AF7]/50 hover:bg-[#3E3AF7]/5 text-gray-300"
                  } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      showCorrect
                        ? "bg-green-500 text-white"
                        : showWrong
                          ? "bg-red-500 text-white"
                          : isSelected
                            ? "bg-[#3E3AF7] text-white"
                            : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showCorrect && (
                    <CheckCircle2
                      size={18}
                      className="text-green-500 shrink-0"
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
              className={`mt-4 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                isCorrect
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-amber-500/10 border border-amber-500/30"
              }`}
            >
              <p
                className={`font-semibold mb-1 flex items-center gap-1.5 ${isCorrect ? "text-green-400" : "text-amber-400"}`}
              >
                {isCorrect ? "Correct!" : "Not quite."}
              </p>
              <p
                className={`${isCorrect ? "text-green-300/80" : "text-amber-300/80"}`}
              >
                {quiz.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-950/50 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            disabled={!submitted}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3E3AF7] hover:bg-[#3230d6] text-white text-sm font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue Watching <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
