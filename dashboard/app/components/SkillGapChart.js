"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function SkillGapChart({ history, darkMode = false }) {
  if (!history || history.length === 0) {
    return (
      <div className={`rounded-2xl p-10 text-center transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
          No data yet.
        </p>
        <p className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          Click some jobs on LinkedIn first.
        </p>
      </div>
    );
  }

  const skillCount = {};
  history.forEach(job => {
    job.missing?.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  const chartData = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  if (chartData.length === 0) {
    return (
      <div className={`rounded-2xl p-10 text-center transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          No skill gaps found. You are matching well! 🎉
        </p>
      </div>
    );
  }

  // Chart colors based on theme
  const chartColors = {
    primary: darkMode ? "#0a66c2" : "#0a66c2",
    secondary: darkMode ? "#378fe9" : "#378fe9",
    tertiary: darkMode ? "#1e3a5f" : "#a0c4f1",
    background: darkMode ? "#2d2d2d" : "#ffffff",
    text: darkMode ? "#e5e7eb" : "#374151",
    grid: darkMode ? "#404040" : "#e5e7eb"
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Chart card */}
      <div className={`rounded-2xl p-6 transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <h2 className={`text-base font-semibold mb-1 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}>
          Top Missing Skills
        </h2>
        <p className={`text-sm mb-6 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}>
          Skills you are missing most across your searched jobs
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical">
            <XAxis
              type="number"
              stroke={chartColors.grid}
              tick={{ fill: darkMode ? "#9ca3af" : "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="skill"
              stroke={chartColors.grid}
              tick={{ fill: chartColors.text, fontSize: 12, fontWeight: 500 }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: darkMode ? "#2d2d2d" : "#fff",
                border: `1px solid ${darkMode ? "#404040" : "#e5e7eb"}`,
                borderRadius: "12px",
                fontSize: "12px",
                color: darkMode ? "#fff" : "#000"
              }}
              labelStyle={{ color: darkMode ? "#fff" : "#111827", fontWeight: 600 }}
              itemStyle={{ color: "#0a66c2" }}
              cursor={{ fill: darkMode ? "rgba(10,102,194,0.1)" : "rgba(10,102,194,0.05)" }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={28}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    index === 0 
                      ? chartColors.primary 
                      : index === 1 
                        ? chartColors.secondary 
                        : chartColors.tertiary
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary card */}
      <div className={`rounded-2xl p-5 transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Based on your last{" "}
          <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {history.length}
          </span>{" "}
          job searches, your most needed skill is{" "}
          <span className="font-semibold text-[#0a66c2]">{chartData[0]?.skill}</span>.
          Focus on this first to maximize your job matches.
        </p>
      </div>

      {/* Skill badges */}
      <div className={`rounded-2xl p-5 transition-all duration-300 ${
        darkMode ? "neumorph-dark" : "neumorph"
      }`}>
        <p className={`text-xs font-semibold uppercase mb-4 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}>
          All Missing Skills
        </p>
        <div className="flex flex-wrap gap-2.5">
          {chartData.map((item, index) => (
            <span
              key={item.skill}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${
                index === 0
                  ? darkMode
                    ? "bg-blue-900/30 text-[#0a66c2] border-blue-800"
                    : "bg-blue-50 text-[#0a66c2] border-blue-200"
                  : darkMode
                    ? "bg-gray-800 text-gray-300 border-gray-700"
                    : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {item.skill} <span className="opacity-75">({item.count})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Optional: Progress suggestion */}
      {chartData[0] && (
        <div className={`rounded-2xl p-5 transition-all duration-300 ${
          darkMode ? "neumorph-dark" : "neumorph"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-semibold uppercase ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Recommended Focus
            </p>
            <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Priority #1
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              darkMode ? "neumorph-dark-sm" : "neumorph-sm"
            }`}>
              <span className="text-xl">🎯</span>
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {chartData[0].skill}
              </p>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-[#0a66c2] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (chartData[0].count / history.length) * 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Missing in {chartData[0].count} out of {history.length} jobs ({Math.round((chartData[0].count / history.length) * 100)}%)
              </p>
            </div>
          </div>
        </div>
      )}

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