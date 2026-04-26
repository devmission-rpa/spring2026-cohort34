"use strict"; // Strict Mode

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("instructor-cards");

    async function getAllRecords() {
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer patUNR9zih8lRzsj6.9746de26cc7d3ddf1ca83d7766c8a76ccc9b09c61954e51f26dcb18bb946ad4a`,
            },
        };

        try {
            const response = await fetch(
                `https://api.airtable.com/v0/app3knV6H85zkGHHn/Instructors`,
                options
            );
            const data = await response.json();

            container.innerHTML = ""; // Clear loader

            data.records.forEach(record => {
                const f = record.fields;

                const frontImg = f["Photo"]?.[0]?.url || "";
                // Instructors may only have one photo; use same image for front and back
                const backImg = frontImg;

                // Escape single quotes to prevent HTML injection crashes
                const safeData = JSON.stringify(f).replace(/'/g, "&apos;");

                const instructorCard = `
                <div class="traineeCard card" id="${record.id}" onclick='openDetail(${safeData})' style="--bg-front: url('${frontImg}'); --bg-back: url('${backImg}');">
                    <div class="pc-back-image"></div>

                    <button class="pc-contact-btn" style="border:none; background:none; padding:0; width:100%; text-align:left; cursor:pointer;">
                        <div class="pc-glass-footer">
                            <div class="pc-user-meta">
                                <h2 class="pc-name">${f["Name"] || "Instructor"}</h2>
                                <p class="pc-title">${f["Role"] || f["Description"] || "Instructor"}</p>
                            </div>
                        </div>
                    </button>
                </div>`;

                container.insertAdjacentHTML("beforeend", instructorCard);
            });

        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    // --- INTERACTION ENGINE (matches directory hover/tilt behavior) ---
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
        const card = e.target.closest(".traineeCard.card");
        if (!card) return;

        card.style.setProperty("--ty", "0deg");
        card.style.setProperty("--tx", "0deg");
        card.style.setProperty("--opc", "0");
    });

    getAllRecords();
});

/* --- DETAIL VIEW LOGIC --- */

// Airtable field names for Instructors table
const instructorFields = {
    name: "Name",
    photo: "Photo",
    // add more goofy photos
    goofyphoto: "Goofyphoto",
    description: "Description",
    role: "Role",
    linkedIn: "LinkedIn",
};

window.openDetail = function (data) {
    document.getElementById("modal-name").innerText = data[instructorFields.name] || "---";
    document.getElementById("modal-role").innerText = data[instructorFields.role] || "---";
    document.getElementById("f-description").innerText = data[instructorFields.description] || "---";
    
    const photoUrl = data[instructorFields.photo]
        ? data[instructorFields.goofyphoto][0].url
        : "https://via.placeholder.com/300x400";
    document.getElementById("modal-img").style.backgroundImage = `url('${photoUrl}')`;

    const linkedinLink = document.getElementById("link-linkedin");
    if (linkedinLink) linkedinLink.href = data[instructorFields.linkedIn] || "---";

    document.getElementById("detail-view").style.display = "block";
};

window.closeDetail = function () {
    document.getElementById("detail-view").style.display = "none";
};