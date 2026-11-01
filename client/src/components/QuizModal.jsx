import { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  PlayCircle,
  FileText,
} from "lucide-react";
import { quizGenerate, quizFeedback } from "../services/api";

const QuizModal = ({
  videoId,
  allowedResources,
  getPauseTime,
  onClose,
  onReview,
}) => {
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [token, setToken] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const startedRef = useRef(false);

  const load = async () => {
    setPhase("loading");
    setError("");
    try {
      const data = await quizGenerate({
        videoId,
        pauseTime: getPauseTime(),
        allowedResources,
        numQuestions: 5,
      });
      const qs = Array.isArray(data?.questions) ? data.questions : [];
      if (!data?.quiz_token || qs.length === 0) {
        throw new Error("The quiz came back empty. Please try again.");
      }
      setToken(data.quiz_token);
      setQuestions(qs);
      setAnswers(qs.map(() => null));
      setCurrent(0);
      setPhase("quiz");
    } catch (err) {
      setError(err?.message || "Could not create the quiz.");
      setPhase("error");
    }
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    load();
  }, []);

  const selectOption = (idx) => {
    setAnswers((prev) => prev.map((a, i) => (i === current ? idx : a)));
  };

  const submit = async () => {
    setSubmitError("");
    setPhase("submitting");
    try {
      const data = await quizFeedback({ quizToken: token, answers });
      setResult(data);
      setPhase("result");
    } catch (err) {
      setSubmitError(err?.message || "Could not check your answers.");
      setPhase("quiz");
    }
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const q = questions[current];
  const isLast = current === questions.length - 1;

  const headerTitle = phase === "result" ? "Your Results" : "Quick Check";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-800">
        <div className="bg-gradient-to-r from-[#3E3AF7] to-indigo-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <p className="text-indigo-100 text-xs font-medium uppercase tracking-wide">
              End of Video Quiz
            </p>
            <h2 className="text-white text-lg font-bold">{headerTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {(phase === "loading" || phase === "submitting") && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-300">
              <Loader2 size={28} className="animate-spin text-[#3E3AF7]" />
              <p className="text-sm">
                {phase === "loading"
                  ? "Preparing your quiz from the lecture..."
                  : "Checking your answers..."}
              </p>
            </div>
          )}

          {phase === "error" && (
            <div className="py-8 text-center">
              <p className="text-sm text-red-400 mb-4">{error}</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={load}
                  className="px-4 py-2 bg-[#3E3AF7] hover:bg-[#3230d6] text-white text-sm font-semibold rounded-xl transition"
                >
                  Try again
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-700 text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {phase === "quiz" && q && (
            <>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span>
                  Question {current + 1} of {questions.length}
                </span>
                <span>
                  {answeredCount} of {questions.length} answered
                </span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-[#3E3AF7] rounded-full transition-all duration-300"
                  style={{
                    width: `${((current + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              {q.topic && (
                <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#3E3AF7]/10 text-[#8b89ff] mb-3">
                  {q.topic}
                </span>
              )}
              <p className="text-sm font-semibold text-gray-100 mb-4 leading-relaxed">
                {q.question}
              </p>

              <div className="space-y-2.5">
                {q.options.map((opt, idx) => {
                  const isSelected = answers[current] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectOption(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#3E3AF7] bg-[#3E3AF7]/10 text-[#8b89ff]"
                          : "border-gray-700 hover:border-[#3E3AF7]/50 hover:bg-[#3E3AF7]/5 text-gray-300"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? "bg-[#3E3AF7] text-white"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {submitError && (
                <p className="mt-4 text-xs text-red-400">{submitError}</p>
              )}
            </>
          )}

          {phase === "result" && result && (
            <>
              <div className="flex flex-col items-center mb-5">
                <div
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${
                    result.percent >= 80
                      ? "border-green-500 bg-green-500/10"
                      : result.percent >= 50
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-red-400 bg-red-500/10"
                  }`}
                >
                  <span className="text-2xl font-bold text-white">
                    {result.score}/{result.total}
                  </span>
                  <span className="text-xs text-gray-400">
                    {result.percent}%
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-100">
                  {result.level}
                </p>
                <p className="mt-2 text-sm text-gray-300 text-center leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {Array.isArray(result.focus_areas) &&
                result.focus_areas.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2">
                      Topics to revisit
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.focus_areas.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="space-y-4">
                {(result.results || []).map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-gray-800 bg-gray-950/40 p-4"
                  >
                    <div className="flex items-start gap-2 mb-3">
                      {r.correct ? (
                        <CheckCircle2
                          size={16}
                          className="text-green-500 shrink-0 mt-0.5"
                        />
                      ) : (
                        <XCircle
                          size={16}
                          className="text-red-500 shrink-0 mt-0.5"
                        />
                      )}
                      <p className="text-sm font-semibold text-gray-100 leading-relaxed">
                        {r.question}
                      </p>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {r.options.map((opt, idx) => {
                        const isChosen = r.chosen === idx;
                        const isRight = r.correct_index === idx;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                              isRight
                                ? "border-green-500 bg-green-500/10 text-green-400"
                                : isChosen
                                  ? "border-red-400 bg-red-500/10 text-red-400"
                                  : "border-gray-800 text-gray-400"
                            }`}
                          >
                            <span className="font-bold shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isRight && (
                              <span className="shrink-0">Correct</span>
                            )}
                            {isChosen && !isRight && (
                              <span className="shrink-0">Your answer</span>
                            )}
                          </div>
                        );
                      })}
                      {r.chosen === null && (
                        <p className="text-xs text-gray-500">Skipped</p>
                      )}
                    </div>

                    {r.explanation && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">
                        {r.explanation}
                      </p>
                    )}

                    {Array.isArray(r.review) && r.review.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {r.review.map((c, i) => {
                          const isVideo =
                            c.kind === "video" || c.kind === "audio";
                          return (
                            <button
                              key={i}
                              onClick={() => onReview(c)}
                              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-[#3E3AF7]/40 text-[#8b89ff] hover:bg-[#3E3AF7]/10 transition"
                            >
                              {isVideo ? (
                                <PlayCircle size={12} />
                              ) : (
                                <FileText size={12} />
                              )}
                              Review: {c.label || c.source}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {phase === "quiz" && q && (
          <div className="px-6 py-4 bg-gray-950/50 border-t border-gray-800 flex items-center justify-between shrink-0">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-700 text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {isLast ? (
              <button
                onClick={submit}
                disabled={answeredCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#3E3AF7] hover:bg-[#3230d6] text-white text-sm font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit <CheckCircle2 size={16} />
              </button>
            ) : (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#3E3AF7] hover:bg-[#3230d6] text-white text-sm font-semibold rounded-xl transition"
              >
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {phase === "result" && (
          <div className="px-6 py-4 bg-gray-950/50 border-t border-gray-800 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3E3AF7] hover:bg-[#3230d6] text-white text-sm font-semibold rounded-xl transition"
            >
              Continue Watching <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
