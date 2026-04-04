

import React from 'react';
import { jobService, machineService, schedulerService } from '../services/api';


const machineMap = {
    1: 'Machine A',
    2: 'Machine B',
    3: 'Machine C'
};




const OperatorQueue = () => {
    const [jobs, setJobs] = React.useState([]);
    const [machines, setMachines] = React.useState([]);
    React.useEffect(() => {
        jobService.getByStatus('QUEUED').then(res => setJobs(res.data));
        machineService.getAll().then(res => setMachines(res.data));
    }, []);

    return (
        <div className="p-4 text-gray-700">
            <h2 className="text-2xl font-bold mb-4">Operator Queue</h2>
            <table className="min-w-full bg-white">     
                <thead> 
                    <tr>
                        <th className="py-2">Job ID</th>
                        <th className="py-2">Machine</th>       
                        <th className="py-2">Status</th>
                    </tr>
                </thead>            
                <tbody>
                    {jobs.map(job => (
                        <tr key={job.id}>
                            <td className="py-2">{job.id}</td>
                            <td className="py-2">{machines.find(m => m.id === job.machineId)?.name || 'N/A'}</td>
                            <td className="py-2">{job.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}   

export default OperatorQueue;


