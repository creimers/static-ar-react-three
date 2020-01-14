import distance from "@turf/distance";
import { point } from "@turf/helpers";

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
