import { useCallback, useEffect, useState } from 'react';

// Publikus hang URL-ek (freesound.org preview linkek vagy hasonló)
const SOUNDS = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    cash: 'https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3',
    punch: 'https://assets.mixkit.co/active_storage/sfx/1667/1667-preview.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
    levelUp: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
};

// Audio pool for better performance
const audioPool = new Map<string, HTMLAudioElement[]>();

const getAudio = (url: string): HTMLAudioElement => {
    if (!audioPool.has(url)) {
        audioPool.set(url, []);
    }

    const pool = audioPool.get(url)!;
    const availableAudio = pool.find(audio => audio.paused);

    if (availableAudio) {
        return availableAudio;
    }

    const newAudio = new Audio(url);
    newAudio.volume = 0.3; // Default volume
    pool.push(newAudio);
    return newAudio;
};

export const useGameSound = () => {
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('game_sound_muted');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('game_sound_muted', isMuted.toString());
    }, [isMuted]);

    const playSound = useCallback((soundKey: keyof typeof SOUNDS) => {
        if (isMuted) return;

        try {
            const audio = getAudio(SOUNDS[soundKey]);
            audio.currentTime = 0;
            audio.play().catch((error) => {
                // Silently catch autoplay errors
                console.debug('Audio play failed:', error);
            });
        } catch (error) {
            console.debug('Sound error:', error);
        }
    }, [isMuted]);

    const playClick = useCallback(() => playSound('click'), [playSound]);
    const playCash = useCallback(() => playSound('cash'), [playSound]);
    const playPunch = useCallback(() => playSound('punch'), [playSound]);
    const playError = useCallback(() => playSound('error'), [playSound]);
    const playLevelUp = useCallback(() => playSound('levelUp'), [playSound]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    return {
        playClick,
        playCash,
        playPunch,
        playError,
        playLevelUp,
        isMuted,
        toggleMute,
    };
};
