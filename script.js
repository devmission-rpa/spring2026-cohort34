"use strict"; //Strict Mode
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("student-directory");

  async function getAllRecords() {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer patUNR9zih8lRzsj6.9746de26cc7d3ddf1ca83d7766c8a76ccc9b09c61954e51f26dcb18bb946ad4a`,
      },
    };

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/app3knV6H85zkGHHn/Trainees?returnFieldsByFieldId=true`,
        options,
      );
      const data = await response.json();

      container.innerHTML = ""; // Clear loader

      data.records.forEach((record) => {
        const f = record.fields;

        const frontImg = f["fldtJw6nMs2ZhJRed"]?.[0]?.url || "";
        const backImg = f["fldAXYRM90vSQ9oKj"]?.[0]?.url || frontImg;

        // CRITICAL FIX: Escape single quotes in the data string to prevent HTML crashes
        const safeData = JSON.stringify(f).replace(/'/g, "&apos;");

        const traineeCard = `
                <div class="traineeCard card" id="${record.id}" onclick='openDetail(${safeData})' style="--bg-front: url('${frontImg}'); --bg-back: url('${backImg}');">
                    <div class="pc-back-image"></div>
                    
                    <button class="pc-contact-btn"  style="border:none; background:none; padding:0; width:100%; text-align:left; cursor:pointer;">
                        <div class="pc-glass-footer">
                            <div class="pc-user-meta">
                                <h2 class="pc-name">${f["fldO6doY1XxTCDMmR"] || "Name"}</h2>
                                <p class="pc-title">${f["fldl9ieMG8OPVN6kc"] || "Dream Job"}</p>
                            </div>
                        </div>
                    </button>
                </div>`;
        container.insertAdjacentHTML("beforeend", traineeCard);
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // --- INTERACTION ENGINE ---
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".traineeCard.card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const l = e.clientX - rect.left;
    const t = e.clientY - rect.top;

    const px = Math.abs(Math.floor((100 / w) * l) - 100);
    const py = Math.abs(Math.floor((100 / h) * t) - 100);
    const pa = 50 - px + (50 - py);

    const lp = 50 + (px - 50) / 1.5;
    const tp = 50 + (py - 50) / 1.5;
    const ty = ((tp - 50) / 2) * -1;
    const tx = ((lp - 50) / 1.5) * 0.5;
    const opc = (20 + Math.abs(pa) * 1.5) / 100;

    card.style.setProperty("--ty", `${ty}deg`);
    card.style.setProperty("--tx", `${tx}deg`);
    card.style.setProperty("--lp", `${lp}%`);
    card.style.setProperty("--tp", `${tp}%`);
    card.style.setProperty("--opc", opc);
  });

  document.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".traineeCard.card");
    if (!card) return;

    card.style.setProperty("--ty", "0deg");
    card.style.setProperty("--tx", "0deg");
    card.style.setProperty("--opc", "0");
  });

  getAllRecords();
});

/* --- DETAIL VIEW LOGIC --- */
const fields = {
  name: "fldO6doY1XxTCDMmR",
  linkedin: "fldWlo5wuvNv5JOlG",
  github: "fldPqcWtWa9DghlIp",
  aboutMePage: "fldLtulGqpuM8eUVZ",
  lyrics: "fldeOEgDDoC6GfcLn",
  hobbies: "fldyK3zVOFSug2hne",
  aboutBio: "fldeZyTeTE9u8DfGM",
  dreamJob: "fldl9ieMG8OPVN6kc",
  favTech: "fldET8nxbx8pljtlm",
  photo1: "fldtJw6nMs2ZhJRed",
  webApp: "fldzC67iMUT8MFw7h",
};

// Functions are attached to 'window' to ensure the HTML onclick can access them
window.openDetail = function (data) {
  document.getElementById("modal-name").innerText = data[fields.name] || "---";
  document.getElementById("modal-dream").innerText =
    data[fields.dreamJob] || "Dream Job";

  document.getElementById("f-tech").innerText = data[fields.favTech] || "---";
  document.getElementById("f-hobbies").innerText =
    data[fields.hobbies] || "---";
  document.getElementById("f-about").innerText = data[fields.aboutBio] || "---";

  const funnyImg = data[fields.photo1]
    ? data[fields.photo1][0].url
    : "https://via.placeholder.com/300x400";
  document.getElementById("modal-img").style.backgroundImage =
    `url('${funnyImg}')`;

  document.getElementById("link-linkedin").href = data[fields.linkedin] || "#";
  document.getElementById("link-github").href = data[fields.github] || "#";

  setupBtn("link-aboutme", "img-aboutme", data[fields.aboutMePage]);
  setupBtn("link-lyrics", "img-lyrics", data[fields.lyrics]);
  setupBtn("link-webapp", "img-webapp", data[fields.webApp]);

  document.getElementById("detail-view").style.display = "block";
};

window.setupBtn = function (linkId, imgId, url) {
  const link = document.getElementById(linkId);
  if (link) link.href = url || "#";
  const imgDiv = document.getElementById(imgId);
  if (imgDiv) {
    imgDiv.style.backgroundImage = url
      ? `url('https://picsum.photos/200/100?random=${Math.random()}')`
      : "none";
  }
};

window.closeDetail = function () {
  document.getElementById("detail-view").style.display = "none";
};
window.addEventListener("click", (e) => {
  const modal = document.getElementById("detail-view");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
