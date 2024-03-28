import React, { useState, useEffect } from "react";

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(600); 
  const [isRunning, setIsRunning] = useState(false);
  const [workSessionCount, setWorkSessionCount] = useState(0);
  const [breakSessionCount, setBreakSessionCount] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [showWorkHistory, setShowWorkHistory] = useState(false);
  const [showBreakHistory, setShowBreakHistory] = useState(false);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        if (timeLeft <= 0) {
          clearInterval(timer);
          setIsRunning(false);
          setTimerFinished(true);
          if (isWorkSession) {
            setWorkSessionCount((prevCount) => prevCount + 1);
            localStorage.setItem(
              "workSessionEndTime",
              new Date().toLocaleString()
            );
          } else {
            setBreakSessionCount((prevCount) => prevCount + 1);
            localStorage.setItem(
              "breakSessionEndTime",
              new Date().toLocaleString()
            );
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer); 
    };
  }, [isRunning, timeLeft, isWorkSession]);

  useEffect(() => {
    localStorage.removeItem("workSessionStartTime");
    localStorage.removeItem("workSessionEndTime");
    localStorage.removeItem("breakSessionStartTime");
    localStorage.removeItem("breakSessionEndTime");
  }, []);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setTimerFinished(false);
    if (isWorkSession) {
      localStorage.setItem("workSessionStartTime", new Date().toLocaleString());
    } else {
      localStorage.setItem("breakSessionStartTime", new Date().toLocaleString());
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? 600 : 300);
    setTimerFinished(false);
  };

  const handleWorkButtonClick = () => {
    setTimeLeft(600); // 10 minutes
    setIsWorkSession(true);
    if (timerFinished) {
      setTimerFinished(false);
    }
  };

  const handleBreakButtonClick = () => {
    setTimeLeft(300); // 5 minutes
    setIsWorkSession(false);
    if (timerFinished) {
      setTimerFinished(false);
    }
  };

  const openWorkHistory = () => {
    setShowWorkHistory(true);
  };

  const closeWorkHistory = () => {
    setShowWorkHistory(false);
  };

  const openBreakHistory = () => {
    setShowBreakHistory(true);
  };

  const closeBreakHistory = () => {
    setShowBreakHistory(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-[url(/c.gif)] bg-no-repeat bg-center bg-cover">
      <div className="rounded-lg bg-gray-800 p-10 bg-opacity-50 w-full max-w-md md:max-w-xl lg:max-w-2xl flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Pomodoro Timer</h1>
        <div className="mt-4 space-y-4 md:space-x-4 md:flex md:space-y-0">
          <button
            onClick={handleWorkButtonClick}
            className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Work
          </button>
          <button
            onClick={handleBreakButtonClick}
            className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Break
          </button>
        </div>
        {/* Circular Timer */}
        <svg className="mt-4" width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90" 
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeDasharray="565.48" 
            strokeDashoffset={565.48 - (565.48 * (300 - timeLeft)) / 300} 
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize="60"
          >
            {formatTime(timeLeft)}
          </text>
        </svg>
        <div className="mt-4 space-y-4 md:space-x-4 md:flex md:space-y-0">
          <button
            onClick={startTimer}
            disabled={isRunning || timerFinished}
            className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start
          </button>
          <button
            onClick={stopTimer}
            disabled={!isRunning || timerFinished}
            className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop
          </button>
          <button
            onClick={resetTimer}
            className="w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
        <p className="mt-4 text-white">
          {isWorkSession ? "Work" : "Break"} Session Completed: {isWorkSession ? workSessionCount : breakSessionCount}
        </p>
        {/* Progress Bar */}
        {isWorkSession && (
          <div className="w-64 h-4 bg-gray-200 mt-6 rounded-full overflow-hidden">
            <div
              className="h-full"
              style={{
                background: `linear-gradient(to right, #34D399 ${workSessionCount * 25}%, #4B5563 ${workSessionCount * 25}%)`
              }}
            ></div>
          </div>
        )}
        {/* View History buttons */}
        {isWorkSession && (
          <div className="mt-8">
            <button
              onClick={openWorkHistory}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Work Session History
            </button>
          </div>
        )}
        {!isWorkSession && (
          <div className="mt-8">
            <button
              onClick={openBreakHistory}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Break Session History
            </button>
          </div>
        )}
        {/* Work Session History Sub-window */}
        {showWorkHistory && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Work Session History</h2>
              {localStorage.getItem("workSessionStartTime") ? (
                <div className="text-sm">
                  <p>Start Time: {localStorage.getItem("workSessionStartTime")}</p>
                  <p>End Time: {localStorage.getItem("workSessionEndTime") || "No history available"}</p>
                </div>
              ) : (
                <p>No history available</p>
              )}
              <button onClick={closeWorkHistory} className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
            </div>
          </div>
        )}
        {/* Break Session History Sub-window */}
        {showBreakHistory && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Break Session History</h2>
              {localStorage.getItem("breakSessionStartTime") ? (
                <div className="text-sm">
                  <p>Start Time: {localStorage.getItem("breakSessionStartTime")}</p>
                  <p>End Time: {localStorage.getItem("breakSessionEndTime") || "No history available"}</p>
                </div>
              ) : (
                <p>No history available</p>
              )}
              <button onClick={closeBreakHistory} className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
