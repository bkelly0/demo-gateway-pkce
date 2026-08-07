import React from 'react';
import './Spinner.css';

interface SpinnerProps {
    size?: number;
    color?: string;
    borderWidth?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 40,
    color = '#007bff',
    borderWidth = 4,
}) => {
    return (
        <div
            className="spinner"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderWidth: `${borderWidth}px`,
                borderTopColor: color,
            }}
            role="status"
            aria-label="Loading"
        />
    );
};