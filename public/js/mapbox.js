



export const displayMap = (locations) =>{

  mapboxgl.accessToken = 'pk.eyJ1IjoiYWhtZWQ3b3NzYW0iLCJhIjoiY2xpNG95enBlMThjazN2bHB6eHVocHppZCJ9.3DuW5t8Jlrn3jwpikLVF3A';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ahmed7ossam/cli4u2all02nx01qu4zcvf8it',
    scrollZoom : false,
    // center :[-118.113491 ,34.111745],
    zoom : 10
  });

  const bounds = new mapboxgl.LngLatBounds();


// every location will contain this features
  locations.forEach(loc =>{
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element : el,
      anchor :'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // Add popup

    new mapboxgl
      .Popup({
        offset: 30
      })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding:{
      top:200,
      bottom : 150,
      left: 100,
      right : 100,
    },

  });
}
