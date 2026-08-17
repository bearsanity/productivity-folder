import { useState, useEffect } from 'react';
import CreateTask from '../components/CreateTaskForm';
import CreateGroup from '../components/CreateGroupForm';
import Taskcard from '../components/Taskcard';
import { Flex, Heading, Box } from '@chakra-ui/react'


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
        <Flex direction="column" gap={4} padding={6} maxWidth="800px" margin="0 auto">
            <Heading as="h2">Groups</Heading>
            {groups.map((g) => (
                <Box key={g._id}>
                    <Heading as="h3" onClick={() => toggleGroup(g._id)}>{g.title}</Heading>
                    {openGroups[g._id] && tasks.filter(task => task.group === g._id).map(task => (
                        <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups}/>
                    ))}
                </Box>
            ))}
            {/* For ungrouped tasks */}
            <Heading as="h4">Ungrouped Tasks</Heading>
            {tasks.filter(task => !task.group).map(task => (
                <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups}/>
            ))}
            <CreateTask onTaskCreated={fetchTasks} groups={groups} /> {/*so the dashboard refreshes on task creation*/}
            <CreateGroup onGroupCreated={fetchGroups} />
        </Flex>
    );
}

export default Dashboard;