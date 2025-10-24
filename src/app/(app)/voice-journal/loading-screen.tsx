
import React from 'react';
import './animation.css';

export const VoiceJournalLoadingScreen = () => (
    <div className="loading-screen-voice-journal">
        <div className="mic-container">
            <div className="mic-emoji">🎤</div>
            <div className="bubble bubble-1">💬</div>
            <div className="bubble bubble-2">💬</div>
            <div className="bubble bubble-3">💬</div>
            <div className="bubble bubble-4">💬</div>
            <div className="bubble bubble-5">💬</div>
            <div className="bubble bubble-6">💬</div>
        </div>
        <div className="loading-text-voice-journal">Listening to Your Voice...</div>
    </div>
);
