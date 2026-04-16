const { useState, useEffect, useRef, useCallback, useMemo } = React;
//https://reactbits.dev/components/profile-card?enableMobileTilt=true 
const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));

// --- Profile Card Component ---
const ProfileCard = ({ name, title, handle, avatarUrl, status, contactText }) => {
    const wrapRef = useRef(null);
    const shellRef = useRef(null);

    const tiltEngine = useMemo(() => {
        let rafId = null, running = false, currentX = 0, currentY = 0, targetX = 0, targetY = 0;
        const setVars = (x, y) => {
            if (!shellRef.current || !wrapRef.current) return;
            const width = shellRef.current.clientWidth || 1;
            const height = shellRef.current.clientHeight || 1;
            const px = clamp((100 / width) * x);
            const py = clamp((100 / height) * y);
            wrapRef.current.style.setProperty('--pointer-x', `${px}%`);
            wrapRef.current.style.setProperty('--pointer-y', `${py}%`);
            wrapRef.current.style.setProperty('--rotate-x', `${round(-(px - 50) / 5)}deg`);
            wrapRef.current.style.setProperty('--rotate-y', `${round((py - 50) / 4)}deg`);
        };
        const step = () => {
            currentX += (targetX - currentX) * 0.14;
            currentY += (targetY - currentY) * 0.14;
            setVars(currentX, currentY);
            rafId = requestAnimationFrame(step);
        };
        return {
            setTarget(x, y) { targetX = x; targetY = y; if(!running){ running=true; step(); }},
            toCenter() { if(shellRef.current) this.setTarget(shellRef.current.clientWidth/2, shellRef.current.clientHeight/2); },
            cancel() { cancelAnimationFrame(rafId); running = false; }
        };
    }, []);

    useEffect(() => {
        const shell = shellRef.current;
        const onMove = (e) => {
            const rect = shell.getBoundingClientRect();
            tiltEngine.setTarget(e.clientX - rect.left, e.clientY - rect.top);
        };
        shell.addEventListener('pointermove', onMove);
        shell.addEventListener('pointerleave', () => tiltEngine.toCenter());
        return () => {
            shell.removeEventListener('pointermove', onMove);
            tiltEngine.cancel();
        };
    }, [tiltEngine]);

    return ( //Change Color
        <div ref={wrapRef} className="pc-card-wrapper active">
            <div className="pc-behind" />
            <div ref={shellRef} className="pc-card-shell">
                <section className="pc-card">
                    <div className="pc-inside" style={{background: 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)'}}> 
                        <div className="pc-shine" />
                        <div className="pc-glare" />
                        <div className="pc-content pc-avatar-content">
                            <img className="avatar" src={avatarUrl} alt="avatar" />
                            <div className="pc-user-info">
                                <div className="pc-user-text">
                                    <div className="pc-handle">@{handle}</div>
                                    <div className="pc-status">{status}</div>
                                </div>
                                <button className="pc-contact-btn">{contactText}</button>
                            </div>
                        </div>
                        <div className="pc-content">
                            <div className="pc-details">
                                <h3>{name}</h3>
                                <p>{title}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

// --- Main Application ---
function App() { //ADD  AIRTABLE CODE + DATA HERE
    return (
        <div className="row g-4 justify-content-center">
            <div className="col-md-4">
                <ProfileCard //CHANGE THIS 
                    name="First Last Name" 
                    title="Dream Position" 
                    handle="Github/LinkedIn" 
                    status="Hobbies" 
                    contactText="See More" 
                    avatarUrl="https://i.pravatar.cc/300"  
                />
            </div>
        </div>
    );
}

// --- To HTML ---
const container = document.getElementById("student-directory");
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
} 

//-- Calling functions --
const root = ReactDOM.createRoot(container);
root.render(<App />);