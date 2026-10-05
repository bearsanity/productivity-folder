import { useState } from 'react';
import { Box, Button, Field, Input, NativeSelect, Heading } from '@chakra-ui/react'

const CreateTask = ({ onTaskCreated, groups, onCancel }) => {
    //=================== Hooks ===================
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState('none');
    const [dueDate, setDueDate] = useState(
        new Date().toISOString().split('T')[0] + 'T23:59'
    );
    const [priority, setPriority] = useState('none');
    const [group, setGroup] = useState('');
    const [errorMessageTitle, setErrorMessageTitle] = useState('');
    const [errorMessageDueDate, setErrorMessageDueDate] = useState('');



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
                body: JSON.stringify({ title, frequency, dueDate, priority, ...(group ? { group } : {}) }) // converts state values to JSON string
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
            onTaskCreated();
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Box as="form" onSubmit={(e) => e.preventDefault()}>
            <Heading as="h3">Create Task:</Heading>
            <Field.Root>
                <Field.Label>Title:</Field.Label>
                <Input name="titleInput" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleBlur} />
                {errorMessageTitle && <Field.ErrorText>{errorMessageTitle}</Field.ErrorText>}
            </Field.Root>
            <Field.Root>
                <Field.Label>Due Date:</Field.Label>
                <Input name="dueDateInput" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} onBlur={handleBlur} />
                {errorMessageDueDate && <Field.ErrorText>{errorMessageDueDate}</Field.ErrorText>}
            </Field.Root>
            <Field.Root>
                <Field.Label> Frequency:</Field.Label>
                <NativeSelect.Root>
                    <NativeSelect.Field value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                        <option value="none">Don't Repeat</option>
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
                    <NativeSelect.Field value={priority} onChange={(e) => setPriority(e.target.value)}>
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
                    <NativeSelect.Field value={group} onChange={(e) => setGroup(e.target.value)}>
                        <option value="">No group</option>
                        {groups.map((g) => (
                            <option key={g._id} value={g._id}>{g.title}</option>
                        ))}
                    </NativeSelect.Field>
                </NativeSelect.Root>
            </Field.Root>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={() => { setTitle(''); setFrequency('none'); setDueDate(''); setPriority('none'); setGroup(''); onCancel(); }}>Cancel</Button>
        </Box>
    )
}

export default CreateTask;