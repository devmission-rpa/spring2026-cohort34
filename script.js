const { useState, useEffect, useRef, useCallback, useMemo } = React;
//https://reactbits.dev/components/profile-card?enableMobileTilt=true
const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));

// --- 1. FIELD ID CONSTANTS ---
// This keeps the code clean and easy to read DONT DELETE !!!
const FIELDS = {
  NAME: "fld06doY1XxTCDMmR",
  LINKEDIN: "fldWlo5wuvNv5J0lG",
  GITHUB: "fldPqcWtwa9DghlIp",
  ABOUT_ME_PAGE: "flaltulgqpuM8eUVZ",
  LYRICS: "flde0EgDDoC6GfcLn",
  HOBBIES: "fldyK3zVOFSug2hne",
  ABOUT_ME_TEXT: "fldeZyTeTE9u8DfGM",
  DREAM_JOB: "fldl9ieMG80PVN6kc",
  FAV_TECH: "fldET8nxbx8pljtlm",
  PHOTO_SERIOUS: "fldtJw6nMs2ZhJRed",
  PHOTO_FUNNY: "fldAXYRM90vSQ9oKj",
  RECORD_ID: "fldzjeyk9nLfxeEF1",
  STATUS: "fldZAwfi0D3Zl4I1E",
  WEB_APP: "fldzC67iMUT8MFw7h",
  IOT: "flaZridyjhTryRcsG"
};

// --- 2. Profile Card Component ---
const ProfileCard = ({
  name,
  title,
  handle,
  avatarUrl,
  status,
  contactText,
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);

  const tiltEngine = useMemo(() => {
    let rafId = null,
      running = false,
      currentX = 0,
      currentY = 0,
      targetX = 0,
      targetY = 0;
    const setVars = (x, y) => {
      if (!shellRef.current || !wrapRef.current) return;
      const width = shellRef.current.clientWidth || 1;
      const height = shellRef.current.clientHeight || 1;
      const px = clamp((100 / width) * x);
      const py = clamp((100 / height) * y);
      wrapRef.current.style.setProperty("--pointer-x", `${px}%`);
      wrapRef.current.style.setProperty("--pointer-y", `${py}%`);
      wrapRef.current.style.setProperty(
        "--rotate-x",
        `${round(-(px - 50) / 5)}deg`,
      );
      wrapRef.current.style.setProperty(
        "--rotate-y",
        `${round((py - 50) / 4)}deg`,
      );
    };
    const step = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      setVars(currentX, currentY);
      rafId = requestAnimationFrame(step);
    };
    return {
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        if (!running) {
          running = true;
          step();
        }
      },
      toCenter() {
        if (shellRef.current)
          this.setTarget(
            shellRef.current.clientWidth / 2,
            shellRef.current.clientHeight / 2,
          );
      },
      cancel() {
        cancelAnimationFrame(rafId);
        running = false;
      },
    };
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const onMove = (e) => {
      const rect = shell.getBoundingClientRect();
      tiltEngine.setTarget(e.clientX - rect.left, e.clientY - rect.top);
    };
    shell.addEventListener("pointermove", onMove);
    shell.addEventListener("pointerleave", () => tiltEngine.toCenter());
    return () => {
      shell.removeEventListener("pointermove", onMove);
      tiltEngine.cancel();
    };
  }, [tiltEngine]);

return (
  <div ref={wrapRef} className="pc-card-wrapper active">
    <div className="pc-behind" />
    <div ref={shellRef} className="pc-card-shell">
      <section className="pc-card">
        <div className="pc-inside">
          {/* Background Image Container */}
          <div className="pc-bg-image-container">
            <img className="pc-card-bg" src={avatarUrl} alt={name} />
          </div>

          <div className="pc-shine" />
          <div className="pc-glare" />
          
          <div className="pc-content pc-avatar-content">
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

// --- 3. Main Application ---
function App() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Constants
  const personalAccessToken = "patUNR9zih8lRzsj6.9746de26cc7d3ddf1ca83d7766c8a76ccc9b09c61954e51f26dcb18bb946ad4a"; 
  const baseId = "app3knV6H85zkGHHn";
  const tableName = "Trainees";
  
  // Adding the 'returnFieldsByFieldId' basically makes field ID's function
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?returnFieldsByFieldId=true`;

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${personalAccessToken}` },
        });
        const data = await response.json();
        setTrainees(data.records);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchPlaces();
  }, []);

  if (loading) return <div className="loading" style={{color: "white", textAlign: "center", padding: "50px"}}>Loading Directory...</div>;

  return (
    <div className="row g-4 justify-content-center">
      {trainees.map((record) => {
        const f = record.fields;
        return (
          <div className="col-md-4" key={record.id}>
            <ProfileCard 
              name={f[FIELDS.NAME] || "Anonymous"} 
              title={f[FIELDS.DREAM_JOB] || "Trainee"}
              handle={f[FIELDS.GITHUB] || "N/A"}
              status={f[FIELDS.STATUS] || "Exploring Tech"}
              contactText="View Projects"
              // for Serious Photo
              avatarUrl={f[FIELDS.PHOTO_SERIOUS] ? f[FIELDS.PHOTO_SERIOUS][0].url : "https://i.pravatar.cc/300"}
            />
          </div>
        );
      })}
    </div>
  );
}

// --- 4. Render to HTML ---
const container = document.getElementById("student-directory");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}

// --- CHANGES MADE BY ---->  !!!DANIEL!!! <--- IF ANY QUESTIONS ASK ME --- 