"use client";
import React, { useState } from 'react';
import UploadSection from './UploadSection';

const UserAuth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add real authentication logic here if needed
        if (username && password) {
            console.log(isLogin ? 'Logging in...' : 'Registering...');
            // Mark user as authenticated and pass the username as their email
            setAuthenticated(true);
            setError('');
        } else {
            setError('Please fill in all fields');
        }
    };

    if (authenticated) {
        // Once authenticated, render the UploadSection passing the current username (used as email)
        return <UploadSection currentUserEmail={username} />;
    }

    return (
        <div className="user-auth">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                <button type="button" onClick={() => setIsLogin(!isLogin)}>
                    Switch to {isLogin ? 'Register' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default UserAuth;