import { useState } from 'react';
import { Box, Button, Field, Input, Heading, Flex} from '@chakra-ui/react'

const CreateGroup = ({ onGroupCreated, onCancel }) => {
    //=================== Hooks ===================
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#000000');
    const [errorMessageTitle, setErrorMessageTitle] = useState('');
    const colorOptions = [ '#2297ff', '#9b3cc4', '#37ba35', '#f8001a', '#fd6f04', '#ff67bd', '#ffde01', ]


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
        <Box as="form" maxWidth="500px" margin="0 auto" gap={4} onSubmit={(e) => e.preventDefault()}>
            <Heading as="h3">Create Group:</Heading>
            <Field.Root>
                <Field.Label>Title:</Field.Label>
                <Input name="titleInput" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleBlur} />
                {errorMessageTitle && <Field.ErrorText>{errorMessageTitle}</Field.ErrorText>}
            </Field.Root>
            <Field.Root>
                <Field.Label>Color:</Field.Label>
                <Flex gap={2} flexWrap="wrap">
                    {colorOptions.map((c) => (
                        <Box
                            key={c}
                            backgroundColor={c}
                            width="32px"
                            height="32px"
                            borderRadius="full"
                            cursor="pointer"
                            border={color === c ? "3px solid black" : "2px solid transparent"}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </Flex>
            </Field.Root>
            <Box justifyContent="center" alignItems="center" display="flex" gap={1} paddingTop={3}>
                <Button variant="ghost" onClick={handleSubmit}>Submit</Button>
                <Button variant="ghost" onClick={() => { setTitle(''); setColor('#000000'); onCancel(); }}>Cancel</Button>
            </Box>
        </Box>
    )
}

export default CreateGroup;