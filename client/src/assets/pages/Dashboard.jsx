import { useState, useEffect } from 'react';
import CreateTask from '../components/CreateTaskForm';
import CreateGroup from '../components/CreateGroupForm';
import Taskcard from '../components/Taskcard';


function Dashboard() {
    // Hooks
    const [tasks, setTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [openGroups, setOpenGroups] = useState({});

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const tasks = await response.json();
            setTasks(tasks);
        } catch (error) {
            console.error(error.message);
        };
    }
    //groups to put tasks in
    const fetchGroups = async () => {
        try {
            const response = await fetch('/api/groups', {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const groups = await response.json();
            setGroups(groups);
        } catch (error) {
            console.error(error.message);
        };
    }

    const toggleGroup = (groupId) => {
        setOpenGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }))
    }

    useEffect(() => {
        fetchTasks();
        fetchGroups();
    }, []);
    return (
        <div>
            <h1>Dashboard</h1>
            {groups.map((g) => (
                <div key={g._id}>
                    <h3 onClick={() => toggleGroup(g._id)}>{g.title}</h3>
                    {openGroups[g._id] && tasks.filter(task => task.group === g._id).map(task => (
                        <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups}/>
                    ))}
                </div>
            ))}
            {/* For ungrouped tasks */}
            {tasks.filter(task => !task.group).map(task => (
                <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups}/>
            ))}
            <CreateTask onTaskCreated={fetchTasks} groups={groups} /> {/*so the dashboard refreshes on task creation*/}
            <CreateGroup onGroupCreated={fetchGroups} />
        </div>
    );
}

export default Dashboard;