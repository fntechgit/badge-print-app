import React, { useState, useEffect } from 'react';

const Timeout = ({ callback, timeout = 3000, paused = false }) => {
    const [timeoutId, setTimeoutId] = useState();
    const [prevPaused, setPrevPaused] = useState(paused);
    useEffect(() => {
        if (!prevPaused && paused && timeoutId) window.clearTimeout(timeoutId);
        setPrevPaused(paused);
        if (!paused) {
            setTimeoutId(window.setTimeout(callback, timeout));
        }
        return () => {
            if (timeoutId) window.clearTimeout(timeoutId);
        }
    }, [callback, paused]);
    return null;
};

export default Timeout