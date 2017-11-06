
/*
 * This is main.js which is referenced directly from within
 * a <script> node in index.html
 */

// "use strict" means that some strange JavaScript things are forbidden
// more info https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
// even more info https://johnresig.com/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

var camera, scene, renderer;
var geometry, material, mesh, pivot, childPivot;
var stats;

function main()
{
  // setup scene
	scene = new THREE.Scene();

  setupCamera ();

  setupGeometry();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

  //this is how you output to the debugger console
  window.console.log("end init method");

  //add performance logging
  stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );
  animate();
}

function setupCamera()
{
  var VIEW_ANGLE = 70;
  var ASPECT_RATIO = window.innerWidth / window.innerHeight;
  var NEAR_PLANE = 0.01;
  var FAR_PLANE = 10;

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE );
	camera.position.z = 1;
  camera.lookAt(scene.position);
}

function setupGeometry()
{
    pivot = new THREE.Object3D();
  	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  	material = new THREE.MeshNormalMaterial();
  	var childGeometry= new THREE.BoxGeometry(0.1, 0.1, 0.1);

    childPivot = new THREE.Object3D();
  	var childMesh = new THREE.Mesh(childGeometry,material);
  	childPivot.add(childMesh)
    childPivot.add(new THREE.AxisHelper(1));
  	childPivot.position.set(0.5,0,0);

    //a mesh consists of geometry and a material; added to the scene
  	mesh = new THREE.Mesh( geometry, material );
  	mesh.position.set(0.5,0,0);

  	mesh.add(childPivot);

  	pivot.add(new THREE.AxisHelper(1));
  	pivot.add(mesh);
  	scene.add( pivot );
}

function animate()
{
  stats.begin();
	pivot.rotation.x += 0.01;
	pivot.rotation.y += 0.02;

	childPivot.rotation.x += 0.01;
	childPivot.rotation.y += 0.02;

	renderer.render( scene, camera );
  stats.end();

	requestAnimationFrame( animate );
}

//event handler that is called when the window is resized
function onWindowResize()
{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight);
}
