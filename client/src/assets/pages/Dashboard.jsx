import { useState, useEffect } from 'react';
import CreateTask from '../components/CreateTaskForm';
import CreateGroup from '../components/CreateGroupForm';
import Taskcard from '../components/Taskcard';
import { Flex, Heading, Box, Button, Menu, Portal, Input, Dialog } from '@chakra-ui/react'
import { FaEllipsisV, FaTrash, FaPen } from 'react-icons/fa';
import colorOptions from '../../utils/colorOptions';


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
        if (!window.confirm('Are you sure you want to delete this group?')) {
            return;
        }
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
        if (!activeGroup) return `linear-gradient(to top right, ${noActiveColor}, ${noActiveColor}70 60%, ${noActiveColor}50 80%, ${noActiveColor}30)`;
        const ungroupedColor = '#e7a62c'
        if (activeGroup === 'ungrouped') return `linear-gradient(to top right, ${ungroupedColor}, ${ungroupedColor}70 60%, ${ungroupedColor}50 80%, ${ungroupedColor}30)`;
        const color = groups.find(g => g._id === activeGroup)?.color;
        return color
            ? `linear-gradient(to top right, ${color}, ${color}70 60%, ${color}50 80%, ${color}30)`
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
        <Box padding={6} maxWidth={1500} justifyContent="center" margin="0 auto" display="flex" flexDirection="column">

            {/* ================== CREATE BUTTONS ================== */}
            <Flex gap={2} justifyContent="flex-end" marginBottom={2}>
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <Button variant="ghost">New Task</Button>
                    </Dialog.Trigger>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content padding={6}>
                                <Dialog.Header>
                                    <Dialog.Title>New Task</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <CreateTask onTaskCreated={() => { fetchTasks(); setShowCreateTask(false); }} groups={groups} onCancel={() => setShowCreateTask(false)} />
                                </Dialog.Body>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>

                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <Button variant="ghost">New Group</Button>
                    </Dialog.Trigger>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content padding={6}>
                                <Dialog.Header>
                                    <Dialog.Title>New Group</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <CreateGroup onGroupCreated={() => { fetchGroups(); setShowCreateGroup(false); }} onCancel={() => setShowCreateGroup(false)} />
                                </Dialog.Body>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>

            </Flex>


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
                padding={6}
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

                {groupToEdit !== null && groupToEdit === activeGroup && (
                    <Box padding={4} gap={2} backgroundColor="white" borderRadius="10px" marginBottom={4} maxWidth="500px">
                        <Input value={editGroupTitle} onChange={(e) => setEditGroupTitle(e.target.value)} />
                        <Flex gap={2} flexWrap="wrap" padding={2} >
                            {colorOptions.map((c) => (
                                <Box
                                    key={c}
                                    backgroundColor={c}
                                    width="32px"
                                    height="32px"
                                    borderRadius="full"
                                    cursor="pointer"
                                    border={editGroupColor === c ? "3px solid black" : "2px solid transparent"}
                                    onClick={() => setEditGroupColor(c)}
                                />
                            ))}
                        </Flex>
                        <Flex>
                            <Button variant="ghost" onClick={handleUpdateGroup}>Save</Button>
                            <Button variant="ghost" onClick={() => setGroupToEdit(null)}>Cancel</Button>
                        </Flex>
                    </Box>
                )}


                <Box maxWidth="800px" justifyContent="center" margin="0 auto" display="flex" flexDirection="column" gap={1}>
                    {activeGroup === 'ungrouped'
                        ? tasks.filter(task => !task.group).map(task => (
                            <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups} />
                        )) : activeGroup ? tasks.filter(task => task.group === activeGroup).map(task => (
                            <Taskcard key={task._id} task={task} onTaskUpdated={fetchTasks} groups={groups} />
                        )) : null}
                </Box>
            </Box>




            {/* ================== BUTTONS ==================  */}
            {/* <Box minHeight="500px" marginTop={2} marginBottom={2} >
                <Flex gap={2} justifyContent="center" alignItems="top" >
                    <Button fontSize="105%" variant='ghost' colorPalette='black' onClick={() => setShowCreateTask(!showCreateTask)}>New Task</Button>
                    <Button fontSize="105%" variant='ghost' colorPalette='black' onClick={() => setShowCreateGroup(!showCreateGroup)}>New Group</Button>
                </Flex> */}

            {/* ================== CREATE FORMS ==================  */}
            {/* {showCreateTask && <CreateTask onTaskCreated={() => { fetchTasks(); setShowCreateTask(false); }} groups={groups} onCancel={() => setShowCreateTask(false)} />} {/*so the dashboard refreshes on task creation}
                {showCreateGroup && <CreateGroup onGroupCreated={() => { fetchGroups(); setShowCreateGroup(false); }} onCancel={() => setShowCreateGroup(false)} />}
            </Box> */}

        </Box>

    );
}

export default Dashboard;