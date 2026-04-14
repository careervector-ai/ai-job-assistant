"use client";

const recommendationColor = (darkMode) => ({
  "APPLY 🚀": darkMode 
    ? "text-green-400 bg-green-900/30 border-green-800"
    : "text-green-600 bg-green-50 border-green-200",
  "MAYBE 🤔": darkMode
    ? "text-yellow-400 bg-yellow-900/30 border-yellow-800"
    : "text-yellow-600 bg-yellow-50 border-yellow-200",
  "SKIP ❌": darkMode
    ? "text-red-400 bg-red-900/30 border-red-800"
    : "text-red-500 bg-red-50 border-red-200"
});

const scoreColor = (score, darkMode) => {
  if (score >= 70) return darkMode ? "text-green-400" : "text-green-600";
  if (score >= 40) return darkMode ? "text-yellow-400" : "text-yellow-500";
  return darkMode ? "text-red-400" : "text-red-500";
};

export default function JobHistoryList({ history, onPin, onRoadmap, darkMode = false }) {
  if (!history || history.length === 0) {
    return (
      <div className={`rounded-2xl p-10 text-center transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
          No job history yet.
        </p>
        <p className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          Click any job on LinkedIn to start.
        </p>
      </div>
    );
  }

  const recColors = recommendationColor(darkMode);

  return (
    <div className="flex flex-col gap-4">
      {history.map((job) => (
        <div
          key={job._id}
          className={`rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] ${
            darkMode ? "neumorph-dark" : "neumorph"
          } ${job.pinned ? (darkMode ? "ring-2 ring-[#0a66c2]" : "ring-2 ring-[#0a66c2]") : ""}`}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Score circle with neumorphism */}
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
                darkMode ? "neumorph-dark-sm" : "neumorph-sm"
              }`}>
                <span className={`text-xl font-bold ${scoreColor(job.score, darkMode)}`}>
                  {job.score}%
                </span>
              </div>
              
              {/* Recommendation badge */}
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                recColors[job.recommendation] || (darkMode 
                  ? "text-gray-400 bg-gray-800 border-gray-700"
                  : "text-gray-500 bg-gray-50 border-gray-200")
              }`}>
                {job.recommendation}
              </span>
              
              {job.pinned && (
                <span className={`text-xs font-semibold flex items-center gap-1 ${
                  darkMode ? "text-[#0a66c2]" : "text-[#0a66c2]"
                }`}>
                  📌 Pinned
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onPin(job._id, job.pinned)}
                className={`text-xs px-4 py-1.5 rounded-full font-semibold transition-all duration-200 ${
                  job.pinned
                    ? darkMode
                      ? "bg-[#0a66c2] text-white hover:bg-[#004182] neumorph-dark-sm"
                      : "bg-[#0a66c2] text-white hover:bg-[#004182] neumorph-sm"
                    : darkMode
                      ? "text-gray-300 border-gray-600 hover:border-gray-400 neumorph-dark-sm"
                      : "text-gray-600 border-gray-300 hover:border-gray-400 neumorph-sm"
                } border`}
              >
                {job.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={() => onRoadmap(job)}
                className={`text-xs px-4 py-1.5 rounded-full font-semibold transition-all duration-200 ${
                  darkMode
                    ? "bg-[#0a66c2] text-white hover:bg-[#004182] neumorph-dark-sm"
                    : "bg-[#0a66c2] text-white hover:bg-[#004182] neumorph-sm"
                }`}
              >
                📈 Roadmap
              </button>
            </div>
          </div>

          {/* Skills section */}
          <div className="flex flex-col gap-3">
            {/* Matched Skills */}
            <div>
              <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                ✓ Matched Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.matched?.length > 0 ? job.matched.map(skill => (
                  <span
                    key={skill}
                    className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
                      darkMode
                        ? "bg-green-900/30 text-green-400 border border-green-800"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {skill}
                  </span>
                )) : (
                  <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    No matched skills
                  </span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                + Missing Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.missing?.length > 0 ? job.missing.map(skill => (
                  <span
                    key={skill}
                    className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
                      darkMode
                        ? "bg-red-900/30 text-red-400 border border-red-800"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {skill}
                  </span>
                )) : (
                  <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    No missing skills
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className={`text-xs pt-3 border-t transition-all duration-200 ${
            darkMode ? "text-gray-500 border-gray-700" : "text-gray-400 border-gray-100"
          }`}>
            {new Date(job.timestamp).toLocaleString()}
          </div>
        </div>
      ))}

      <style jsx global>{`
        .neumorph-sm {
          box-shadow: 5px 5px 10px #d1d1d4, -5px -5px 10px #ffffff;
          background: #f0f0f3;
        }
        .neumorph-dark-sm {
          box-shadow: 5px 5px 10px #1a1a1a, -5px -5px 10px #404040;
          background: #2d2d2d;
        }
      `}</style>
    </div>
  );
}