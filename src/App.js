import React from "react";

import styled from "styled-components";

import ARScene from "./components/ARScene";
import TheMap from "./components/Map";

const AppWrapper = styled.div`
  height: 100vh;
  background: grey;
  display: flex;
`;

const OneHalf = styled.div`
  flex: 1;
  height: 100vh;
`;

const CAMERA_HEADING = 109;

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
      latitude: 49.75665,
      longitude: 6.64314
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
