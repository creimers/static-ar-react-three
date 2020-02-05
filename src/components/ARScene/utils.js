import distance from "@turf/distance";
import { point } from "@turf/helpers";
import transformTranslate from "@turf/transform-translate";
import proj4 from "proj4";

/**
 * calculate the position of the rotated camera using turf.js
 */
export const getCameraPosition = (cameraLat, cameraLng, distance, heading) => {
  const options = {
    units: "kilometers"
  };
  distance = distance * 0.001; // m to km
  const cameraPoint = point([cameraLng, cameraLat]);
  const newPoint = transformTranslate(cameraPoint, distance, heading, options);

  const cameraLocation = {
    latitude: cameraLat,
    longitude: cameraLng
  };

  const targetLocation = {
    latitude: newPoint.geometry.coordinates[1],
    longitude: newPoint.geometry.coordinates[0]
  };
  return calculateTargetPositionInMeters(cameraLocation, targetLocation);
};

export const calculateTargetPositionInMeters = (
  cameraLocation,
  targetLocation
) => {
  // inspiration: https://github.com/jeromeetienne/AR.js/blob/location-based/aframe/src/location-based/gps-entity-place.js

  const cameraLocationGeojson = point([
    cameraLocation.longitude,
    cameraLocation.latitude
  ]);
  // x
  const xDest = {
    longitude: targetLocation.longitude,
    latitude: cameraLocation.latitude
  };

  const xDestGeojson = point([xDest.longitude, xDest.latitude]);

  // TODO: turf??
  // let x = computeDistanceMeters(cameraLocation, xDest);
  let x = distance(cameraLocationGeojson, xDestGeojson) * 1000;
  x *= targetLocation.longitude > cameraLocation.longitude ? 1 : -1;

  // console.log("x", x);
  // z
  const zDest = {
    longitude: cameraLocation.longitude,
    latitude: targetLocation.latitude
  };
  const zDestGeojson = point([zDest.longitude, zDest.latitude]);

  // TODO: turf??
  // let z = computeDistanceMeters(cameraLocation, zDest);
  let z = distance(cameraLocationGeojson, zDestGeojson) * 1000;
  z *= targetLocation.latitude > cameraLocation.latitude ? -1 : 1;

  // console.log("z", z);

  // console.log(targetLocation.latitude > cameraLocation.latitude);

  return [x, 0, z]; // [x, y, z]
};

export function degToRad(angle) {
  return angle * (Math.PI / 180);
}

export const getCameraPositionLegacy = (x, y, z, heading) => {
  let xHat = 0;
  let yHat = y;
  let zHat = 0;

  if (heading === 0 || heading === 360) {
    xHat = x;
    zHat = z;
  } else if (heading === 90) {
    zHat = x;
    xHat = z;
  } else if (heading === 180) {
    zHat = z * -1;
    xHat = x * -1;
  } else if (heading === 270) {
    xHat = z * -1;
    zHat = x * -1;
  } else {
    let alpha, oppositeLeg, adjacentLeg;
    const hypotenuse = z;
    if (heading < 90) {
      alpha = heading;
      oppositeLeg = Math.sin(degToRad(alpha)) * hypotenuse;
      xHat = oppositeLeg;
      adjacentLeg = Math.sqrt(hypotenuse ** 2 - oppositeLeg ** 2);
      zHat = adjacentLeg;
    } else if (heading < 180) {
      alpha = 180 - heading;
    } else if (heading < 270) {
      alpha = 270 - heading;
    } else if (heading < 360) {
      alpha = 360 - heading;
    }
  }

  return { x: xHat, y: yHat, z: zHat };
};

/**
 *
 * @param {array} cameraLocation
 * @param {array} targetLocation
 */
export const calculateConvertedTargetPosition = (
  cameraLocation,
  targetLocation
) => {
  // convert locations to webmercator

  const cameraLocationConverted = proj4(
    "EPSG:4326",
    "EPSG:3857",
    cameraLocation
  );

  const targetLocationConverted = proj4(
    "EPSG:4326",
    "EPSG:3857",
    targetLocation
  );

  //NOTE: y coord is flipped

  // var position = new THREE.Vector3(
  //   CAMERA_CONVERTED.xy[0] - target.xy[0],
  //   0.0,
  //   target.xy[1] - CAMERA_CONVERTED.xy[1]
  // );

  const position = [
    cameraLocationConverted[0] - targetLocationConverted[0],
    0.0,
    targetLocationConverted[1] - cameraLocationConverted[1]
  ];

  return position;
};
