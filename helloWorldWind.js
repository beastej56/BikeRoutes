

var defaultLat  ;
var defaultLong;
var defaultEye  ;

var geocoder;
var goToAnimator ;

function drawMap () {
// Create a WorldWindow for the canvas.
wwd = new WorldWind.WorldWindow("canvasOne");

this.defaultLat = wwd.navigator.lookAtLocation.latitude ;
this.defaultLong = wwd.navigator.lookAtLocation.longitude;
this.defaultEye = wwd.navigator.range ;

this.geocoder = new WorldWind.NominatimGeocoder();
this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);

//wwd.addLayer(new WorldWind.OpenStreetMapImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());
//wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer(null));

//wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));


// Add WMS imagery
//var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
var serviceAddress = "https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WMSServer?request=GetCapabilities&service=WMS"
var layerName = "SEDAC_POP";
layerName ="States"

var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
   var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
   wwd.addLayer(wmsLayer);

   //var wms = new WorldWind.WmsCapabilities(xmlDom);
   //var wmsLayerCapabilities = wms.getNamedLayer("Counties");
  // var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
   //var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
  //wwd.addLayer(wmsLayer);
};

        // Callback function for configuring shapefile visualization.
        var shapeConfigurationCallback = function (attributes, record) {
            var configuration = {};
            configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

            if (record.isPointType()) { // Configure point-based features (cities, in this example)
                configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                if (attributes.values.pop_max) {
                    var population = attributes.values.pop_max;
                    configuration.attributes.imageScale = 0.01 * Math.log(population);
                }
            } else if (record.isPolygonType()) { // Configure polygon-based features (countries, in this example).
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                // Fill the polygon with a random pastel color.
                configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    1.0);

                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0);
            }

            return configuration;
        };

        //bike routes
        var worldLayer = new WorldWind.RenderableLayer("bikeroutes");
        var worldShapefile = new WorldWind.Shapefile("./lvbike/Jefferson_County_KY_Bikeways.shp");
        
        worldShapefile.load(null, shapeConfigurationCallback, worldLayer);
       wwd.addLayer(worldLayer);

       //ny bike
       var worldLayer2 = new WorldWind.RenderableLayer("nybikeroutes");
       var worldShapefile2 = new WorldWind.Shapefile("./nybike/geo_export_4e77659e-0385-4c28-a54d-17d360aa08a8.shp");
       
       worldShapefile2.load(null, shapeConfigurationCallback, worldLayer2);
      wwd.addLayer(worldLayer2);
       
       //chicago bike
       var worldLayer3 = new WorldWind.RenderableLayer("chicagobikeroutes");
       var worldShapefile3 = new WorldWind.Shapefile("./chicagobike/geo_export_3e8cce16-bb94-4277-bee3-e5633dc4ee40.shp");
       
       worldShapefile3.load(null, shapeConfigurationCallback, worldLayer3);
      wwd.addLayer(worldLayer3);

      //cabike
      var worldLayer4 = new WorldWind.RenderableLayer("cabikeroutes");
      var worldShapefile4 = new WorldWind.Shapefile("./cabike/0295ad1b-b8a6-4c01-a548-054415a85a702020329-1-qbdfl.egdpge.shp");
      
      worldShapefile4.load(null, shapeConfigurationCallback, worldLayer4);
     wwd.addLayer(worldLayer4);

           //marylandbike
           var worldLayer5 = new WorldWind.RenderableLayer("marylandbikeroutes");
           var worldShapefile5 = new WorldWind.Shapefile("./marylandBike/geo_export_74680c0a-c7a0-4ea8-92e6-1ef451ce8024.shp");
           
           worldShapefile5.load(null, shapeConfigurationCallback, worldLayer5);
          wwd.addLayer(worldLayer5);
          //Austin,TX
          var worldLayer6 = new WorldWind.RenderableLayer("Austinbikeroutes");
          var worldShapefile6 = new WorldWind.Shapefile("./austinBike/geo_export_a38e975d-9c74-48c4-b85d-7bf596178e72.shp");
          
          worldShapefile6.load(null, shapeConfigurationCallback, worldLayer6);
         wwd.addLayer(worldLayer6);
        

        //geojson
                var shapeConfigurationCallback = function (geometry, properties) {
            var configuration = {};

            if (geometry.isPointType() || geometry.isMultiPointType()) {
                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                if (properties && (properties.name || properties.Name || properties.NAME)) {
                    configuration.name = properties.name || properties.Name || properties.NAME;
                }
                if (properties && properties.POP_MAX) {
                    var population = properties.POP_MAX;
                    configuration.attributes.imageScale = 0.01 * Math.log(population);
                }
            }
            else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);
                configuration.attributes.drawOutline = true;
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.1 * configuration.attributes.interiorColor.red,
                    0.3 * configuration.attributes.interiorColor.green,
                    0.7 * configuration.attributes.interiorColor.blue,
                    1.0);
                configuration.attributes.outlineWidth = 2.0;
            }
            else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                // Fill the polygon with a random pastel color.
                configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.5);
                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0);
            }

            return configuration;
        };
        var featureLayer = new WorldWind.RenderableLayer("nybike");
       // var featureGeoJSON = new WorldWind.GeoJSONParser("./nybike/geo_export_c9614886-23c1-41e4-9d1b-d9e04da5cb4d.shp");
        //featureGeoJSON.load(null, shapeConfigurationCallback, featureLayer);
        //wwd.addLayer(featureLayer);

        
var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " +
        text +
    " exception: " + exception);
};

$.get(serviceAddress).done(createLayer).fail(logError);

};


function handleClick(radioButton) {
    //var goToAnimator = new WorldWind.GoToAnimator(this.wwd);
    if (radioButton.value === "all") {
        this.goToAnimator.goTo(new WorldWind.Position(this.defaultLat, this.defaultLong, this.defaultEye));
    }
    else if (radioButton.value === "california"){

goToAnimator.goTo(new WorldWind.Position(37.8272, -122.29, 118000));
    }
    else if (radioButton.value === "chicago"){

        this.goToAnimator.goTo(new WorldWind.Position(41.8781, -87.6298, 82000));
            
    }

    else if (radioButton.value === "lv"){

        this. goToAnimator.goTo(new WorldWind.Position(38.2527, -85.7585, 62000));
                   
    }
    else if (radioButton.value === "ny"){

        this.goToAnimator.goTo(new WorldWind.Position(40.7128, -74.0060, 77000));
     }
     else if (radioButton.value === "maryland"){

        this.goToAnimator.goTo(new WorldWind.Position(39.1058, -77.1713, 77000));
     }
     else if (radioButton.value === "austin"){

        this.goToAnimator.goTo(new WorldWind.Position(30.2672, -97.7431, 77000));
     }
};

function handleButtonClick () {

    var queryString = document.getElementById("searchText").value;
    if (queryString) {

            var latitude;
            var longitude;

        if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
            var tokens = queryString.split(",");
            latitude = parseFloat(tokens[0]);
            longitude = parseFloat(tokens[1]);
            this.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
        } else {
            this.geocoder.lookup(queryString, function (geocoder, result) {
                if (result.length > 0) {
                    latitude = parseFloat(result[0].lat);
                    longitude = parseFloat(result[0].lon);

                    WorldWind.Logger.log(
                        WorldWind.Logger.LEVEL_INFO, queryString + ": " + latitude + ", " + longitude);

                    this.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                }
            });
        }
    }
};
