import { useState, useEffect } from 'react';
import CreateTask from '../components/CreateTaskForm';
import CreateGroup from '../components/CreateGroupForm';
import Taskcard from '../components/Taskcard';
import { Flex, Heading, Box, Button, Menu, Portal } from '@chakra-ui/react'
import { FaEllipsisV, FaTrash, FaPen } from 'react-icons/fa';



function Dashboard() {
    // Hooks
    const [tasks, setTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [showCreateTask, setShowCreateTask] = useState(false); //create task window visibility
    const [showCreateGroup, setShowCreateGroup] = useState(false); //create group window visibility
    const [groupToEdit, setGroupToEdit] = useState(null); //group to edit
    const [editGroupTitle, setEditGroupTitle] = useState('');
    const [editGroupColor, setEditGroupColor] = useState('');


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

    const handleDeleteGroup = async (groupId) => {
        const tasksInGroup = tasks.filter(task => task.group === groupId);

        if (tasksInGroup.length > 0) {
            const keepTasks = window.confirm(
                'This group contains tasks. Click OK to move the tasks to the ungrouped section, or cancel to delete them.'
            );
            if (keepTasks) {
                // Move tasks to ungrouped section
                for (const task of tasksInGroup) {
                    await fetch(`/api/tasks/${task._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ group: null })
                    });
                }
            } else {
            //Delete all the tasks
            for (const task of tasksInGroup) {
                await fetch(`/api/tasks/${task._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
            }
        }
    }
        // Delete the group
        const response = await fetch(`/api/groups/${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error(`Response status: ${response.status}`);
        fetchGroups();
        fetchTasks();
        if (activeGroup === groupId) {
            setActiveGroup(null);
        }
    }

    const handleEditGroup = (groupId) => {
        const group = groups.find(g => g._id === groupId);
        setEditGroupTitle(group.title);
        setEditGroupColor(group.color);
        setGroupToEdit(groupId);
    }

    const handleUpdateGroup = async () => {
        try {
            const response = await fetch(`/api/groups/${groupToEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ title: editGroupTitle, color: editGroupColor })
            });
            if (!response.ok) throw new Error(`Response status: ${response.status}`);
            setGroupToEdit(null);
            fetchGroups();
        } catch (error) {
            console.error(error.message);
        }
    };


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

    const getTabColor = (color) => {
        return `linear-gradient(to top right, ${color}, ${color}70 49%, ${color}70 51%, ${color})`
    }


    // Fetch tasks and groups on first load - [] ensure only on the first load
    useEffect(() => {
        fetchTasks();
        fetchGroups();
    }, []);
    return (
        <Box padding={6} >

            {/* ================== TABS ================== */}
            <Flex flexWrap="nowrap" overflowX="auto" gap={1} margin="0 auto" marginLeft='28px' marginRight='28px'>
                {groups.map((g) => (
                    <Heading
                        as="h3"
                        color="black"
                        cursor="pointer"
                        key={g._id}
                        background={getTabColor(g.color)}
                        borderRadius="10px 10px 0 0"
                        borderBottom={activeGroup === g._id ? 'none' : '2px solid gray'}
                        borderLeft="2px solid gray"
                        minWidth="100px"
                        textAlign="center"
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
                    background={getTabColor('#ffc75e')}
                    cursor="pointer"
                    borderRadius="10px 10px 0 0"
                    borderBottom={activeGroup === 'ungrouped' ? 'none' : '2px solid gray'}
                    borderLeft="2px solid gray"
                    textAlign="center"
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
                position="relative"
            >
                {activeGroup && activeGroup !== 'ungrouped' && (
                    <Box position="absolute" top={2} right={2}>
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <Button variant="ghost" size="xs" onClick={(e) => e.stopPropagation()}>
                                    <FaEllipsisV />
                                </Button>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item value="edit" onClick={() => handleEditGroup(activeGroup)}><FaPen />Edit</Menu.Item>
                                        <Menu.Item value="delete" onClick={() => handleDeleteGroup(activeGroup)}><FaTrash />Delete</Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </Box>
                )}


                <Box maxWidth="800px" justifyContent="center" margin="0 auto" display="flex" flexDirection="column" gap={1}>
                    {activeGroup === 'ungrouped' 
                    ? tasks.filter(task => !task.group).map(task => (
                        <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups} />
                    )) : activeGroup ? tasks.filter(task => task.group === activeGroup).map(task => (
                        <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups} />
                    )) : null }
                </Box>
            </Box>


            {/* ================== BUTTONS ==================  */}
            <Box minHeight="500px" marginTop={2} marginBottom={2}>
                <Flex gap={2} justifyContent="center" alignItems="top" >
                    <Button variant='ghost' colorPalette='black' onClick={() => setShowCreateTask(!showCreateTask)}>New Task</Button>
                    <Button variant='ghost' colorPalette='black' onClick={() => setShowCreateGroup(!showCreateGroup)}>New Group</Button>
                </Flex>

                {/* ================== CREATE FORMS ==================  */}
                {showCreateTask && <CreateTask onTaskCreated={() => { fetchTasks(); setShowCreateTask(false); }} groups={groups} onCancel={() => setShowCreateTask(false)} />} {/*so the dashboard refreshes on task creation*/}
                {showCreateGroup && <CreateGroup onGroupCreated={() => { fetchGroups(); setShowCreateGroup(false); }} onCancel={() => setShowCreateGroup(false)} />}
            </Box>

        </Box>

    );
}

export default Dashboard;