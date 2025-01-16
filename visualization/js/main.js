(() => {
    let simStartDate = new Date('January 8, 2025 17:24:00');
    let worldWindow = {};
    let pathsLayer = {};
    let lastDrawnPathPointIndex = -1;
    let pathPositions = [];
    let startTimeMillis = 0;

    function setupWorldWindow() {
        worldWindow = new WorldWind.WorldWindow("earthViewCanvas");
        worldWindow.addLayer(new WorldWind.BMNGOneImageLayer());
        worldWindow.addLayer(new WorldWind.CoordinatesDisplayLayer(worldWindow));
    
        let starFieldLayer = new WorldWind.StarFieldLayer();
        let atmosphereLayer = new WorldWind.AtmosphereLayer();
        worldWindow.addLayer(starFieldLayer);
        worldWindow.addLayer(atmosphereLayer);

        // Add a layer for the rocket trajectory to the the WorldWindow's layer list
        pathsLayer = new WorldWind.RenderableLayer();
        pathsLayer.displayName = "Paths";
        worldWindow.addLayer(pathsLayer);
    
        // Adjust the Navigator to place Sofia, Bulgaria in the center of the
        // WorldWindow
        worldWindow.navigator.lookAtLocation.latitude = 42.7339;
        worldWindow.navigator.lookAtLocation.longitude = 25.4858;
        worldWindow.navigator.range = 8e6; // 8 million meters above the ground
    }
    
    function addLaunchLocationLayer() {
        let placemarkLayer = new WorldWind.RenderableLayer("Placemark");
        worldWindow.addLayer(placemarkLayer);
    
        // Mark Launch Point
        let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 1.0);
    
        let position = new WorldWind.Position(42.7339, 25.4858, 100.0);
        let placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
        placemark.label = "Launch point\n" +
            "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
            "Lon " + placemark.position.longitude.toPrecision(5).toString();
        placemark.alwaysOnTop = true;
        placemarkLayer.addRenderable(placemark);
    }

    function updateRocketPath(points) {
        let wwdPoints = [];
        points.forEach((pos) => {
            wwdPoints.push(new WorldWind.Position(pos[1], pos[2], pos[3]));
        });

        // Create the path
        let path = new WorldWind.Path(wwdPoints, null);
        path.altitudeMode = WorldWind.ABSOLUTE;
        path.followTerrain = true;
        path.extrude = true; // Make it a curtain
        path.useSurfaceShapeFor2D = true; // Use a surface shape in 2D mode
    
        // Create and assign the path's attributes
        let pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.RED;
        pathAttributes.interiorColor = WorldWind.Color.TRANSPARENT;
        pathAttributes.drawVerticals = false;
        path.attributes = pathAttributes;
    
        pathsLayer.addRenderable(path);
    }

    function addRocketPathPoints(rocketPathPoints) {
        pathPositions = rocketPathPoints;
    
        // Create the path
        if (pathPositions.length > 0 && lastDrawnPathPointIndex < pathPositions.length) {
            updateRocketPath([pathPositions[++lastDrawnPathPointIndex]]);
        }

        runAnimation();
    }
    
    function addRocketPathLayer() {
        // Read from file and add position points
        readValuesFromCSV('input/rocket-path-geodetic.csv', addRocketPathPoints);
    }

    function advanceAnimation() {
        // Compute the number of simulated days (or fractions of a day) since the simulation began
        let elapsedTimeMillis = Date.now() - startTimeMillis;
        let simulatedDays = elapsedTimeMillis / simulatedMillisPerDay;

        // Compute a real date in the future given the simulated number of days.
        let millisPerDay = 24 * 3600 * 1000; // 24 hours/day * 3600 seconds/hour * 1000 milliseconds/second
        let simulatedMillis = simulatedDays * millisPerDay;

        // Update the date in all layers
        if (lastDrawnPathPointIndex < pathPositions.length) {
            let nextTimeDelta = pathPositions[lastDrawnPathPointIndex][0];
            if (simulatedMillis >= nextTimeDelta) {
                pathsLayer.removeAllRenderables();
                updateRocketPath(pathPositions.slice(0, lastDrawnPathPointIndex + 1));
                lastDrawnPathPointIndex += 1;
            }
        }
            
        worldWindow.layers.forEach((layer) => {
            layer.time = new Date(simStartDate.valueOf() + elapsedTimeMillis);
        });
        worldWindow.redraw(); // Update the WorldWindow scene

        requestAnimationFrame(advanceAnimation);
    }
    
    function runAnimation() {
        // Set a date property for all layers to the current date and time.
        // This enables the Atmosphere layer to show a night side (and dusk/dawn effects in Earth's terminator).
        // The StarField layer positions its stars according to this date.
        worldWindow.layers.forEach((layer) => {
            layer.time = simStartDate;
        });
    
        // In this example, each full day/night cycle lasts 1 hour in real time
        simulatedMillisPerDay = 36000000;
    
        // Begin the simulation at the current time as provided by the browser
        startTimeMillis = Date.now();
    
        // Animate the starry sky as well as the globe's day/night cycle
        requestAnimationFrame(advanceAnimation);
    }

    setupWorldWindow();
    addLaunchLocationLayer();
    addRocketPathLayer();
})();
