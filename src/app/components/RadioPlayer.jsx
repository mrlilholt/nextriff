"use client";

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import UploadModal from './UploadModal';
import { Button } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import './RadioPlayer.css'; // <-- Add this import

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [nowPlaying, setNowPlaying] = useState({ artist: '', title: '', playlist: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use document.body or another element that exists
      Modal.setAppElement(document.body);
    }
  }, []);

  // Array of upcoming shows - adjust times/titles as needed
  const upcomingShows = [
    { time: "8:00 AM", title: "Morning" },
    { time: "12:00 PM", title: "Chill" },
    { time: "4:00 PM", title: "Get Pumped Up" },
    { time: "6:00 PM", title: "Driving" },
    { time: "8:00 PM", title: "Hanging out" },
    { time: "10:00 PM", title: "Sleepy Time" },
  ];

  // Helper function to parse a time string (e.g. "10:00 PM") into minutes past midnight
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  };

  // Determine current time in minutes since midnight
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Sort the shows by time and then determine the next show
  const sortedShows = [...upcomingShows].sort((a, b) => parseTime(a.time) - parseTime(b.time));
  const nextShow = sortedShows.find(show => parseTime(show.time) > currentMinutes) || sortedShows[0];

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch('/api/getPlaylists');
        if (!res.ok) {
          console.warn(`Could not fetch playlists: Status ${res.status}`);
          return;
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Received non-JSON response');
          return;
        }
        const data = await res.json();
        // data is an object with keys for each folder;
        // flatten all playlists arrays into a single array
        const allTracks = Object.values(data).flat();

        setTracks(allTracks);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const playRandomTrack = () => {
    if (tracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      const track = tracks[randomIndex];
      setCurrentTrackIndex(randomIndex);
      // Creating a new Audio instance with the mp3 URL from Cloudinary
      const newAudio = new Audio(track.url);
      newAudio.addEventListener('ended', handleTrackEnd);
      setAudio(newAudio);
      setNowPlaying({ artist: track.artist, title: track.title, playlist: track.playlist });
      setIsPlaying(true);
    }
  };

  const handleTrackEnd = () => {
    playRandomTrack();
  };

  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, audio]);

  const togglePlay = () => {
    if (!isPlaying) {
      playRandomTrack();
    } else {
      setIsPlaying(false);
    }
  };

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return (
    <div className="radio-player-container">
      <div className="radio-player">
        <video autoPlay loop muted className="bg-video">
          <source src="/bg.mp4" type="video/mp4" /> {/* Reference the video file directly */}
          Your browser does not support the video tag.
        </video>
        <img src="/rrlogo.gif" alt="Riff Raff Deciders Radio Logo" className="logo" /> {/* Reference the image file directly */}
        <div className="controls">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={isPlaying ? <Pause /> : <PlayArrow />}
            onClick={togglePlay}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            onClick={openUploadModal}
            style={{
              margin: "0 10px",
              padding: "10px 20px",
              fontSize: "1rem",
            }}
          >
            Upload Track
          </Button>
        </div>
        <div className="now-playing">
          <h3>Now Playing</h3>
          <h2>{nowPlaying.title}</h2>
          <h3>{nowPlaying.playlist}</h3>
          <p>{nowPlaying.artist}</p>
        </div>
        <div className="upcoming-shows">
          <h3>Upcoming Show</h3>
          <p>{nextShow.time} - {nextShow.title}</p>
        </div>
        <Modal
          isOpen={isUploadModalOpen}
          onRequestClose={closeUploadModal}
          contentLabel="Upload Modal"
          className="modal"
          overlayClassName="overlay"
        >
          <UploadModal closeModal={closeUploadModal} />
        </Modal>
      </div>
    </div>
  );
};

export default RadioPlayer;