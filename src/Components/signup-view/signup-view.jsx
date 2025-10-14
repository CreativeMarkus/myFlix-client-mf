import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export const SignupView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const payload = {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday,
        };

        console.log('Signup payload:', payload);

        fetch('https://movieapi1-40cbbcb4b0ea.herokuapp.com/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                const text = await res.text();
                let body;
                try {
                    body = text ? JSON.parse(text) : {};
                } catch (e) {
                    body = text;
                }
                console.log('Signup response:', res.status, body);
                if (!res.ok) {
                    const msg = (body && body.message) || (typeof body === 'string' && body) || 'Signup failed';
                    throw new Error(msg);
                }
                return body;
            })
            .then(() => {
                setSuccess('Signup successful! You can now log in.');
                setUsername('');
                setPassword('');
                setEmail('');
                setBirthday('');
            })
            .catch((err) => {
                console.error('Signup error:', err);
                setError(err.message || 'Signup failed due to network error');
            });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                />
            </Form.Group>

            <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formBirthday">
                <Form.Label>Birthday:</Form.Label>
                <Form.Control
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                    autoComplete="bday"
                />
            </Form.Group>

            <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    );
};