import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Plus, Zap } from 'lucide-react';

export default function FocusTodo() {
  const [tasks, setTasks] = useState([{ id: 1, text: "Finish the project proposal", completed: false }]);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(false);

  // Simple Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Modern Header */}
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="text-indigo-400" /> FocusFlow
          </h1>
          <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
            Current Session: <span className="text-indigo-400">Work</span>
          </div>
        </header>

        {/* Pomodoro Timer Card (Glassmorphism Style) */}
        <section className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 text-center shadow-2xl">
          <div className="text-8xl font-black tracking-tighter mb-8 tabular-nums">
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setIsActive(!isActive)}
              className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2 font-semibold"
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />} {isActive ? 'Pause' : 'Start Focus'}
            </button>
            <button 
              onClick={() => {setIsActive(false); setTimeLeft(1500);}}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </section>

        {/* Task List */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-medium text-slate-400">Your Focus for Today</h2>
            <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold">3 Tasks Left</span>
          </div>
          
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-indigo-500/50 rounded-2xl transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <Circle className="text-slate-600 group-hover:text-indigo-400 transition-colors" size={20} />
                  <span className="text-lg">{task.text}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-xs text-slate-500 hover:text-white underline">Edit</button>
                </div>
              </div>
            ))}
            
            {/* Quick Add Task */}
            <div className="flex items-center gap-4 p-4 border border-dashed border-white/10 rounded-2xl text-slate-500 hover:border-white/30 transition-all cursor-text">
              <Plus size={20} />
              <span>Add a new task...</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
