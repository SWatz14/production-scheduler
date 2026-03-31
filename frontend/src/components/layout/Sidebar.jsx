

import React from 'react';
import { NavLink } from 'react-router-dom'; 

const menuItems = [
  {path: '/', label:'Gantt Schedule', icon: 'fa-solid fa-chart-gantt'},
  {path:'/jobs', label:'Work Orders', icon: 'fa-solid fa-briefcase'},
  {path:'/machines', label:'Machines', icon: 'fa-solid fa-cogs'},
  {path:'/kpi', label:'KPIs', icon: 'fa-solid fa-chart-line'},
  {path:'/floor', label:'Factory Floor', icon: 'fa-solid fa-industry'},
  {path:'/operators', label:'Operators', icon: 'fa-solid fa-users'},
];

export default function Sidebar() {
  return (
    <div className="w-56 min-h-screen bg-gray-900 flex flex-col">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm transition-colors
            ${isActive
              ? 'bg-white/10 text-white border-l-4 border-blue-400'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`
          }
        >
          <span className="text-base">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}