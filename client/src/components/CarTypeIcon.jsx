import { FiUsers, FiZap } from 'react-icons/fi';

// SVG Car Type Icons — 3D-style silhouettes
const CarIcons = {
    Hatchback: () => (
        <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="car-icon-svg">
            <path d="M15 45C15 45 20 45 25 45C25 38 31 32 38 32C45 32 51 38 51 45L70 45C70 38 76 32 83 32C90 32 96 38 96 45L105 45C108 45 110 43 110 40L110 35C110 32 108 28 105 27L80 20C78 18 72 12 65 10L40 10C35 10 28 15 25 18L12 28C10 30 10 33 10 35L10 40C10 43 12 45 15 45Z" fill="url(#hatchGrad)" stroke="rgba(79,70,229,0.3)" strokeWidth="1" />
            <circle cx="38" cy="45" r="7" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="38" cy="45" r="3" fill="#64748B" />
            <circle cx="83" cy="45" r="7" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="83" cy="45" r="3" fill="#64748B" />
            <path d="M30 18L42 10L65 10L75 18Z" fill="rgba(79,70,229,0.15)" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5" />
            <defs>
                <linearGradient id="hatchGrad" x1="10" y1="10" x2="110" y2="45">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
                </linearGradient>
            </defs>
        </svg>
    ),
    Sedan: () => (
        <svg viewBox="0 0 130 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="car-icon-svg">
            <path d="M15 45C15 45 22 45 27 45C27 38 33 32 40 32C47 32 53 38 53 45L77 45C77 38 83 32 90 32C97 32 103 38 103 45L115 45C118 45 120 43 120 40L120 33C120 30 118 27 115 26L88 22C86 18 78 10 70 10L50 10C42 10 34 14 30 18L12 28C10 30 10 33 10 35L10 40C10 43 12 45 15 45Z" fill="url(#sedanGrad)" stroke="rgba(79,70,229,0.3)" strokeWidth="1" />
            <circle cx="40" cy="45" r="7" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="40" cy="45" r="3" fill="#64748B" />
            <circle cx="90" cy="45" r="7" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="90" cy="45" r="3" fill="#64748B" />
            <path d="M35 18L50 10L70 10L85 18Z" fill="rgba(79,70,229,0.15)" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5" />
            <defs>
                <linearGradient id="sedanGrad" x1="10" y1="10" x2="120" y2="45">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
                </linearGradient>
            </defs>
        </svg>
    ),
    SUV: () => (
        <svg viewBox="0 0 130 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="car-icon-svg">
            <path d="M15 50C15 50 22 50 27 50C27 42 33 36 40 36C47 36 53 42 53 50L77 50C77 42 83 36 90 36C97 36 103 42 103 50L115 50C118 50 120 48 120 45L120 30C120 26 118 23 115 22L90 16C88 12 80 5 72 5L48 5C40 5 32 10 28 14L12 24C10 26 10 30 10 32L10 45C10 48 12 50 15 50Z" fill="url(#suvGrad)" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
            <circle cx="40" cy="50" r="8" fill="#334155" stroke="#94A3B8" strokeWidth="2.5" />
            <circle cx="40" cy="50" r="3.5" fill="#64748B" />
            <circle cx="90" cy="50" r="8" fill="#334155" stroke="#94A3B8" strokeWidth="2.5" />
            <circle cx="90" cy="50" r="3.5" fill="#64748B" />
            <path d="M33 14L48 5L72 5L85 14Z" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" />
            <line x1="60" y1="5" x2="60" y2="14" stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" />
            <defs>
                <linearGradient id="suvGrad" x1="10" y1="5" x2="120" y2="50">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.35" />
                </linearGradient>
            </defs>
        </svg>
    ),
    Premium: () => (
        <svg viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="car-icon-svg">
            <path d="M18 45C18 45 25 45 30 45C30 38 36 32 43 32C50 32 56 38 56 45L84 45C84 38 90 32 97 32C104 32 110 38 110 45L122 45C125 45 128 43 128 40L128 32C128 28 126 25 122 24L95 19C93 15 84 8 75 8L55 8C46 8 37 12 33 16L14 26C11 28 10 32 10 35L10 40C10 43 13 45 18 45Z" fill="url(#premGrad)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
            <circle cx="43" cy="45" r="7" fill="#334155" stroke="#D4A574" strokeWidth="2" />
            <circle cx="43" cy="45" r="3" fill="#B8860B" />
            <circle cx="97" cy="45" r="7" fill="#334155" stroke="#D4A574" strokeWidth="2" />
            <circle cx="97" cy="45" r="3" fill="#B8860B" />
            <path d="M38 16L55 8L75 8L90 16Z" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.2)" strokeWidth="0.5" />
            <defs>
                <linearGradient id="premGrad" x1="10" y1="8" x2="128" y2="45">
                    <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.35" />
                </linearGradient>
            </defs>
        </svg>
    ),
    Economy: () => (
        <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="car-icon-svg">
            <path d="M15 45C15 45 20 45 25 45C25 38 31 32 38 32C45 32 51 38 51 45L70 45C70 38 76 32 83 32C90 32 96 38 96 45L105 45C108 45 110 43 110 40L110 35C110 32 108 28 105 27L80 20C78 18 72 12 65 10L40 10C35 10 28 15 25 18L12 28C10 30 10 33 10 35L10 40C10 43 12 45 15 45Z" fill="url(#econGrad)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
            <circle cx="38" cy="45" r="7" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="38" cy="45" r="3" fill="#64748B" />
            <circle cx="83" cy="45" r="7" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="83" cy="45" r="3" fill="#64748B" />
            <path d="M30 18L42 10L65 10L75 18Z" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.5" />
            <defs>
                <linearGradient id="econGrad" x1="10" y1="10" x2="110" y2="45">
                    <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.35" />
                </linearGradient>
            </defs>
        </svg>
    ),
};

const CarTypeIcon = ({ category = 'Economy' }) => {
    const Icon = CarIcons[category] || CarIcons.Economy;
    return (
        <div className="car-type-icon">
            <Icon />
        </div>
    );
};

export default CarTypeIcon;
export { CarIcons };
