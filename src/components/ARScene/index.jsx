import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import * as THREE from "three";
import { Canvas, extend, useThree, useRender } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { calculateTargetPositionInMeters } from "./utils";
// import cars from "./cars.jpg";

extend({ OrbitControls });

const HEIGHT = window.innerHeight / 2; // px
const WIDTH = window.innerWidth / 2; // px

const SceneWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  position: relative;
  > img {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.6;
  }
`;

function Controls() {
  const ref = useRef();
  const { camera, gl } = useThree();
  useRender(() => ref.current && ref.current.update());
  return (
    <orbitControls
      ref={ref}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.1}
    />
  );
}

const Target = ({ cameraLocation, target }) => {
  const position = calculateTargetPositionInMeters(
    cameraLocation,
    target.location
  );
  return (
    <mesh position={position} rotation={[0, 0, 0]}>
      <boxBufferGeometry attach="geometry" args={[5, 5, 5]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
};

const enableControls = false;

const Scene = ({ targets, cameraProps, bearing }) => {
  const { camera, scene } = useThree();

  useEffect(() => {
    if (!enableControls) {
      const rotation = { x: 0, y: bearing * 1, z: 0 };
      scene.rotation.x = (rotation.x * Math.PI) / 180;
      scene.rotation.y = (rotation.y * Math.PI) / 180;
      scene.rotation.z = (rotation.z * Math.PI) / 180;
    }
  }, [bearing]);

  return (
    <>
      {enableControls && <Controls />}
      <primitive object={new THREE.AxesHelper(200)} />
      <primitive object={new THREE.GridHelper(1000, 50)} />
      {targets.map((target, i) => (
        <Target
          key={`target-${i}`}
          target={target}
          cameraLocation={cameraProps.location}
        />
      ))}
    </>
  );
};

const ARScene = ({ targets, cameraProps, bearing }) => {
  return (
    <SceneWrapper height={HEIGHT} width={WIDTH}>
      {/* <img src={cars} alt="cars" /> */}
      <Canvas
        camera={{
          zoom: 0.5,
          position: [0, 5, 5],
          fov: 55
        }}
      >
        <Scene targets={targets} cameraProps={cameraProps} bearing={bearing} />
      </Canvas>
    </SceneWrapper>
  );
};

export default ARScene;
