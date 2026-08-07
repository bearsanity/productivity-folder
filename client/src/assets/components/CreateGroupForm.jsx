import { useState, useEffect } from 'react';


const CreateGroup = () => {
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
            setColor('none');
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
                Color: <input name="colorInput" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>
            <button className="submitButton" type="button" onClick={handleSubmit}>Submit</button>
            <button className="cancelButton" type="button">Cancel</button>
        </form>
    )
}

export default CreateGroup;