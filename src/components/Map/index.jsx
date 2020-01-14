import React from "react";
import ReactMapboxGl, { GeoJSONLayer, ZoomControl } from "react-mapbox-gl";

import styled from "styled-components";
import { multiPoint, point } from "@turf/helpers";

const MapWrapper = styled.div`
  position: relative;
  height: ${props => props.height}px;
`;

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiY3JlaW1lcnMiLCJhIjoiY2s1ZHA3aHByMGRsbTNtczBsaG9veDFjNCJ9.DwojAPJkDcYeVF5E-d2Ndg"
});

const TheMap = ({ height, center, bearing, zoom, markers }) => {
  const points = markers.map(m => [m.location.longitude, m.location.latitude]);
  const geojsonPoints = multiPoint(points, {
    circleColor: "red",
    circleRadius: 10
  });
  const cameraPoint = point(center, {
    circleColor: "blue",
    circleRadius: 10
  });
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
          <GeoJSONLayer
            data={cameraPoint}
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
