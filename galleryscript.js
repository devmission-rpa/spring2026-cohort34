"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const carouselContainer = document.getElementById("carousel-content");
    const gridContainer = document.getElementById("grid-content");

    // Airtable Config
    const apiToken = "patUNR9zih8lRzsj6.9746de26cc7d3ddf1ca83d7766c8a76ccc9b09c61954e51f26dcb18bb946ad4a";
    const baseId = "app3knV6H85zkGHHn";
    const tableName = "Gallery Photos"; 
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    async function loadGallery() {
        try {
            const response = await fetch(url, {
                headers: { "Authorization": `Bearer ${apiToken}` }
            });
            const data = await response.json();
            
            if (!data.records) throw new Error("No records found");

            // placeholders
            carouselContainer.innerHTML = "";
            gridContainer.innerHTML = "";

            data.records.forEach((record, index) => {
                const f = record.fields;
                
                // Matching the column names with screenshot
                const imgUrl = f["Photo"] ? f["Photo"][0].url : "";
                const title = f["Name"] || "Trip Photo";
                const desc = f["Description"] || "";

                if (!imgUrl) return; // Skips if no photo

                // 1. Carousel Slides
                const activeClass = index === 0 ? "active" : "";
                const carouselItem = `
                    <div class="carousel-item ${activeClass}" data-bs-interval="3000">
                        <img src="${imgUrl}" class="d-block w-100" style="height: 500px; object-fit: cover;" alt="${title}">
                        <div class="carousel-caption d-none d-md-block">
                            <h5 style="background: rgba(0,0,0,0.6); display: inline-block; padding: 5px 15px; border-radius: 5px;">
                                ${title}
                            </h5>
                        </div>
                    </div>`;
                carouselContainer.insertAdjacentHTML("beforeend", carouselItem);

                // 2.Grid Items
                const gridItem = `
                    <div class="col-6 col-md-4 col-lg-3">
                        <div class="card h-100 shadow-sm border-0 gallery-card-hover">
                            <img src="${imgUrl}" class="card-img-top" style="height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;" alt="${title}">
                            <div class="card-body p-2 text-center">
                                <p class="card-text mb-0" style="font-weight: 500; font-size: 0.9rem;">${title}</p>
                                <small class="text-muted" style="font-size: 0.75rem;">${desc}</small>
                            </div>
                        </div>
                    </div>`;
                gridContainer.insertAdjacentHTML("beforeend", gridItem);
            });

        } catch (err) {
            console.error("Gallery Load Error:", err);
            gridContainer.innerHTML = `<p class="text-white text-center">Make sure the table name "Gallery Photos" matches Airtable exactly.</p>`;
        }
    }

    loadGallery();
});