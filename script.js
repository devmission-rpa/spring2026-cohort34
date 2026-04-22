"use strict"; //Strict Mode
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("student-directory");

    async function getAllRecords() {
        const options = {
            method: "GET",
            headers: { "Authorization": `Bearer patUNR9zih8lRzsj6.9746de26cc7d3ddf1ca83d7766c8a76ccc9b09c61954e51f26dcb18bb946ad4a` },
        };

  try {
    const response = await fetch(`https://api.airtable.com/v0/app3knV6H85zkGHHn/Trainees?returnFieldsByFieldId=true`, options);
    const data = await response.json();

    container.innerHTML = ""; // Clear loader

    data.records.forEach(record => {
      const f = record.fields;

    const frontImg = f["fldtJw6nMs2ZhJRed"]?.[0]?.url || '';
    const backImg = f["fldAXYRM90vSQ9oKj"]?.[0]?.url || frontImg;

const traineeCard = `
  <div class="traineeCard card" id="${record.id}" style="--bg-front: url('${frontImg}'); --bg-back: url('${backImg}');">
    <div class="pc-back-image"></div>
    
    <div class="pc-header">
        <h2 class="pc-name">${f["fldO6doY1XxTCDMmR"] || 'Name'}</h2>
        <p class="pc-title">${f["fldl9ieMG8OPVN6kc"] || 'Dream Job'}</p>
    </div>

    <div class="pc-glass-footer">
        <div class="pc-user-meta">
            <div class="pc-text">
                <p class="pc-handle">@${f["fldPqcWtWa9DghlIp"]}</p>
                <p class="pc-status">${f["fldWlo5wuvNv5JOlG"]}</p>
            </div>
        </div>
        <button class="pc-contact-btn">See More</button>
    </div>
  </div>`;
    container.insertAdjacentHTML("beforeend", traineeCard);
});
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    // --- INTERACTION ENGINE ---
    document.addEventListener("mousemove", (e) => {
        const card = e.target.closest('.traineeCard.card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const l = e.clientX - rect.left;
        const t = e.clientY - rect.top;

        const px = Math.abs(Math.floor((100 / w) * l) - 100);
        const py = Math.abs(Math.floor((100 / h) * t) - 100);
        const pa = (50 - px) + (50 - py);
        
        const lp = (50 + (px - 50) / 1.5);
        const tp = (50 + (py - 50) / 1.5);
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
        const card = e.target.closest('.traineeCard.card');
        if (!card) return;

        card.style.setProperty("--ty", "0deg");
        card.style.setProperty("--tx", "0deg");
        card.style.setProperty("--opc", "0");
    });

    // Run
    getAllRecords();
});