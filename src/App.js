import React from "react";

import styled from "styled-components";

import ARScene from "./components/ARScene";
import TheMap from "./components/Map";

const AppWrapper = styled.div`
  height: 100vh;
  background: lightblue;
  display: flex;
`;

const OneHalf = styled.div`
  flex: 1;
  height: 100vh;
`;

const COMPASS_BEARING = 120;
const CAMERA = {
  location: {
    latitude: 49.75647,
    longitude: 6.64225
  },
  height: 1.5,
  near: 0.005,
  far: 10000
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
          bearing={COMPASS_BEARING}
        />
      </OneHalf>
      <OneHalf>
        <TheMap
          center={[CAMERA.location.longitude, CAMERA.location.latitude]}
          bearing={[COMPASS_BEARING]}
          height={window.innerHeight}
          zoom={18}
          markers={TARGETS}
        />
      </OneHalf>
    </AppWrapper>
  );
}

export default App;
