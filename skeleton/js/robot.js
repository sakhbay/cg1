var currentNode;

// https://threejs.org/docs/#api/materials/MeshLambertMaterial
var defaultMaterial = new THREE.MeshLambertMaterial({
    color: "blue",  // CSS color names can be used!
});

var selectedMaterial = new THREE.MeshLambertMaterial({
    color: "yellow",
});

var Robot = function () {

    this.root = new THREE.Object3D;
};


Robot.prototype.buildRobot = function () {

    // Make a torso
    var torsoGeometry = new THREE.BoxGeometry(2, 3, 1);
    var torso = new Node(buildMesh(torsoGeometry), "torso_node");

    // Make a head and push it to it's parent(torso)
    var headGeometry = new THREE.DodecahedronGeometry(1, 0)
    var head = new Node(buildMesh(headGeometry), "head_node");
    setMeshPosition(head, 0, 2.1, 0);
    head.setParent(torso);

    // Make upper arms and push them to their parent(torso)
    var upperArmGeometry = new THREE.BoxGeometry(.5, 1.5, 0.5)
    var leftUpperArm = new Node(buildMesh(upperArmGeometry), "left_upper_arm");
    var rightUpperArm = new Node(buildMesh(upperArmGeometry), "right_upper_arm");
    leftUpperArm.setParent(torso);
    rightUpperArm.setParent(torso);
    setMeshPosition(rightUpperArm, 1.3, .7, 0);
    setMeshPosition(leftUpperArm, -1.3, .7, 0);

    // Make lower arms and push them to their parents(upper arms)
    var lowerArmGeometry = new THREE.BoxGeometry(.5, 2, .5);
    var leftLowerArm = new Node(buildMesh(lowerArmGeometry), "left_lower_arm");
    var rightLowerArm = new Node(buildMesh(lowerArmGeometry), "right_lower_arm");
    leftLowerArm.setParent(leftUpperArm);
    rightLowerArm.setParent(rightUpperArm);
    setMeshPosition(leftLowerArm, -1.3, -1.1, 0);
    setMeshPosition(rightLowerArm, 1.3, -1.1, 0);

    // Make hands and push them to their parents(lower arms)
    var handGeometry = new THREE.SphereGeometry(.35);
    var leftHand = new Node(buildMesh(handGeometry), "left_hand");
    var rightHand = new Node(buildMesh(handGeometry), "right_hand");
    leftHand.setParent(leftLowerArm);
    rightHand.setParent(rightLowerArm);
    setMeshPosition(leftHand, -1.3, -2.45, 0);
    setMeshPosition(rightHand, 1.3, -2.45, 0);

    // Make legs and push them to their parent(torso)
    var legGeometry = new THREE.BoxGeometry(.8, 3.5, 1);
    var leftLeg = new Node(buildMesh(legGeometry), "left_leg");
    var rightLeg = new Node(buildMesh(legGeometry), "right_leg");
    leftLeg.setParent(torso);
    rightLeg.setParent(torso);
    setMeshPosition(leftLeg, -.5, -3.3, 0);
    setMeshPosition(rightLeg, .5, -3.3, 0);

    // Make feet and push them to their parents(leg)
    var footGeometry = new THREE.BoxGeometry(.8, .4, 1.8);
    var leftFoot = new Node(buildMesh(footGeometry), "left_foot");
    var rightFoot = new Node(buildMesh(footGeometry), "right_foot");
    leftFoot.setParent(leftLeg);
    rightFoot.setParent(rightLeg);
    setMeshPosition(leftFoot, -.5, -5.2, .37);
    setMeshPosition(rightFoot, .5, -5.2, .37);

    this.robotTree = new RobotTree(torso);

    // add the Meshes to scene
    this.root.add(torso.mesh);
    this.root.add(head.mesh);
    this.root.add(rightUpperArm.mesh);
    this.root.add(leftUpperArm.mesh);
    this.root.add(leftLowerArm.mesh);
    this.root.add(rightLowerArm.mesh);
    this.root.add(leftHand.mesh);
    this.root.add(rightHand.mesh);
    this.root.add(leftLeg.mesh);
    this.root.add(rightLeg.mesh);
    this.root.add(leftFoot.mesh);
    this.root.add(rightFoot.mesh);


    return this.root
};


Robot.prototype.reset = function () {
};

Robot.prototype.selectChild = function (forward) {
    if (forward) {
        if (currentNode == undefined || currentNode == null) {
            currentNode = this.robotTree._root;
            console.log("selected child: " + currentNode.id);
            currentNode.mesh.material = selectedMaterial;
        } else if (currentNode.children.length == 0) {
            console.log(currentNode.id + " does not have a child")
        } else {
            currentNode = currentNode.children[0];
            console.log("selected child: " + currentNode.id);
            if (currentNode.parent != null) {
                currentNode.parent.mesh.material = defaultMaterial;
            }
            currentNode.mesh.material = selectedMaterial;
        }
    } else {
        var childNode = currentNode;
        if (currentNode == undefined || currentNode == null) {
            currentNode = this.robotTree._root;
            console.log("selected Parent: " + currentNode.id);
            currentNode.mesh.material = selectedMaterial;
        } else if (currentNode.parent == null) {
            console.log(currentNode.id + " is an orphan");
        } else {
            currentNode = currentNode.parent;
            console.log("selected Parent: " + currentNode.id);
            childNode.mesh.material = defaultMaterial;
            currentNode.mesh.material = selectedMaterial
        }
    }
}
;

Robot.prototype.selectSibling = function (forward) {
    var prevNode = currentNode;
    var currentNodeIndex;

    if (currentNode.parent != undefined) {
        currentNodeIndex = findIndex(currentNode);
    }

    if (forward) {
        if (currentNode.parent == undefined || currentNode.parent.children[currentNodeIndex + 1] == undefined){
            console.log(currentNode.id + " doesn't have next sibling");
        } else {
            prevNode.mesh.material = defaultMaterial;
            currentNode = currentNode.parent.children[currentNodeIndex + 1];
            currentNode.mesh.material = selectedMaterial;
        }
    } else {
        if (currentNode.parent == undefined || currentNode.parent.children[currentNodeIndex - 1] == undefined){
            console.log(currentNode.id + " doesn't have previous sibling")
        } else {
            prevNode.mesh.material = defaultMaterial;
            currentNode = currentNode.parent.children[currentNodeIndex - 1];
            currentNode.mesh.material = selectedMaterial;
        }
    }
};

Robot.prototype.toggleSelection = function () {
};

Robot.prototype.rotateOnAxis = function (axis, degree) {
};

function findIndex(node){
    var siblings = node.parent.children;
    var index;
    for (var i = 0; i < siblings.length; i++){
        if (node.id == siblings[i].id){
            index = i;
            return index;
        }
    }
    return null;
}

function setMeshPosition(node, x, y, z) {
    node.mesh.position.set(x, y, z)
}

function buildMesh(geometry) {
    return new THREE.Mesh(geometry, defaultMaterial);
}

function Node(mesh, id) {
    this.mesh = mesh;
    this.id = id;
    this.parent = null;
    this.children = [];

    this.setParent = function (parent) {
        if (this.parent == null) {
            this.parent = parent;
            this.parent.addChild(this);
        }
    }

    this.addChild = function (child) {
        this.children.push(child)
    }
}

function RobotTree(node) {
    this._root = node;
}