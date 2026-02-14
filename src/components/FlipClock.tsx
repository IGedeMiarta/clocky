"use client";

import React, { useEffect, useState, useRef } from 'react';
import styles from './FlipClock.module.css';


const FlipUnit = ({ value, label }: { value: string | number, label?: string }) => {
    const [curr, setCurr] = useState(value);
    const [currLbl, setCurrLbl] = useState(label);
    const [prev, setPrev] = useState(value);
    const [prevLbl, setPrevLbl] = useState(label);
    const [isFlipping, setIsFlipping] = useState(false);

    // We need to track the value/label prop to trigger animation
    useEffect(() => {
        if (value !== curr || label !== currLbl) {
            setPrev(curr);
            setPrevLbl(currLbl);
            setCurr(value);
            setCurrLbl(label);
            setIsFlipping(true);

            const timer = setTimeout(() => {
                setIsFlipping(false);
                setPrev(value); // Sync after flip
                setPrevLbl(label);
            }, 600); // 0.6s matches CSS animation

            return () => clearTimeout(timer);
        }
    }, [value, label, curr, currLbl]);

    return (
        <div className={styles.card}>

            {/* Static Upper Half: Shows Next Number (curr) */}
            <div className={styles.upper}>
                <span className={styles.digit}>{curr}</span>
                {currLbl && <span className={styles.cardLabel}>{currLbl}</span>}
            </div>

            {/* Static Lower Half: Shows Current Number (prev) */}
            {!isFlipping ? (
                <>
                    <div className={styles.lower}>
                        <span className={styles.digit}>{curr}</span>
                    </div>
                </>
            ) : (
                <>
                    {/* Animation Mode */}
                    <div className={styles.lower}>
                        <span className={styles.digit}>{prev}</span>
                    </div>

                    {/* The Flipper */}
                    <div className={`${styles.flap} ${styles.flipping}`}>
                        {/* Front: Top Prev */}
                        <div className={`${styles.upper} ${styles.flipFront}`}>
                            <span className={styles.digit}>{prev}</span>
                            {prevLbl && <span className={styles.cardLabel}>{prevLbl}</span>}
                        </div>
                        {/* Back: Bottom Curr */}
                        <div className={`${styles.lower} ${styles.flipBack}`}>
                            <span className={styles.digit}>{curr}</span>
                            {/* We don't usually put label on bottom half */}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default function FlipClock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) return <div className={styles.container}></div>;

    let hours = time.getHours();
    const isPM = hours >= 12;
    // Convert to 12h format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const hStr = hours.toString().padStart(2, '0');
    const mStr = time.getMinutes().toString().padStart(2, '0');

    // Re-add toggleFullScreen since it was removed
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.clock}>
                {/* Hours */}
                <FlipUnit value={hStr} label={isPM ? "PM" : "AM"} />
                {/* Minutes */}
                <FlipUnit value={mStr} />
            </div>

            <button className={styles.fullScreenBtn} onClick={toggleFullScreen} aria-label="Toggle Fullscreen">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8V4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 8V4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 16V20H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 16V20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}
