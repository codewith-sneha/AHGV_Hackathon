import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, BookOpen, Award, Clock } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  // Dummy Data
  const user = {
    name: "Siya Sharma",
    email: "siya09@example.com",
    joined: "Jan 2024",
    courses: 4,
    interviews: [
      { id: 1, date: "Oct 24, 2023", topic: "Photosynthesis", score: "8/10" },
      { id: 2, date: "Oct 20, 2023", topic: "Light Reactions", score: "7/10" },
      { id: 3, date: "Oct 15, 2023", topic: "Calvin Cycle", score: "9/10" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex items-center gap-4 mb-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3E3AF7] to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
            {user.name[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
              <Mail size={12} /> {user.email}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Joined {user.joined}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <BookOpen size={20} className="text-[#3E3AF7] mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.courses}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Courses Enrolled
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <Award size={20} className="text-green-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.interviews.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mock Interviews
            </p>
          </div>
        </div>

        {/* Interview History */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent AI Interviews
          </h2>
          <div className="space-y-3">
            {user.interviews.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Clock
                      size={14}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.topic}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.date}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
