import { useState } from 'react';
import { Box, Button, Field, Input } from '@chakra-ui/react'

// standard regex email validation
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
};



const Login = () => {
    //=================== Hooks ===================
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessageEmail, setErrorMessageEmail] = useState('');
    const [errorMessagePassword, setErrorMessagePassword] = useState('');

    function handleBlur(e) {
        if (e.target.name === 'emailInput') {
            if (e.target.value.trim().length === 0) {
                setErrorMessageEmail("This field can't be empty.");
            } else if (!validateEmail(e.target.value)) {
                setErrorMessageEmail('Not a valid email.');
            } else {
                setErrorMessageEmail('');
            }
        }
        if (e.target.name === 'passwordInput') {
            if (e.target.value.trim().length === 0) {
                setErrorMessagePassword("This field can't be empty.");
            } else {
                setErrorMessagePassword('');
            }
        }

    };

    // sends the email&pass to the server, if its succesful it will send back a token
    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            const token = data.token;
            localStorage.setItem('token', token);
            window.location.href = '/';
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Box as="form" maxWidth="300px" onSubmit={(e) => e.preventDefault()}>
            <Field.Root>
                <Field.Label> Email: </Field.Label>
                <Input name="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleBlur} />
                {errorMessageEmail && <Field.ErrorText>{errorMessageEmail}</Field.ErrorText>}
            </Field.Root>
            <Field.Root>
                <Field.Label>Password:</Field.Label>
                <Input name="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={handleBlur} />
                {errorMessagePassword && <Field.ErrorText>{errorMessagePassword}</Field.ErrorText>}
            </Field.Root>
            <Button onClick={handleSubmit}>Submit</Button>
        </Box>
    )
}

export default Login;