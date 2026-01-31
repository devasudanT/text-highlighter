'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScrollProgressBarProps {
    containerId?: string;
    className?: string;
}

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
    containerId,
    className = ''
}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollContainerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!containerId) return;

        // Find the container element
        const container = document.getElementById(containerId);
        if (!container) return;

        // Find the actual scrollable element within the container
        // The ScrollArea component from shadcn/ui has a specific structure
        const scrollableElement = container.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;

        if (!scrollableElement) {
            console.warn('Scrollable element not found in container');
            return;
        }

        scrollContainerRef.current = scrollableElement;

        const handleScroll = () => {
            const scrollTop = scrollableElement.scrollTop;
            const scrollHeight = scrollableElement.scrollHeight;
            const clientHeight = scrollableElement.clientHeight;

            const progress = scrollHeight > clientHeight
                ? (scrollTop / (scrollHeight - clientHeight)) * 100
                : 0;

            setScrollProgress(Math.min(100, Math.max(0, progress)));
        };

        // Initial calculation
        handleScroll();

        // Add scroll event listener to the scrollable element
        scrollableElement.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup
        return () => {
            scrollableElement.removeEventListener('scroll', handleScroll);
        };
    }, [containerId]);

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
            <div className="relative h-1 bg-gray-200 dark:bg-gray-800">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
            <div className="absolute top-2 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">
                {Math.round(scrollProgress)}%
            </div>
        </div>
    );
};

export default ScrollProgressBar;
