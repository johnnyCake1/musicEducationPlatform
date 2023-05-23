import React, { useState, useRef } from "react";
import "./VideoPlayer.css";
import {
  FaPlay,
  FaPause,
  FaUndo,
  FaRedo,
  FaExpand,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

const VideoPlayer = ({ videoSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleRewindBack = () => {
    videoRef.current.currentTime -= 10;
  };

  const handleRewindForward = () => {
    videoRef.current.currentTime += 10;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    videoRef.current.playbackRate = speed;
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
  };

  const handleProgressBarClick = (event) => {
    const progressBarWidth = progressBarRef.current.offsetWidth;
    const clickedPosition = event.nativeEvent.offsetX;
    const duration = videoRef.current.duration;
    videoRef.current.currentTime =
      (clickedPosition / progressBarWidth) * duration;
  };

  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume;
    } else {
      videoRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        src={videoSrc}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        playbackrate={playbackRate}
        className="video-player"
        controlsList="nodownload"
      />
      <div className="video-progress-bar-container">
        <div
          className="progress-bar-container"
          ref={progressBarRef}
          onClick={handleProgressBarClick}
        >
          <div
            className="progress-bar"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>
      <div className="video-controls">
        <div className="speed-control">
          <label>Speed:</label>
          <select
            value={playbackRate}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
        <button className="control-button" onClick={handleRewindBack}>
          <FaUndo />
        </button>
        <button className="control-button" onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="control-button" onClick={handleRewindForward}>
          <FaRedo />
        </button>
        <div className="volume-control">
          <button className="control-button" onClick={toggleMute}>
            {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            ref={volumeBarRef}
          />
        </div>
        <button className="control-button" onClick={toggleFullScreen}>
          <FaExpand />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
