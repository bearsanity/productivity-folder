import { useState, useEffect } from 'react';
import CreateTask from '../components/CreateTaskForm';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
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
        fetchTasks();
    }, []);
    return (
        <div>
            <h1>Dashboard</h1>
            {tasks.map((task) => (
                <div key={task._id}>
                    <h3>{task.title}</h3>
                </div>
            ))}
            <CreateTask />
        </div>
    );
}

export default Dashboard;