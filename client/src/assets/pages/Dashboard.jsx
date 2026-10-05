import { useState, useEffect } from 'react';
import CreateTask from '../components/CreateTaskForm';
import CreateGroup from '../components/CreateGroupForm';
import Taskcard from '../components/Taskcard';
import { Flex, Heading, Box, Button } from '@chakra-ui/react'


function Dashboard() {
    // Hooks
    const [tasks, setTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [openGroups, setOpenGroups] = useState({});
    const [showCreateTask, setShowCreateTask] = useState(false); //create task window visibility
    const [showCreateGroup, setShowCreateGroup] = useState(false); //create group window visibility
    const [showUngroupedTasks, setShowUngroupedTasks] = useState(false); //ungrouped tasks visibility

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
                    <Heading as="h3" cursor="pointer" onClick={() => toggleGroup(g._id)}>{g.title}</Heading>
                    {openGroups[g._id] && tasks.filter(task => task.group === g._id).map(task => (
                        <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups}/>
                    ))}
                </Box>
            ))}
            {/* For ungrouped tasks */}
            <Heading as="h4" cursor="pointer" onClick={() => setShowUngroupedTasks(!showUngroupedTasks)}>
                Ungrouped Tasks
            </Heading>
            {showUngroupedTasks && tasks.filter(task => !task.group).map(task => (
                <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups} />
            ))}
            <Button onClick={() => setShowCreateTask(true)}>New Task</Button>
            {showCreateTask && <CreateTask onTaskCreated={() => { fetchTasks(); setShowCreateTask(false); } } groups={groups} onCancel={() => setShowCreateTask(false)} />} {/*so the dashboard refreshes on task creation*/}
            <Button onClick={() => setShowCreateGroup(true)}>New Group</Button>
            {showCreateGroup && <CreateGroup onGroupCreated={() => { fetchGroups(); setShowCreateGroup(false); }} onCancel={() => setShowCreateGroup(false)} />}
        </Flex>
    );
}

export default Dashboard;