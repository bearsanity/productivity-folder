import { useState, useEffect } from 'react';


const CreateTask = () => {
    //=================== Hooks ===================
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState('none');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('none');
    const [group, setGroup] = useState('');
    const [errorMessageTitle, setErrorMessageTitle] = useState('');
    const [errorMessageDueDate, setErrorMessageDueDate] = useState('');
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('/api/groups', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
                });
                const data = await response.json();
                setGroups(data);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchGroups();
    },[])


    //Title and duedate cant be blank
    function handleBlur(e) {
        if (e.target.name === 'titleInput') {
            if (e.target.value.trim().length === 0) {
                setErrorMessageTitle("This field can't be empty.");
            } else {
                setErrorMessageTitle('');
            }
        } else if (e.target.name === 'dueDateInput') {
            if (e.target.value.trim().length === 0) {
                setErrorMessageDueDate("This field can't be empty.");
            } else {
                setErrorMessageDueDate('');
            }

        }
    };

    const handleSubmit = async () => {
        try {
            console.log({ title, frequency, dueDate, priority, group })
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // tells Express the body is JSON so it can parse it
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT token for the auth middleware
                },

                 // spread pattern says "if group has a value, include it; if it's empty, don't send it at all." That way Mongoose never sees the field and won't try to cast it
                body: JSON.stringify({ title, frequency, dueDate, priority, ...( group ? { group } : {}) }) // converts state values to JSON string
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setTitle('');
            setFrequency('none');
            setDueDate('');
            setPriority('none');
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <label>
                Title: <input name="titleInput" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleBlur} />
                {errorMessageTitle && <p className="error-message">{errorMessageTitle}</p>}
            </label>
            <label>
                Due Date: <input name="dueDateInput" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} onBlur={handleBlur} />
                {errorMessageDueDate && <p className="error-message">{errorMessageDueDate}</p>}
            </label>
            <label>
                Frequency:
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </label>
            <label>
                Priority:
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="top">Top</option>
                </select>
            </label>
            <label>
                Group:
                <select value={group} onChange={(e) => setGroup(e.target.value)}>
                    <option value="">No group</option>
                    {groups.map((g) => (
                        <option key={g._id} value={g._id}>{g.title}</option>
                    ))}
                </select>
            </label>
            <button className="submitButton" type="button" onClick={handleSubmit}>Submit</button>
            <button className="cancelButton" type="button">Cancel</button>
        </form>
    )
}

export default CreateTask;