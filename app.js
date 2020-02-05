"use strict";

/*

https://github.com/jeromeetienne/AR.js/issues/675
https://discourse.threejs.org/t/augmented-reality-with-three-js-camera-and-scene-configuration/12253
https://codesandbox.io/s/priceless-dawn-ri8fp?fontsize=14&hidenavigation=1&module=/src/components/ARScene/index.jsx&theme=dark

*/

const IMAGE_WIDTH 	= 4032;
const IMAGE_HEIGHT 	= 3024;
const IMAGE_RATIO 	= IMAGE_WIDTH / IMAGE_HEIGHT;
//const IMAGE_SCALE	= 1.0;
const IMAGE_SCALE	= 0.15;

const DISPLAY_WIDTH 	= IMAGE_WIDTH * IMAGE_SCALE;
const DISPLAY_HEIGHT 	= IMAGE_HEIGHT * IMAGE_SCALE;

const CAMERA_HEADING = 110;

const CAMERA =
{
	location:
	{
		latitude: 49.75649,
		longitude: 6.6422
	}
};

const TARGETS =
[
	{
		id: "Trierer Dom",
		location:
		{
			latitude: 49.75632,
			longitude: 6.64299
		}
	},
	{
		id: "No. 4",
		location:
		{
			latitude: 49.75659,
			longitude: 6.64312
		}
	},
	{
		id: "Well",
		location:
		{
			latitude: 49.75614,
			longitude: 6.64261
		}
	}
];

const CAMERA_CONVERTED =
{
	xy: convertCoords( [ CAMERA.location.longitude, CAMERA.location.latitude ] )
};

const TARGETS_CONVERTED =
[
	{
		id: "Trierer Dom",
		xy: convertCoords( [ TARGETS[ 0 ].location.longitude, TARGETS[ 0 ].location.latitude ] )
	},
	{
		id: "No. 4",
		xy: convertCoords( [ TARGETS[ 1 ].location.longitude, TARGETS[ 1 ].location.latitude ] )
	},
	{
		id: "Well",
		xy: convertCoords( [ TARGETS[ 2 ].location.longitude, TARGETS[ 2 ].location.latitude ] )
	}
];


var targetsConverted;

var scene;
var camera;
var camera2;
var renderer;
var cameraHelper;

var mouseDown;

// Main Entry Point
main();

function main()
{
	console.info( "Init..." );
	init3D();
	update();
}

function init3D()
{
	// Scene
	scene = new THREE.Scene();
	
	// Cameras
	camera = new THREE.PerspectiveCamera( 56.0, DISPLAY_WIDTH / DISPLAY_HEIGHT, 10.0, 500.0 );
	
	camera.position.x = 0.0;
	camera.position.y = 2.0;
	camera.position.z = 0.0;
	
	// pitch, yaw, roll	
	camera.rotateOnWorldAxis( new THREE.Vector3( 1.0, 0.0, 0.0 ), THREE.MathUtils.degToRad( 16.0 ) ); // pitch
	camera.rotateOnWorldAxis( new THREE.Vector3( 0.0, 1.0, 0.0 ), THREE.MathUtils.degToRad( 180.0 - CAMERA_HEADING ) ); // yaw
	
	cameraHelper = new THREE.CameraHelper( camera );
	scene.add( cameraHelper );
	
	camera2 = new THREE.PerspectiveCamera( 60.0, DISPLAY_WIDTH / DISPLAY_HEIGHT, 0.1, 1000.0 );
	
	camera2.position.x = 0.0;
	camera2.position.y = 200.0;
	camera2.position.z = -10.0;
		
	camera2.lookAt( 0.0, 0.0, 0.0 );
	
	// Renderer
	renderer = new THREE.WebGLRenderer( { alpha: true } );
	renderer.setSize( DISPLAY_WIDTH, DISPLAY_HEIGHT );
	renderer.setClearAlpha( 0.0 );
	document.body.appendChild( renderer.domElement );
	
	renderer.domElement.addEventListener( "mousedown", onMouseDown );
	renderer.domElement.addEventListener( "mouseup", onMouseUp );
	
	// Grid
	var grid = new THREE.GridHelper( 1000, 50 );
	scene.add( grid );
	
	// Geo Objects
	var sphereMaterial = new THREE.MeshNormalMaterial();
	
	for ( var i = 0; i < TARGETS_CONVERTED.length; i++ )
	{
		var target = TARGETS_CONVERTED[ i ];
		
		//NOTE: y coord is flipped
		var position = new THREE.Vector3( CAMERA_CONVERTED.xy[ 0 ] - target.xy[ 0 ], 0.0, target.xy[ 1 ] - CAMERA_CONVERTED.xy[ 1 ]  );
		
		var mesh = new THREE.Mesh( new THREE.SphereGeometry( 2.0, 20, 20 ), sphereMaterial );
		mesh.position.copy( position );
		scene.add( mesh );
	}
}

function update()
{	
	// Render
	requestAnimationFrame( update );
	renderer.setClearAlpha( mouseDown ? 1.0 : 0.0 );
	renderer.render( scene, mouseDown ? camera2 : camera );
}

function convertCoords( xy )
{
	// from, to, coords
	// lon/lat -> web mercator
	return proj4( "EPSG:4326", "EPSG:3857", xy );
}

function onMouseDown( evt )
{
	mouseDown = true;
}

function onMouseUp( evt )
{
	mouseDown = false;
}

function changeFOV( d )
{
	camera.fov += d;
	camera.updateProjectionMatrix()
	
	console.info( "FOV =", camera.fov );
}
