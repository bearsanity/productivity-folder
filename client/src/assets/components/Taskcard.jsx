import { useState } from 'react';
import CalendarHeatmap from './CalendarHeatmap'
import { Box, Button, Text, Heading, Input, NativeSelect } from '@chakra-ui/react' //for styling

const Taskcard = ({ task, onTaskUpdated, groups }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDueDate, setEditDueDate] = useState(task.dueDate);
    const [editPriority, setEditPriority] = useState(task.priority);
    const [editFrequency, setEditFrequency] = useState(task.frequency);
    const [editGroup, setEditGroup] = useState(task.group || '');
    const [isExpanded, setIsExpanded] = useState(false)

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
        <Box>
            {isEditing ? (
                <Box>
                    <Field>
                        Title: <Input name="titleInput" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        {/* {errorMessageTitle && <p className="error-message">{errorMessageTitle}</Text>} */}
                    </Field>
                    <Field>
                        Due Date: <Input name="dueDateInput" type="datetime-local" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                        {/* {errorMessageDueDate && <p className="error-message">{errorMessageDueDate}</Text>} */}
                    </Field>
                    <Field>
                        Frequency:
                        <select value={editFrequency} onChange={(e) => setEditFrequency(e.target.value)}>
                            <option value="none">None</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </Field>
                    <Field>
                        Priority:
                        <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                            <option value="none">None</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="top">Top</option>
                        </select>
                    </Field>
                    <Field>
                        Group:
                        <select value={editGroup} onChange={(e) => setEditGroup(e.target.value)}>
                            <option value="">No group</option>
                            {groups.map((g) => (
                                <option key={g._id} value={g._id}>{g.title}</option>
                            ))}
                        </select>
                    </Field>
                    <Button className="submitButton" type="button" onClick={handleSubmit}>Save</Button>
                    <Button className="cancelButton" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                </Box>
            ) : (
                <Box>
                    <Heading onClick={() => setIsExpanded(!isExpanded)}>{task.title}</Heading>
                    <Text>{task.dueDate}</Text>
                    <Text>{task.priority}</Text>
                    <Text>{task.frequency}</Text>
                    <Button onClick={handleComplete}>Complete!</Button>
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </Box>
            )}
            {/* && is short circuit evaluation, if is Expanded is true, it proceeds with the heatmap, if not, it stops */}
            {isExpanded && <CalendarHeatmap completionHistory={task.completionHistory} />}
        </Box>
    )
}

export default Taskcard