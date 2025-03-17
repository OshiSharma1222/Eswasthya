let map;
let markers = [];
let infoWindow;

function initMap() {
    // Initialize the map centered on user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                map = new google.maps.Map(document.querySelector('.map-view'), {
                    center: pos,
                    zoom: 14,
                    styles: [
                        {
                            "featureType": "all",
                            "elementType": "geometry",
                            "stylers": [{"color": "#242f3e"}]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.stroke",
                            "stylers": [{"lightness": -80}]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels.text.fill",
                            "stylers": [{"color": "#746855"}]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels.text.fill",
                            "stylers": [{"color": "#d59563"}]
                        }
                    ]
                });

                infoWindow = new google.maps.InfoWindow();

                // Add user marker
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#FFFFFF",
                    },
                    title: "Your Location"
                });

                // Search for nearby hospitals
                searchNearbyHospitals(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function searchNearbyHospitals(location) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: location,
        radius: '5000',
        type: ['hospital']
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            results.forEach(place => {
                createHospitalMarker(place);
            });
            updateHospitalList(results);
        }
    });
}

function createHospitalMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        },
        animation: google.maps.Animation.DROP
    });

    markers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(
            {
                placeId: place.place_id,
                fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'rating', 'website']
            },
            (placeDetails, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const content = `
                        <div class="info-window">
                            <h3>${placeDetails.name}</h3>
                            <p>${placeDetails.formatted_address}</p>
                            ${placeDetails.formatted_phone_number ? `<p>📞 ${placeDetails.formatted_phone_number}</p>` : ''}
                            ${placeDetails.rating ? `<p>⭐ ${placeDetails.rating} / 5</p>` : ''}
                            ${placeDetails.opening_hours ? `
                                <p>${placeDetails.opening_hours.isOpen() ? '✅ Open Now' : '❌ Closed'}</p>
                            ` : ''}
                            ${placeDetails.website ? `
                                <a href="${placeDetails.website}" target="_blank" class="website-link">Visit Website</a>
                            ` : ''}
                            <button onclick="showRoute('${place.geometry.location}')" class="route-btn">Get Directions</button>
                        </div>
                    `;
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                }
            }
        );
    });
}

function showRoute(destination) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const directionsService = new google.maps.DirectionsService();
                const directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                    panel: document.querySelector('.directions-panel')
                });

                const request = {
                    origin: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    destination: destination,
                    travelMode: 'DRIVING'
                };

                directionsService.route(request, (result, status) => {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(result);
                    }
                });
            }
        );
    }
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function updateHospitalList(hospitals) {
    const hospitalList = document.querySelector('.hospital-list');
    hospitalList.innerHTML = hospitals.map(hospital => `
        <div class="hospital-card glass-card">
            <h3>${hospital.name}</h3>
            <div class="hospital-info">
                <span>🚶‍♂️ ${(google.maps.geometry.spherical.computeDistanceBetween(
                    map.getCenter(),
                    hospital.geometry.location
                ) / 1000).toFixed(1)} km away</span>
                <span>⭐ ${hospital.rating ? hospital.rating.toFixed(1) : 'N/A'}</span>
                <span>🏥 ${hospital.vicinity}</span>
            </div>
            <button class="route-btn" onclick="showRoute('${hospital.geometry.location}')">Show Route</button>
        </div>
    `).join('');
} 