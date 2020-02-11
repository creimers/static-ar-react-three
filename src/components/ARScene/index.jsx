import React, { useRef, useEffect, useState, Suspense } from "react";
import styled from "styled-components";
import * as THREE from "three";
import {
  Canvas,
  extend,
  useThree,
  useFrame,
  useLoader
} from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import useInterval from "@use-it/interval";

import {
  calculateTargetPositionInMeters,
  getCameraPosition,
  calculateConvertedTargetPosition,
  degToRad
} from "./utils";
import church from "./church.jpg";

extend({ OrbitControls });

const IMAGE_RATIO = 4032 / 3024; // actual size of the photo

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
  // console.log(camera)
  useFrame(() => ref.current && ref.current.update());
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

const Target = ({ position, target }) => {
  return (
    <mesh
      position={position}
      rotation={[0, 0, 0]}
      onClick={() => console.log(target.id)}
    >
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
};

const CircleMarker = ({ position, relativeBearing }) => {
  const ref = useRef();
  const rotation = [Math.PI / 2, 0, 0];

  useEffect(() => {
    ref.current.rotateOnWorldAxis(
      new THREE.Vector3(0.0, 1.0, 0.0),
      degToRad(relativeBearing * -1)
    );
  }, [relativeBearing]);

  return (
    <mesh rotation={rotation} position={position} ref={ref}>
      <torusGeometry attach="geometry" args={[4, 0, 2, 75, Math.PI * 2]} />
      <meshBasicMaterial attach="material" color="yellow" />
    </mesh>
  );
};

const MarkerPin = ({ position }) => {
  const ref = useRef();
  const [geometry, setGeometry] = useState(null);
  const pin = useLoader(OBJLoader2, "/mapPointer.obj");

  const thePosition = [...position];
  thePosition[1] = thePosition[1] += 3;

  if (!geometry) {
    const thePin = pin.clone(true);
    pin.children[0].material[0].color.r = 252;
    pin.children[0].material[0].color.g = 231;
    pin.children[0].material[0].color.b = 0;
    setGeometry(thePin);
  }

  useFrame(({ clock }) => {
    // ref.current.rotateOnWorldAxis(
    //   new THREE.Vector3(0.0, 1.0, 0.0),
    //   degToRad(state.clock.getElapsedTime())
    //   // Math.sin(clock.getElapsedTime()) * 0.1
    // );
    geometry.rotation.y += 0.02;

    ref.current.position.y =
      position[1] + 3 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
    // console.log(ref.current.position.y );
  });

  return (
    <mesh ref={ref} position={thePosition}>
      <primitive object={geometry} />
    </mesh>
  );
};

const enableControls = false;

const Scene = ({ targets, cameraProps, heading }) => {
  const { camera } = useThree();

  /////////////////////////////////////////////////////////////////////////////
  // initially set rotation order to YXZ (rotate the y axis (vertical)) first!!
  /////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   camera.rotation.reorder("YXZ");
  // });

  useEffect(() => {
    if (!enableControls) {
      // calculation inspiration from here:
      // https://github.com/jeromeetienne/AR.js/blob/master/aframe/src/location-based/gps-camera.js#L312

      // const bearing = 360 - heading;
      // const offset = bearing % 360;
      // const offsetRad = THREE.Math.degToRad(offset);

      // camera.rotation.y = offsetRad;

      camera.rotateOnWorldAxis(
        new THREE.Vector3(1.0, 0.0, 0.0),
        degToRad(cameraProps.pitch)
      ); // pitch
      camera.rotateOnWorldAxis(
        new THREE.Vector3(0.0, 1.0, 0.0),
        degToRad(180.0 - cameraProps.heading)
      ); // yaw

      const zDist = 0; // m
      const [x, y, z] = getCameraPosition(
        cameraProps.location.latitude,
        cameraProps.location.longitude,
        cameraProps.position[2],
        heading * -1
      );

      // console.log(x, y, z);

      camera.position.y = cameraProps.position[1];
      camera.position.z = z * -1;
      camera.position.x = x;
    }
  }, [heading]);

  return (
    <>
      {enableControls && <Controls />}
      <primitive object={new THREE.AxesHelper(200)} />
      <primitive object={new THREE.GridHelper(1000, 50)} />
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      {targets.map((target, i) => {
        const position = calculateConvertedTargetPosition(
          [cameraProps.location.longitude, cameraProps.location.latitude],
          [target.location.longitude, target.location.latitude]
        );
        return (
          <React.Fragment key={`target-${i}`}>
            <Target target={target} position={position} />
            <CircleMarker position={position} relativeBearing={0} />
            <Suspense fallback={null}>
              <MarkerPin position={position} />
            </Suspense>
          </React.Fragment>
        );
      })}

      {/* {targets.map((target, i) => {
        const position = calculateTargetPositionInMeters(
          cameraProps.location,
          target.location
        );
        return (
          <line position={[0, 0, 0]} key={`line-${i}`}>
            <geometry
              attach="geometry"
              vertices={[[0, 0, 0], position].map(v => new THREE.Vector3(...v))}
              onUpdate={self => (self.verticesNeedUpdate = true)}
            />
            <lineBasicMaterial attach="material" color="pink" lineWidth="5" />
          </line>
        );
      })} */}
    </>
  );
};

const ARScene = ({ targets, cameraProps, heading }) => {
  return (
    <SceneWrapper height={HEIGHT} width={WIDTH}>
      <img src={church} alt="cars" />
      <Canvas
        camera={{
          fov: 56,
          near: 0.005,
          far: 10000,
          zoom: 1
        }}
      >
        <Scene targets={targets} cameraProps={cameraProps} heading={heading} />
      </Canvas>
    </SceneWrapper>
  );
};

export default ARScene;
