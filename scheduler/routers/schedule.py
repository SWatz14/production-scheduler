from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

router = APIRouter()

class JobInput(BaseModel):
    id: int
    name: str
    priority: int
    deadline: datetime
    estimated_hours: float
    machine_id: Optional[int] = None

class ScheduledJob(BaseModel):
    id: int
    name: str
    priority: int
    deadline: datetime
    estimated_hours: float
    machine_id: Optional[int]
    start_time: datetime
    end_time: datetime
    algorithm: str
    risk_status: str

class ScheduleRequest(BaseModel):
    jobs: List[JobInput]
    algorithm: str = "EDD"
    shift_start_hour: int = 7
    shift_end_hour: int = 15

class ScheduleResponse(BaseModel):
    algorithm: str
    total_jobs: int
    scheduled_jobs: List[ScheduledJob]
    at_risk_count: int
    overdue_count: int

def calculate_risk(end_time: datetime, deadline: datetime) -> str:
    if end_time > deadline:
        return "OVERDUE"
    diff = (deadline - end_time).total_seconds() / 3600
    if diff < 2:
        return "AT_RISK"
    return "ON_TRACK"

def schedule_edd(jobs, shift_start_hour, shift_end_hour):
    sorted_jobs = sorted(jobs, key=lambda j: j.deadline)
    current_time = datetime.now()
    scheduled = []
    for job in sorted_jobs:
        start = current_time
        end = start + timedelta(hours=job.estimated_hours)
        scheduled.append(ScheduledJob(
            id=job.id,
            name=job.name,
            priority=job.priority,
            deadline=job.deadline,
            estimated_hours=job.estimated_hours,
            machine_id=job.machine_id,
            start_time=start,
            end_time=end,
            algorithm="EDD",
            risk_status=calculate_risk(end, job.deadline)
        ))
        current_time = end
    return scheduled

def schedule_spt(jobs, shift_start_hour, shift_end_hour):
    sorted_jobs = sorted(jobs, key=lambda j: j.estimated_hours)
    current_time = datetime.now()
    scheduled = []
    for job in sorted_jobs:
        start = current_time
        end = start + timedelta(hours=job.estimated_hours)
        scheduled.append(ScheduledJob(
            id=job.id,
            name=job.name,
            priority=job.priority,
            deadline=job.deadline,
            estimated_hours=job.estimated_hours,
            machine_id=job.machine_id,
            start_time=start,
            end_time=end,
            algorithm="SPT",
            risk_status=calculate_risk(end, job.deadline)
        ))
        current_time = end
    return scheduled

@router.post("/schedule", response_model=ScheduleResponse)
def generate_schedule(request: ScheduleRequest):
    if not request.jobs:
        raise HTTPException(status_code=400, detail="No jobs provided")
    if request.algorithm.upper() == "EDD":
        scheduled = schedule_edd(request.jobs, request.shift_start_hour, request.shift_end_hour)
    elif request.algorithm.upper() == "SPT":
        scheduled = schedule_spt(request.jobs, request.shift_start_hour, request.shift_end_hour)
    else:
        raise HTTPException(status_code=400, detail="Algorithm must be EDD or SPT")
    at_risk = sum(1 for j in scheduled if j.risk_status == "AT_RISK")
    overdue = sum(1 for j in scheduled if j.risk_status == "OVERDUE")
    return ScheduleResponse(
        algorithm=request.algorithm.upper(),
        total_jobs=len(scheduled),
        scheduled_jobs=scheduled,
        at_risk_count=at_risk,
        overdue_count=overdue
    )

@router.get("/schedule/algorithms")
def get_algorithms():
    return {
        "algorithms": [
            {"id": "EDD", "name": "Earliest Due Date", "description": "Schedules jobs by earliest deadline first"},
            {"id": "SPT", "name": "Shortest Processing Time", "description": "Schedules shortest jobs first"}
        ]
    }