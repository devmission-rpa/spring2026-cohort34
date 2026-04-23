"use strict";

async function getAllRecords() {
    let getResultElement = document.getElementById("content");

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer patUNR9zih8lRzsj6.9746de26cc7d3ddf1ca83d7766c8a76ccc9b09c61954e51f26dcb18bb946ad4a`,
        },
    };

    await fetch(
        `https://api.airtable.com/v0/app3knV6H85zkGHHn/Instructors`,
        options
    )
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        getResultElement.innerHTML = "";

        let newHtml = "";

        for(let i = 0; i < data.records.length; i++) {
            let photo = data.records[i].fields["Photo"];
            let name = data.records[i].fields["Name"];
            let Description = data.records[i].fields["Description"];

            newHtml += `
            <div class="col-xl-4 cardImageText">
              <div class="card list move border-dark mb-5" style="width: 20rem;">
                <a href="instructors.html?id=${data.records[i].id}">
                  ${
                    photo
                      ? `<img class="card-img-top rounded" alt="${name}" src="${photo[0].url}">`
                      : `<div style="height:200px; background:#eee; display:flex; align-items:center; justify-content:center;">No Photo</div>`
                  }
                </a>
                <div class="card-body">
                  <h5 class="card-title">${name || 'Instructor Name'}</h5>
                  <p class="card-text">${Description || ''}</p>
                </div>
              </div>
            </div>
            `;
        }
        getResultElement.innerHTML = newHtml;
    })
    .catch((err) => {
        console.error("Fetch error:", err);
    });
}

getAllRecords();