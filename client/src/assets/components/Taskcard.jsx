import { useState } from 'react';


const Taskcard = ({ task, onTaskUpdated, groups }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDueDate, setEditDueDate] = useState(task.dueDate);
    const [editPriority, setEditPriority] = useState(task.priority);
    const [editFrequency, setEditFrequency] = useState(task.frequency);
    const [editGroup, setEditGroup] = useState(task.group || '');

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
                    ...(editGroup ? { group: editGroup } : {}) }) // converts state values to JSON string
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

    return isEditing ? (
        <div>
            <label>
                Title: <input name="titleInput" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}/>
                {/* {errorMessageTitle && <p className="error-message">{errorMessageTitle}</p>} */}
            </label>
            <label>
                Due Date: <input name="dueDateInput" type="datetime-local" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)}/>
                {/* {errorMessageDueDate && <p className="error-message">{errorMessageDueDate}</p>} */}
            </label>
            <label>
                Frequency:
                <select value={editFrequency} onChange={(e) => setEditFrequency(e.target.value)}>
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </label>
            <label>
                Priority:
                <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="top">Top</option>
                </select>
            </label>
            <label>
                Group:
                <select value={editGroup} onChange={(e) => setEditGroup(e.target.value)}>
                    <option value="">No group</option>
                    {groups.map((g) => (
                        <option key={g._id} value={g._id}>{g.title}</option>
                    ))}
                </select>
            </label>
            <button className="submitButton" type="button" onClick={handleSubmit}>Save</button>
            <button className="cancelButton" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
    ) : (
        <div>
            <h3>{task.title}</h3>
            <p>{task.dueDate}</p>
            <p>{task.priority}</p>
            <p>{task.frequency}</p>
            <button onClick={handleComplete}>Complete!</button>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default Taskcard