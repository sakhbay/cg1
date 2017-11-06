var SceneController = function (document) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
        preserveDrawingBuffer: true  // to allow screenshot
    });

    this.stats = new Stats();
};

SceneController.prototype.setup = function () {
    // https://threejs.org/docs/#api/renderers/WebGLRenderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    //add performance logging
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    this.setupCamera();
    this.setupControls();
    this.setupLight();
    this.setupGeometry();
    this.setupTreeController();

    this.render();
    this.animate();
};

SceneController.prototype.setupCamera = function () {
    var VIEW_ANGLE = 70;
    var ASPECT_RATIO = window.innerWidth / window.innerHeight;
    var NEAR_PLANE = 0.01;
    var FAR_PLANE = 100;
    // https://threejs.org/docs/#api/cameras/PerspectiveCamera
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE);
    this.camera.position.z = 10;
    this.camera.lookAt(this.scene.position);
};

SceneController.prototype.setupControls = function () {
    // https://threejs.org/examples/misc_controls_orbit.html
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.enableKeys = false;
    //bind? --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    this.controls.addEventListener('change', this.render.bind(this));
};

SceneController.prototype.setupGeometry = function () {
    this.robot = new Robot();
    this.scene.add(this.robot.buildRobot());
};

SceneController.prototype.setupLight = function () {
    // https://threejs.org/docs/#api/lights/PointLight
    var light = new THREE.PointLight(0xffffcc, 1, 100);
    light.position.set(10, 30, 15);
    this.scene.add(light);

    var light2 = new THREE.PointLight(0xffffcc, 1, 100);
    light2.position.set(10, -30, -15);
    this.scene.add(light2);

    this.scene.add(new THREE.AmbientLight(0x999999));
};

SceneController.prototype.render = function () {

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
};

SceneController.prototype.animate = function () {
    //bind? --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    requestAnimationFrame(this.animate.bind(this));
    this.stats.update();
    this.controls.update();
};

SceneController.prototype.setupTreeController = function () {
    this.treeController = new TreeController(this.robot.robotTree);
};

SceneController.prototype.reset = function () {
    this.robot.reset();
};

SceneController.prototype.toggleSelection = function () {
    this.robot.toggleSelection();
};

SceneController.prototype.selectSibling = function (forward) {
    this.robot.selectSibling(forward);
};

SceneController.prototype.selectChild = function () {
    this.robot.selectChild(forward);
};

SceneController.prototype.toggleAxisVisibility = function () {
    // utils provides two helper functions which could be used
};

SceneController.prototype.rotateNode = function (axis, degree) {
    this.robot.rotateOnAxis(axis, degree);
};

SceneController.prototype.handleMouseClick = function (mouse) {
    // Reference http://stemkoski.github.io/Three.js/Mouse-Click.html
    console.log("click");
};

SceneController.prototype.handleMouseMove = function (offsetX, offsetY) {
};

function TreeController(tree) {
    this.currentNode = null;
    this.tree = tree;

}
