
	mapboxgl.accessToken = mapToken ;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12" , // style url
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    // const coordinate = [77.2090, 28.6139]; // Example coordinates for Delhi

    // Add the marker
    const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates, ) // Correct format as an array
        .setPopup(new mapboxgl.Popup({offset : 25 , className: 'my-class'})
        .setHTML(
            `<h4>${listing.title}</h4><p>Exact location will be provided after booking. </p>`
        ))
        .addTo(map);
