import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const Room = () => {
    return (
        <div class="grid-card">
            <div class="content"></div>
        </div>
    );
};

const Space = () => {
    return (
        <div>
            Hiii
        </div>
    );
};

const Signal = () => {
    return (
        <form class="creation-bar">
            <select class="type-select">
                <option>Text</option>
                <option>Photo</option>
                <option>Video</option>
            </select>
            <input type="text" placeholder="" class="content-input"></input>
            <button type="submit">Send</button>
        </form>
    );
};

function Up() {
    const [croom, setRoom] = useState('room');

    useEffect(() => {
        function handle (ev) {
            const targetLink = ev.target.closest('#nav a');

            if (targetLink) {
                ev.preventDefault();

                const route = targetLink.getAttribute('href').replace('/', '');

                if (route === 'room' || route === 'space' || route === 'signal') {
                    setRoom(route);
                }
            }
        };

        window.addEventListener('click', handle);

        return function() {
            window.removeEventListener('click', handle);
        };
    }, []);

    const renderc = () => {
        switch (croom) {
            case 'room': return <Room />;
            case 'space': return <Space />;
            case 'signal': return <Signal />;
            default: return <Room />;
        }
    }

    return <>{renderc()}</>;
}

const el = document.getElementById('main');
const root = createRoot(el);
root.render(<Up />);