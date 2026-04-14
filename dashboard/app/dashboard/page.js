"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobHistoryList from "@/app/components/JobHistoryList";
import SkillGapChart from "@/app/components/SkillGapChart";
import Roadmap from "@/app/components/Roadmap";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (session) fetchHistory();
  }, [session]);

  async function fetchHistory() {
    try {
      const res = await fetch("http://localhost:5000/history");
      if (!res.ok) return;
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }

  async function handlePin(id, pinned) {
    try {
      await fetch("http://localhost:5000/history", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pinned: !pinned })
      });
      fetchHistory();
    } catch (err) {
      console.error("Pin error:", err);
    }
  }

  async function handleRoadmap(job) {
    setSelectedJob(job);
    setActiveTab("roadmap");
    setLoadingRoadmap(true);
    setRoadmap([]);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missingSkills: job.missing })
      });
      const data = await res.json();
      setRoadmap(data.roadmap || []);
    } catch (err) {
      console.error("Roadmap error:", err);
    } finally {
      setLoadingRoadmap(false);
    }
  }

  if (status === "loading") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-[#1a1a1a]" : "bg-[#f3f2ef]"
      }`}>
        <div className="w-8 h-8 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "history", label: "Job History", icon: "💼" },
    { id: "skills", label: "Skill Gap", icon: "📊" },
    { id: "roadmap", label: "Roadmap", icon: "📈" }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode ? "bg-[#1a1a1a]" : "bg-[#f3f2ef]"
    }`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          darkMode 
            ? "bg-[#2d2d2d] neumorph-dark text-yellow-400" 
            : "bg-[#f0f0f3] neumorph text-gray-700"
        }`}
      >
        {darkMode ? "🌙" : "☀️"}
      </button>

      {/* Navbar */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        darkMode 
          ? "bg-[#2d2d2d] border-gray-700" 
          : "bg-white border-gray-200"
      } border-b`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0a66c2] rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className={`font-semibold text-base ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Job Assistant
            </span>
          </div>
          <div className="flex items-center gap-3">
            {session?.user?.image && (
              <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
            )}
            <div className="hidden sm:block">
              <p className={`text-sm font-semibold leading-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {session?.user?.name || "User"}
              </p>
              <p className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={`text-sm transition-all duration-200 rounded-full px-3 py-1 ${
                darkMode
                  ? "text-gray-300 hover:text-white border-gray-600 hover:border-gray-400"
                  : "text-gray-500 hover:text-gray-800 border-gray-300 hover:border-gray-500"
              } border`}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        {/* Left Sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
            darkMode ? "neumorph-dark" : "neumorph"
          }`}>
            <div className="bg-[#0a66c2] h-14" />
            <div className={`px-4 pb-4 ${
              darkMode ? "bg-[#2d2d2d]" : "bg-[#f0f0f3]"
            }`}>
              <div className="flex justify-start -mt-6 mb-2">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-[#0a66c2] flex items-center justify-center text-white font-bold">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                )}
              </div>
              <p className={`font-semibold text-sm ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {session?.user?.name || "User"}
              </p>
              <p className={`text-xs mt-0.5 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Final Year CSE Student
              </p>
            </div>
            <div className={`border-t ${
              darkMode ? "border-gray-700" : "border-gray-100"
            }`}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-all duration-200 ${
                    activeTab === tab.id
                      ? `${
                          darkMode
                            ? "bg-[#1a1a1a] text-[#0a66c2] border-r-2 border-[#0a66c2]"
                            : "bg-blue-50 text-[#0a66c2] border-r-2 border-[#0a66c2]"
                        } font-semibold`
                      : `${
                          darkMode
                            ? "text-gray-300 hover:bg-[#1a1a1a]"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className={`mt-4 p-4 rounded-2xl transition-all duration-300 ${
            darkMode ? "neumorph-dark" : "neumorph"
          }`}>
            <p className={`text-xs font-semibold uppercase mb-3 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Stats
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Jobs analysed
                </span>
                <span className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {history.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Pinned
                </span>
                <span className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {history.filter(j => j.pinned).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Avg match
                </span>
                <span className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {history.length
                    ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex md:hidden gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 text-xs py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#0a66c2] text-white"
                    : `${
                        darkMode
                          ? "bg-[#2d2d2d] text-gray-300 border-gray-700"
                          : "bg-white text-gray-500 border-gray-200"
                      } border`
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className={`rounded-2xl p-4 mb-4 flex items-center justify-between transition-all duration-300 ${
            darkMode ? "neumorph-dark" : "neumorph"
          }`}>
            <h2 className={`font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              {tabs.find(t => t.id === activeTab)?.icon}{" "}
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            {activeTab === "history" && (
              <button
                onClick={fetchHistory}
                className="text-xs text-[#0a66c2] hover:underline"
              >
                Refresh
              </button>
            )}
          </div>

          {activeTab === "history" && (
            <JobHistoryList 
              history={history} 
              onPin={handlePin} 
              onRoadmap={handleRoadmap}
              darkMode={darkMode}
            />
          )}
          {activeTab === "skills" && (
            <SkillGapChart 
              history={history}
              darkMode={darkMode}
            />
          )}
          {activeTab === "roadmap" && (
            <Roadmap 
              roadmap={roadmap} 
              loading={loadingRoadmap} 
              job={selectedJob}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>

      {/* Custom CSS for Neumorphism */}
      <style jsx global>{`
        /* Neumorphism Light Mode */
        .neumorph {
          box-shadow: 9px 9px 16px #d1d1d4, -9px -9px 16px #ffffff;
          background: #f0f0f3;
        }
        
        /* Neumorphism Dark Mode */
        .neumorph-dark {
          box-shadow: 9px 9px 16px #1a1a1a, -9px -9px 16px #404040;
          background: #2d2d2d;
        }

        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}