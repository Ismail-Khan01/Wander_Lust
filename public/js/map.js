mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.5, 13], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 7 // starting zoom
});
