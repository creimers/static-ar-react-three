import React from "react";

import styled from "styled-components";

import ARScene from "./components/ARScene";
import TheMap from "./components/Map";

const AppWrapper = styled.div`
  height: 100vh;
  background: white;
  display: flex;
`;

const OneHalf = styled.div`
  flex: 1;
  height: 100vh;
`;

const Legend = styled.div`
  padding: 0rem 1rem;
`;

const CAMERA_HEADING = 110; // == heading in ar.js


const CAMERA = {
  location: {
    latitude: 49.75649,
    longitude: 6.6422
  }
};

const TARGETS = [
  {
    id: "Trierer Dom",
    location: {
      latitude: 49.75632,
      longitude: 6.64299
    }
  },
  {
    id: "No. 4",
    location: {
      latitude: 49.75659,
      longitude: 6.64312
    }
  },
  {
    id: "Well",
    location: {
      latitude: 49.75614,
      longitude: 6.64261
    }
  }
];

function App() {
  return (
    <AppWrapper>
      <OneHalf>
        <Legend>
          <h3>AR overlay</h3>
          <p>
            The <strong>objective</strong> is to create a static AR overlay on
            top of the image.
          </p>
          <p>
            The <strong>challenge</strong> is to get the camera and scene
            configuration right.
          </p>
          <p>
            The three.js boxes should be matching their "real life" objects.
          </p>
          <p>From left to right, these are:</p>
          <ul>
            <li>The corner of white house left of the church</li>
            <li>The center of the church</li>
            <li>The little blue fountain at the right edge of the image</li>
          </ul>
          <p>On the map, the blue dot represents the position of the camera.</p>
        </Legend>
        <ARScene
          targets={TARGETS}
          cameraProps={CAMERA}
          heading={CAMERA_HEADING}
        />
      </OneHalf>
      <OneHalf>
        <TheMap
          center={[CAMERA.location.longitude, CAMERA.location.latitude]}
          bearing={[CAMERA_HEADING]}
          height={window.innerHeight}
          zoom={18}
          markers={TARGETS}
        />
      </OneHalf>
    </AppWrapper>
  );
}

export default App;
