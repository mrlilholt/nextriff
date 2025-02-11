/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const whitelist = ['addison.lilholt@gmail.com', 'ksryan85@gmail.com', 'dancomly@gmail.com']; // Array storing whitelisted emails

const UploadSection = ({ currentUserEmail }) => {
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [artist, setArtist] = useState('');
    const [songTitle, setSongTitle] = useState('');
    const [message, setMessage] = useState('');

    // New state for the playlist (folder) choice
    const [playlistType, setPlaylistType] = useState('Driving');

    useEffect(() => {
        const checkWhitelist = async () => {
            try {
                if (whitelist.includes(currentUserEmail)) {
                    setIsWhitelisted(true);
                }
            } catch (error) {
                console.error('Error verifying whitelist:', error);
            }
            setLoading(false);
        };

        if (currentUserEmail) {
            checkWhitelist();
        } else {
            setLoading(false);
        }
    }, [currentUserEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !artist || !songTitle) {
            setMessage('Please complete all fields.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'musicUploads');
        // Use the selected playlistType to determine the folder
        formData.append('folder', `music/${playlistType}`);

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dkbkpdugz/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            console.log('Upload successful:', data.secure_url, artist, songTitle);

            // TODO: After successful upload, send the Cloudinary URL,
            // artist, songTitle, and playlistType to your backend to update the playlist.
            setMessage('Upload successful!');
        } catch (err) {
            console.error('Upload failed:', err);
            setMessage('File upload failed.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!isWhitelisted) {
        return <p>You are not authorized to access the upload section.</p>;
    }

    return (
        <div className="upload-section">
            <h2>Upload To The Radio</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Artist:</label>
                    <input
                        type="text"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Song Title:</label>
                    <input
                        type="text"
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Playlist Type:</label>
                    <select value={playlistType} onChange={(e) => setPlaylistType(e.target.value)}>
                        <option value="Driving">Driving</option>
                        <option value="Sleepy Time">Sleepy Time</option>
                        <option value="Morning">Morning</option>
                        <option value="Chill">Chill</option>
                        <option value="Hanging out">Hanging out</option>
                        <option value="Get Pumped Up">Get Pumped Up</option>
                        <option value="Misc">Misc</option>
                    </select>
                </div>
                <div>
                    <label>MP3 File:</label>
                    <input
                        type="file"
                        accept="audio/mp3"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadSection;