import React from 'react';
import ReactDOM from 'react-dom';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const el = React.useRef(document.createElement('div'));

    React.useEffect(() => {
        const currentEl = el.current;
        document.body.appendChild(currentEl);
        return () => {
            document.body.removeChild(currentEl);
        };
    }, []);

    return ReactDOM.createPortal(children, el.current);
};

export default Portal;
