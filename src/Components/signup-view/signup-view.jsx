import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupView = () => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");
    const [birthday, setbirthday] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            username: username,
            password: password,
            email: email,
            birthday: birthday
        };

        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Signup successful! You can now log in.");
                    setusername("");
                    setpassword("");
                    setemail("");
                    setbirthday("");
                } else {
                    alert("Signup failed. Please check your input or try again.");
                }
            })
            .catch((error) => {
                console.error("Error during signup:", error);
                alert("Signup failed due to a network error.");
            });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                        required
                        minLength="3"
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Birthday:
                    <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setbirthday(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </>
    );
};

export default SignupView;
