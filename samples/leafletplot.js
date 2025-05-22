import("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")

function markerClick(e) {
    const marker = {
        longitude: e.target.getLatLng().lng,
        latitude: e.target.getLatLng().lat,
        popup: e.target.getPopup().getContent()
    }
    model.set({ clickedMarker: marker });
    model.save_changes();
}

function plot(longitude, latitude, zoom, markers) {
    const randomString = Math.floor(
        Math.random() * Date.now() * 10000
    ).toString(36);

    const node = document.createElement("div");
    node.setAttribute("id", "map-" + randomString);
    node.style.width = width + "px";
    node.style.height = height + "px";
    element.appendChild(node);
    const map = L.map("map-" + randomString).setView([longitude, latitude], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    markers.forEach(marker => {
        L.marker([marker.longitude, marker.latitude])
            .on('click', markerClick)
            .addTo(map)
            .bindPopup(marker.popup);
    });
}