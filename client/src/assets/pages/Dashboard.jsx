import { useState, useEffect } from 'react';
import CreateTask from '../components/CreateTaskForm';
import CreateGroup from '../components/CreateGroupForm';
import Taskcard from '../components/Taskcard';
import { Flex, Heading, Box, Button } from '@chakra-ui/react'


function Dashboard() {
    // Hooks
    const [tasks, setTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [showCreateTask, setShowCreateTask] = useState(false); //create task window visibility
    const [showCreateGroup, setShowCreateGroup] = useState(false); //create group window visibility

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
        setActiveGroup(prev => prev === groupId ? null : groupId);
    }

    const getBgColor = () => {
        const noActiveColor = '#ffbc3d'
        if (!activeGroup) return `linear-gradient(to top right, ${noActiveColor}, ${noActiveColor}70 30%, ${noActiveColor}50 50%, ${noActiveColor}30)`;
        const ungroupedColor = '#ffc75e'
        if (activeGroup === 'ungrouped') return `linear-gradient(to top right, ${ungroupedColor}, ${ungroupedColor}70 30%, ${ungroupedColor}50 50%, ${ungroupedColor}30)`;
        const color = groups.find(g => g._id === activeGroup)?.color;
        return color
            ? `linear-gradient(to top right, ${color}, ${color}70 30%, ${color}50 50%, ${color}30)`
            : 'linear-gradient(to top right, #ffbc3d40, #ffbc3d20)';
    }

    useEffect(() => {
        fetchTasks();
        fetchGroups();
    }, []);
    return (
        <Box padding={6} >

            {/* ================== TABS ================== */}
            <Flex flexWrap="wrap" gap={2} maxWidth="800px" margin="0 auto" >
                {groups.map((g) => (
                    <Heading
                        as="h3"
                        color="black"
                        cursor="pointer"
                        key={g._id}
                        backgroundColor={g.color}
                        borderRadius="10px 10px 0 0"
                        borderBottom={activeGroup === g._id ? 'none' : '2px solid gray'}
                        borderLeft="2px solid gray"
                        minWidth="100px"
                        justifyContent="center"
                        alignItems="center"
                        display="flex"
                        padding={2}
                        paddingLeft={2}
                        fontSize="md"
                        onClick={() => toggleGroup(g._id)}
                    >
                        {g.title}
                    </Heading>

                ))}

                {/* ================== UNGROUPED TAB ================== */}
                <Heading
                    as="h3"
                    color="black"
                    backgroundColor="#ffc75e"
                    cursor="pointer"
                    borderRadius="10px 10px 0 0"
                    borderBottom={activeGroup === 'ungrouped' ? 'none' : '2px solid gray'}
                    borderLeft="2px solid gray"
                    padding={2}
                    fontSize="md"
                    onClick={() => toggleGroup('ungrouped')}>
                    Ungrouped
                </Heading>
            </Flex>

            {/* ================== VISIBLE TASKS SECTION ==================  */}
            
                <Box
                background={getBgColor()}
                borderRadius="30px 30px 10px 10px"
                padding={4}
                minHeight="600px"
                borderLeft="3px solid gray"
                >
                    <Box maxWidth="800px"  justifyContent="center" margin="0 auto" display="flex" flexDirection="column" gap={1}>
                    {activeGroup === 'ungrouped' ? tasks.filter(task => !task.group).map(task => (
                        <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups} />
                    )) : tasks.filter(task => task.group === activeGroup).map(task => (
                        <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups} />
                    ))}
                    </Box>
                </Box>
            

            {/* ================== BUTTONS ==================  */}
            <Flex gap={2} justifyContent="center" alignItems="center">
                <Button variant='ghost' colorPalette='black' onClick={() => setShowCreateTask(true)}>New Task</Button>
                <Button variant='ghost' colorPalette='black' onClick={() => setShowCreateGroup(true)}>New Group</Button>
            </Flex>

            {/* ================== CREATE FORMS ==================  */}
            {showCreateTask && <CreateTask onTaskCreated={() => { fetchTasks(); setShowCreateTask(false); }} groups={groups} onCancel={() => setShowCreateTask(false)} />} {/*so the dashboard refreshes on task creation*/}
            {showCreateGroup && <CreateGroup onGroupCreated={() => { fetchGroups(); setShowCreateGroup(false); }} onCancel={() => setShowCreateGroup(false)} />}
        </Box>
    );
}

export default Dashboard;