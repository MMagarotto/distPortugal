var map = L.map('map').setView([39.5, -8], 8);  // Ajuste o zoom inicial conforme necessário

// Adicione o serviço WMS da OpenStreetMap como camada base
var osmLayer = L.tileLayer.wms('https://ows.terrestris.de/osm/service', {
    layers: 'OSM-WMS',
    format: 'image/png',
    transparent: true
}).addTo(map);

// Adicione os distritos de Portugal a partir do GeoJSON fornecido pela URL
fetch('https://public.opendatasoft.com/explore/dataset/georef-portugal-distrito/download/?format=geojson')
    .then(response => response.json())
    .then(data => {
        var distritosLayer;

        function highlightFeature(e) {
            if (distritosLayer) {
                resetHighlight(distritosLayer);
            }

            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            distritosLayer = layer;
        }

        function resetHighlight(layer) {
            layer.setStyle({
                weight: 2,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            });
        }

        distritosLayer = L.geoJSON(data, {
            style: function (feature) {
                // Gerar uma cor aleatória para cada distrito
                var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                
                return {
                    fillColor: randomColor,
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function (feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: function () {
                        resetHighlight(layer);
                        distritosLayer = null;
                    }
                });

                // Adicione o nome do distrito ao passar o mouse sobre ele
                layer.bindTooltip(feature.properties.dis_name, { permanent: false, direction: 'top' });
            }
        }).addTo(map);
    });
