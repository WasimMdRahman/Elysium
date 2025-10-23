
import React from 'react';
import './animation.css';

export const JournalLoadingScreen = () => (
    <div className="loading-screen-journal">
        <div className="book">
            <div className="cover"></div>
            <div className="page"></div>
            <div className="pen"></div>
        </div>
        <div className="loading-text-journal">Loading Journal...</div>
    </div>
);
