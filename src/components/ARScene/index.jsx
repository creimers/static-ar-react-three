import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import * as THREE from "three";
import { Canvas, extend, useThree, useRender } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import useInterval from "@use-it/interval";

import { calculateTargetPositionInMeters } from "./utils";
import church from "./church.jpg";

extend({ OrbitControls });

const IMAGE_RATIO = 4032 / 3024;

const WIDTH = window.innerWidth / 2; // px
const HEIGHT = WIDTH / IMAGE_RATIO;

const SceneWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  position: relative;
  > img {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.7;
    width: 100%;
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
  // console.log(target.id, position);
  return (
    <mesh
      position={position}
      rotation={[0, 0, 0]}
      onClick={() => console.log(target.id)}
    >
      <boxBufferGeometry attach="geometry" args={[5, 5, 5]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
};

const enableControls = false;

const Scene = ({ targets, cameraProps, heading }) => {
  const { camera, scene } = useThree();

  // useInterval(() => {
  //   const heading = camera.rotation.y;
  //   const radians = heading; // > 0 ? heading : 2 * Math.PI + heading;
  //   const degrees = THREE.Math.radToDeg(radians);

  //   // console.log("rotation", camera.rotation);
  //   console.log("y-rotation", camera.rotation.y);
  //   console.log("y-rotation deg", degrees);
  //   console.log("bearing", (bearing * Math.PI) / 180);
  // }, 1000);

  // useEffect(() => {
  //   camera.position.y = 10;
  //   // camera.lookAt(scene.position);
  //   // camera.lookAt(0, 0, -200);
  //   // camera.translateY(29);
  //   // scene.translateY(-30);
  //   camera.updateProjectionMatrix();
  // });

  useEffect(() => {
    if (!enableControls) {
      // calculation stolen from here:
      // https://github.com/jeromeetienne/AR.js/blob/master/aframe/src/location-based/gps-camera.js#L312

      const bearing = 360 - heading;
      const offset = bearing % 360;
      const offsetRad = THREE.Math.degToRad(offset);

      camera.rotation.y = offsetRad;
    }
  }, [heading]);

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

const ARScene = ({ targets, cameraProps, heading }) => {
  return (
    <SceneWrapper height={HEIGHT} width={WIDTH}>
      <img src={church} alt="cars" />
      <Canvas
        camera={{
          position: [0, 1.6, 0], // from ar.js or a-frame
          fov: 85,
          near: 0.005,
          far: 1000
        }}
      >
        <Scene targets={targets} cameraProps={cameraProps} heading={heading} />
      </Canvas>
    </SceneWrapper>
  );
};

export default ARScene;
