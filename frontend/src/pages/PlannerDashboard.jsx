

import React, { use, useEffect, useState } from 'react';
import { jobService, machineService } from '../services/api';

export default function PlannerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([ jobService.getAll(), machineService.getAll()])
            .then(([jobsRes, machinesRes]) => {
                setJobs(jobsRes.data);
                setMachines(machinesRes.data);
               
            })
            .finally(() => setLoading(false));
    }, []);

    const statusColors = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }    };

    if (loading) 
        return(<div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading...</p>
        </div>
        );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Planner Dashboard</h1>
                <div className="flex gap-2">
                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
                        <option> Earliest Due Date (EDD)</option>
                        <option> Shortest Processing Time (SPT)</option>
                        <option> First Come First Serve (FCFS)</option>
                    </select>
                    <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg">
                        Run Schedule </button>
                    <button className="bg-gray-600 text-white text-sm px-4 py-2 rounded-lg">
                        Export Schedule </button>
                </div>


            </div>
            <div className="grid grid-cols-4 gap-4">
                {[
                    {label: 'Total Jobs', value: jobs.length, color: 'bg-blue-100 text-blue-800'},
                    {label: 'In Progress', value: jobs.filter(j => j.status === 'In Progress').length, color: 'bg-yellow-100 text-yellow-800'},
                    {label: 'Delayed', value: jobs.filter(j => j.status === 'Delayed').length, color: 'bg-red-100 text-red-800'},
                    {label:'machines active', value: machines.filter(m => m.status === 'Active').length, color: 'bg-green-100 text-green-800'},
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                        <p className="text-2xl font-semibold text-gray-800 ">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-mdium text-gray-500">Upcoming Jobs</p>

                </div>
                <table className="w-full text-sm">
                    <thread>
                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <th className="px-4 py-2 text-left">Job ID</th>
                            <th className="px-4 py-2 text-left">Machine</th>
                            <th className="px-4 py-2 text-left">Due Date</th>
                            <th className="px-4 py-2 text-left">Hours</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thread>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id} className="border-t border-gray-100">
                                <td className="px-4 py-3 font-medium text-gray-800">{job.name}</td>
                                <td className="px-4 py-3 text-gray-600">{job.machine?.name || "Not Assigned"}
                                </td>
                                <td className="px-4 py-3 text-gray-600">{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No date'}</td>
                                <td className="px-4 py-3">
                                    <span className={'px-2 py-1 text-xs rounded-full ' + statusColors(job.status)}>
                                        {job.status}
                                    </span> 
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

    