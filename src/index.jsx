import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainView from './Components/main-view/main-view';
import { LoginView } from './Components/login-view/login-view';
import SignupView from './Components/signup-view/signup-view';
import { ProfileView } from './Components/profile-view/profile-view';
import MovieView from './Components/movie-view/movie-view';
import './index.scss';

const App = () => {
    const [user, setUser] = React.useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [token, setToken] = React.useState(localStorage.getItem('token') || null);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate to="/" />
                        ) : (
                            <LoginView onLoggedIn={(user, token) => {
                                setUser(user);
                                setToken(token);
                                localStorage.setItem('user', JSON.stringify(user));
                                localStorage.setItem('token', token);
                            }} />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={user ? <Navigate to="/" /> : <SignupView />}
                />
                <Route
                    path="/profile"
                    element={user ? <ProfileView user={user} token={token} setUser={setUser} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/movies/:movieId"
                    element={user ? <MovieView token={token} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/"
                    element={user ? <MainView token={token} /> : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
