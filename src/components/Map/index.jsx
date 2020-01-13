import React from "react";
import ReactMapboxGl, { GeoJSONLayer, ZoomControl } from "react-mapbox-gl";

import styled from "styled-components";
import { multiPoint } from "@turf/helpers";

// import { Button, Icon } from "semantic-ui-react";
// import { useAppState } from "./../../context/app";
// import VesselGeojson from "./VesselGeojson";

const MapWrapper = styled.div`
  position: relative;
  height: ${props => props.height}px;
`;

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiY3JlaW1lcnMiLCJhIjoiY2pveWlmZ3ZnMmMydTNzbnJlZHZjcjR5cSJ9.p-VEld9_5rCSdqy-C3Y2Rg"
});

const TheMap = ({ height, center, bearing, zoom, markers }) => {
  const points = markers.map(m => [m.location.longitude, m.location.latitude]);
  const geojsonPoints = multiPoint(points, {
    circleColor: "red",
    circleRadius: 10
  });
  console.log(geojsonPoints);
  if (height > 0) {
    return (
      <MapWrapper height={height}>
        <Map
          style="mapbox://styles/mapbox/streets-v8"
          containerStyle={{
            height: `${height}px`
          }}
          center={center}
          bearing={bearing}
          zoom={[zoom || 13]}
        >
          <GeoJSONLayer
            data={geojsonPoints}
            fillPaint={{
              "fill-color": ["get", "color"]
            }}
            circlePaint={{
              "circle-color": ["get", "circleColor"],
              "circle-radius": ["get", "circleRadius"]
            }}
          />
          <ZoomControl position="top-left" className="mapbox-zoom" />
        </Map>
      </MapWrapper>
    );
  }
  return null;
};

export default TheMap;
