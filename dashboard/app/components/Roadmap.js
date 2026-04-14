"use client";

export default function Roadmap({ roadmap, loading, job, darkMode = false }) {
  if (loading) {
    return (
      <div className={`rounded-2xl p-10 flex flex-col items-center gap-3 transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <div className="w-10 h-10 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin" />
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Generating your personalized roadmap...
        </p>
      </div>
    );
  }

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className={`rounded-2xl p-10 text-center transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
          No roadmap yet.
        </p>
        <p className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          Go to Job History and click 📈 Roadmap on any job.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header card - Missing Skills */}
      {job && (
        <div className={`rounded-2xl p-5 transition-all duration-300 ${
          darkMode ? "neumorph-dark" : "neumorph"
        }`}>
          <p className={`text-xs font-semibold uppercase mb-3 flex items-center gap-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <span>🎯</span> Roadmap for missing skills
          </p>
          <div className="flex flex-wrap gap-2">
            {job.missing?.map(skill => (
              <span
                key={skill}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-200 ${
                  darkMode
                    ? "bg-red-900/30 text-red-400 border-red-800"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timeline - Main Roadmap */}
      <div className={`rounded-2xl p-6 transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <div className="flex items-center justify-between mb-6">
          <p className={`text-xs font-semibold uppercase flex items-center gap-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <span>📅</span> Week by week plan
          </p>
          <div className={`text-xs px-2 py-1 rounded-full ${
            darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
          }`}>
            {roadmap.length} weeks
          </div>
        </div>

        <div className="flex flex-col gap-0">
          {roadmap.map((item, index) => (
            <div key={index} className="flex gap-5 group">
              {/* Timeline indicator with neumorphism */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                  darkMode
                    ? "bg-[#0a66c2] text-white neumorph-dark-sm"
                    : "bg-[#0a66c2] text-white neumorph-sm"
                }`}>
                  {item.week}
                </div>
                {index !== roadmap.length - 1 && (
                  <div className={`w-0.5 flex-1 my-1 transition-all duration-300 ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${index === roadmap.length - 1 ? "pb-0" : "pb-8"}`}>
                <div className={`p-4 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}>
                  <p className={`text-sm font-semibold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {item.skill} — {item.topic}
                  </p>
                  
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-sm">🎯</span>
                    <p className={`text-xs flex-1 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {item.task}
                    </p>
                  </div>
                  
                  {item.resourceUrl ? (
                    <a
                      href={item.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-xs font-medium transition-all duration-200 px-3 py-1.5 rounded-full ${
                        darkMode
                          ? "bg-blue-900/30 text-[#0a66c2] hover:bg-blue-900/50"
                          : "bg-blue-50 text-[#0a66c2] hover:bg-blue-100"
                      }`}
                    >
                      📚 {item.resource}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${
                      darkMode ? "text-gray-500 bg-gray-800" : "text-gray-400 bg-gray-100"
                    }`}>
                      📚 {item.resource}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Card */}
      <div className={`rounded-2xl p-5 text-center transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🚀</span>
          <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Your {roadmap.length}-Week Journey Starts Now
          </p>
        </div>
        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Complete each week's task and track your progress. Every skill you learn brings you closer to your dream job!
        </p>
      </div>

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