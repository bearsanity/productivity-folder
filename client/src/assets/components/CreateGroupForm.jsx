import { useState } from 'react';
import { Box, Button, Field, Input, Heading } from '@chakra-ui/react'

const CreateGroup = ({ onGroupCreated }) => {
    //=================== Hooks ===================
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#000000');
    const [errorMessageTitle, setErrorMessageTitle] = useState('');


    //Title and duedate cant be blank
    function handleBlur(e) {
        if (e.target.name === 'titleInput') {
            if (e.target.value.trim().length === 0) {
                setErrorMessageTitle("This field can't be empty.");
            } else {
                setErrorMessageTitle('');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            console.log({ title, color })
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // tells Express the body is JSON so it can parse it
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT token for the auth middleware
                },

                // spread pattern says "if group has a value, include it; if it's empty, don't send it at all." That way Mongoose never sees the field and won't try to cast it
                body: JSON.stringify({ title, color }) // converts state values to JSON string
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setTitle('');
            setColor('#000000');
            onGroupCreated();
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Box as="form" onSubmit={(e) => e.preventDefault()}>
            <Heading as="h3">Create Group:</Heading>
            <Field.Root>
                <Field.Label>Title:</Field.Label>
                <Input name="titleInput" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleBlur} />
                {errorMessageTitle && <Field.ErrorText>{errorMessageTitle}</Field.ErrorText>}
            </Field.Root>
            <Field.Root>
                <Field.Label>Color:</Field.Label>
                <Input name="colorInput" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </Field.Root>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={() => { setTitle(''); setColor('#000000') }}>Cancel</Button>
        </Box>
    )
}

export default CreateGroup;