

import React from 'react';

export default function Navbar() {
    return (
    <div className="h-14 bg-blue-900 flex items-center justify-between px-6">
      <span className="text-white font-bold text-base">
        Production Scheduler
      </span>
      <div className="flex gap-2">
        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
          Planner view
        </span>
        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
          J. Smith
        </span>
      </div>
    </div>
  );
}