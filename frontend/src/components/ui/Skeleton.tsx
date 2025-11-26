import React from 'react';

interface SkeletonProps {
    className?: string;
    height?: string | number;
    width?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', height, width }) => {
    const style = {
        height: height,
        width: width,
    };

    return (
        <div
            className={`bg-gray-800 rounded animate-pulse ${className}`}
            style={style}
        />
    );
};
