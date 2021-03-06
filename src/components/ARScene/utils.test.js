import { getCameraPositionLegacy, getCameraPosition } from "./utils";

test("returns an object with numbers", () => {
  const { x, y, z } = getCameraPositionLegacy(0, 0, 0, 0);
  expect(x).toEqual(expect.any(Number));
  expect(y).toEqual(expect.any(Number));
  expect(z).toEqual(expect.any(Number));
});

test("returns correct values for the 90 * x angles", () => {
  const xIn = 1;
  const yIn = 2;
  const zIn = 3;
  let heading, result;

  // 0 degrees
  heading = 0;
  result = getCameraPositionLegacy(xIn, yIn, zIn, heading);
  expect(result.x).toEqual(xIn);
  expect(result.y).toEqual(yIn);
  expect(result.z).toEqual(zIn);

  // 90 degrees
  heading = 90;
  result = getCameraPositionLegacy(xIn, yIn, zIn, heading);
  expect(result.x).toEqual(zIn);
  expect(result.y).toEqual(yIn);
  expect(result.z).toEqual(xIn);

  // 180 degrees
  heading = 180;
  result = getCameraPositionLegacy(xIn, yIn, zIn, heading);
  expect(result.x).toEqual(xIn * -1);
  expect(result.y).toEqual(yIn);
  expect(result.z).toEqual(zIn * -1);

  // 270 degrees
  heading = 270;
  result = getCameraPositionLegacy(xIn, yIn, zIn, heading);
  expect(result.x).toEqual(zIn * -1);
  expect(result.y).toEqual(yIn);
  expect(result.z).toEqual(xIn * -1);

  // 360 degrees
  heading = 360;
  result = getCameraPositionLegacy(xIn, yIn, zIn, heading);
  expect(result.x).toEqual(xIn);
  expect(result.y).toEqual(yIn);
  expect(result.z).toEqual(zIn);
});

test("returns correct values for alpha > 0 < 90 if camera moved back", () => {
  const xIn = 0;
  const yIn = 2;
  const zIn = 10; // move camera back only
  let heading, result;

  // 45 degrees
  heading = 45;
  result = getCameraPositionLegacy(xIn, yIn, zIn, heading);
  expect(result.x).toBeCloseTo(Math.sqrt(zIn ** 2 / 2));
  expect(result.y).toBeCloseTo(yIn);
  expect(result.z).toBeCloseTo(Math.sqrt(zIn ** 2 / 2));
});

test("cam pos turf", () => {
  const CAMERA = {
    location: {
      latitude: 49.75649,
      longitude: 6.6422
    }
  };

  const cameraZ = 10; // in m
  const heading = 45;

  const cameraPosition = getCameraPosition(
    CAMERA.location.latitude,
    CAMERA.location.longitude,
    cameraZ,
    heading
  );

  const [x, y, z] = cameraPosition;
  expect(x).toEqual(expect.any(Number));
  expect(y).toEqual(expect.any(Number));
  expect(z).toEqual(expect.any(Number));
});
