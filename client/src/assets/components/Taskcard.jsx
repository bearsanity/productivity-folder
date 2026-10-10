import { useState } from 'react';
import CalendarHeatmap from './CalendarHeatmap'
import { Box, Button, Text, Heading, Input, NativeSelect, Field, Flex } from '@chakra-ui/react' //for styling
import { isCompletedForPeriod } from '../../utils/taskUtils';
import { FaCheck, FaPen, FaTrash } from 'react-icons/fa'; /* for taskcard button icons */

const Taskcard = ({ task, onTaskUpdated, groups }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDueDate, setEditDueDate] = useState(task.dueDate);
    const [editPriority, setEditPriority] = useState(task.priority);
    const [editFrequency, setEditFrequency] = useState(task.frequency);
    const [editGroup, setEditGroup] = useState(task.group || '');
    const [isExpanded, setIsExpanded] = useState(false)

    const isDone = isCompletedForPeriod(task.frequency, task.completionHistory);

    //=============================================================================================================
    //==============================================Handler Functions==============================================
    //=============================================================================================================

    const handleComplete = async () => {
        try {
            const response = await fetch(`/api/tasks/${task._id}/complete`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }
            onTaskUpdated();
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete this task?')) return;
        try {
            const response = await fetch(`/api/tasks/${task._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }
            onTaskUpdated();
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleSubmit = async () => {
        try {
            console.log({ editTitle, editFrequency, editDueDate, editPriority, editGroup })
            const response = await fetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // tells Express the body is JSON so it can parse it
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT token for the auth middleware
                },

                // spread pattern says "if group has a value, include it; if it's empty, don't send it at all." That way Mongoose never sees the field and won't try to cast it
                body: JSON.stringify({
                    title: editTitle,
                    frequency: editFrequency,
                    dueDate: editDueDate,
                    priority: editPriority,
                    ...(editGroup ? { group: editGroup } : {})
                }) // converts state values to JSON string
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setIsEditing(false);
            onTaskUpdated();
        } catch (err) {
            console.error(err.message);
        }
    };

    //====================================================================================================
    //==============================================TaskCard==============================================
    //====================================================================================================
    return (
        <Box
            borderWidth="1px"
            borderRadius="md"
            padding={2}
            borderBottomWidth="3px"
            borderRightWidth="3px"
            borderLeftWidth="7px"
            borderTopWidth="3px"
            borderColor={isDone ? 'green.200' : 'gray.200'}
            backgroundColor={isDone ? 'green.100' : 'white'}
            textAlign='left'
        >
            {isEditing ? (
                <Box>
                    <Field.Root>
                        <Field.Label>Title:</Field.Label>
                        <Input name="titleInput" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        {/* {errorMessageTitle && <p className="error-message">{errorMessageTitle}</Text>} */}
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Due Date:</Field.Label>
                        <Input name="dueDateInput" type="datetime-local" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                        {/* {errorMessageDueDate && <p className="error-message">{errorMessageDueDate}</Text>} */}
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Frequency:</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field value={editFrequency} onChange={(e) => setEditFrequency(e.target.value)}>
                                <option value="none">None</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Priority:</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                                <option value="none">None</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="top">Top</option>
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Group:</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field value={editGroup} onChange={(e) => setEditGroup(e.target.value)}>
                                <option value="">No group</option>
                                {groups.map((g) => (
                                    <option key={g._id} value={g._id}>{g.title}</option>
                                ))}
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Field.Root>
                    <Box alignItems="center" justifyContent="center" display="flex" gap={1} paddingTop={2}>
                        <Button className="submitButton" type="button" onClick={handleSubmit}>Save</Button>
                        <Button className="cancelButton" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </Box>
                </Box>
            ) : (
                <Flex marginBottom={3} paddingTop={1} justifyContent="space-between" alignItems="center">
                    <Box>
                        <Heading color='black' marginLeft={1} onClick={() => setIsExpanded(!isExpanded)} cursor="pointer" fontSize="md" >
                            {task.title}
                        </Heading>
                        <Box marginLeft={3}>
                            {task.priority !== 'none' && <Text textTransform='capitalize' fontSize="small" >{task.priority} Priority</Text>}
                            {task.frequency !== 'none' && <Text textTransform='capitalize' fontSize="small" >Frequency: {task.frequency}</Text>}
                            <Text fontSize="small" >{new Date(task.dueDate).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</Text>
                        </Box>
                    </Box>

                    <Flex gap={2} >
                        <Button size="sm" variant="ghost" colorPalette="gray" onClick={handleComplete}><FaCheck /></Button>
                        <Button size="sm" variant="ghost" colorPalette="gray" onClick={() => setIsEditing(true)}><FaPen /></Button>
                        <Button size="sm" variant="ghost" colorPalette="gray" onClick={handleDelete}><FaTrash /></Button>
                    </Flex>
                </Flex>
            )}
            {/* && is short circuit evaluation, if is Expanded is true, it proceeds with the heatmap, if not, it stops */}
            {isExpanded && <CalendarHeatmap completionHistory={task.completionHistory} />}
        </Box>
    )
}

export default Taskcard