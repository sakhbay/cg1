var currentObject;

// https://threejs.org/docs/#api/materials/MeshLambertMaterial
var defaultMaterial = new THREE.MeshLambertMaterial({
    color: "blue",  // CSS color names can be used!
});

var selectedMaterial = new THREE.MeshLambertMaterial({
    color: "yellow",
});

var Robot = function () {

    this.root = new THREE.Object3D;
    isRotating = false;
};


Robot.prototype.buildRobot = function () {

    // Make a torso
    var torsoGeometry = new THREE.BoxGeometry(2, 3, 1);
    var torsoMesh = new THREE.Mesh(torsoGeometry, defaultMaterial);
    var torso = new THREE.Object3D();
    torso.name = "torso_node";
    torso.add(buildAxes(2),torsoMesh);
    torso.children[0].visible = false;

    // Make a head and push it to it's parent(torso)
    var headGeometry = new THREE.DodecahedronGeometry(1, 0);
    var headMesh = new THREE.Mesh(headGeometry, defaultMaterial);
    var head = new THREE.Object3D();
    head.name = "head_node";
    head.add(buildAxes(1), headMesh);
    head.children[0].visible = false;
    setPivotPosition(head, 0, 2.1, 0);
    torso.add(head);

    // Make upper arms and push them to their parent(torso)
    var upperArmGeometry = new THREE.BoxGeometry(.5, 1.4, 0.5);
    var leftUpperArm = new THREE.Object3D();
    var rightUpperArm = new THREE.Object3D();
    leftUpperArm.name = "left_upper_arm_node";
    rightUpperArm.name = "right_upper_arm_node";
    var leftUpperArmMesh = new THREE.Mesh(upperArmGeometry, defaultMaterial);
    var rightUpperArmMesh = new THREE.Mesh(upperArmGeometry, defaultMaterial);
    leftUpperArm.add(buildAxes(2), leftUpperArmMesh);
    rightUpperArm.add(buildAxes(2), rightUpperArmMesh);
    leftUpperArm.children[0].visible = false;
    rightUpperArm.children[0].visible = false;
    torso.add(leftUpperArm, rightUpperArm);
    setPivotPosition(rightUpperArm, 1.3, 1.5, 0);
    setPivotPosition(leftUpperArm, -1.3, 1.5, 0);
    setMeshPosition(rightUpperArm, 0, -.75, 0);
    setMeshPosition(leftUpperArm, 0, -.75, 0);


    // Make lower arms and push them to their parents(upper arms)
    var lowerArmGeometry = new THREE.BoxGeometry(.5, 2, .5);
    var leftLowerArm = new THREE.Object3D();
    var rightLowerArm = new THREE.Object3D();
    var leftLowerArmMesh = new THREE.Mesh(lowerArmGeometry, defaultMaterial);
    var rightLowerArmMesh = new THREE.Mesh(lowerArmGeometry, defaultMaterial);
    leftLowerArm.name = "left_lower_arm_node";
    rightLowerArm.name = "right_lower_arm_node";
    leftLowerArm.add(buildAxes(2), leftLowerArmMesh);
    rightLowerArm.add(buildAxes(2), rightLowerArmMesh);
    leftLowerArm.children[0].visible = false;
    rightLowerArm.children[0].visible = false;
    leftUpperArm.add(leftLowerArm);
    rightUpperArm.add(rightLowerArm);
    setPivotPosition(leftLowerArm, 0, -1.5, 0);
    setPivotPosition(rightLowerArm, 0, -1.5, 0);
    setMeshPosition(leftLowerArm, 0, -1, 0);
    setMeshPosition(rightLowerArm, 0, -1, 0);

    // Make hands and push them to their parents(lower arms)
    var handGeometry = new THREE.SphereGeometry(.35);
    var leftHand = new THREE.Object3D();
    var rightHand = new THREE.Object3D();
    leftHand.name = "left_hand_node";
    rightHand.name = "right_hand_node";
    var leftHandMesh = new THREE.Mesh(handGeometry, defaultMaterial);
    var rightHandMesh = new THREE.Mesh(handGeometry, defaultMaterial);
    leftHand.add(buildAxes(2), leftHandMesh);
    rightHand.add(buildAxes(2), rightHandMesh);
    leftHand.children[0].visible = false;
    rightHand.children[0].visible = false;
    leftLowerArm.add(leftHand);
    rightLowerArm.add(rightHand)
    setPivotPosition(leftHand, 0, -2.3, 0);
    setPivotPosition(rightHand, 0, -2.3, 0);

    // Make legs and push them to their parent(torso)
    var legGeometry = new THREE.BoxGeometry(.8, 3.5, 1);
    var leftLeg = new THREE.Object3D();
    var rightLeg = new THREE.Object3D();
    leftLeg.name = "left_leg_node";
    rightLeg.name = "right_leg_node";
    var leftLegMesh = new THREE.Mesh(legGeometry, defaultMaterial);
    var rightLegMesh = new THREE.Mesh(legGeometry, defaultMaterial);
    leftLeg.add(buildAxes(2), leftLegMesh);
    rightLeg.add(buildAxes(2), rightLegMesh);
    leftLeg.children[0].visible = false;
    rightLeg.children[0].visible = false;
    torso.add(leftLeg, rightLeg);
    setPivotPosition(leftLeg, -.5, -1.55, 0);
    setPivotPosition(rightLeg, .5, -1.55, 0);
    setMeshPosition(leftLeg, 0, -1.75, 0);
    setMeshPosition(rightLeg, 0, -1.75, 0);

    // Make feet and push them to their parents(leg)
    var footGeometry = new THREE.BoxGeometry(.8, .4, 1.8);
    var leftFoot = new THREE.Object3D();
    var rightFoot = new THREE.Object3D();
    leftFoot.name = "left_foot_node";
    rightFoot.name = "right_foot_node";
    var leftFootMesh = new THREE.Mesh(footGeometry, defaultMaterial);
    var rightFootMesh = new THREE.Mesh(footGeometry, defaultMaterial);
    leftFoot.add(buildAxes(2), leftFootMesh);
    rightFoot.add(buildAxes(2), rightFootMesh);
    leftFoot.children[0].visible = false;
    rightFoot.children[0].visible = false;
    leftLeg.add(leftFoot);
    rightLeg.add(rightFoot);
    setPivotPosition(leftFoot, 0, -3.6, 0);
    setPivotPosition(rightFoot, 0, -3.6, 0);
    setMeshPosition(leftFoot, 0, 0, .4);
    setMeshPosition(rightFoot, 0, 0, .4);

    // add the Meshes to scene
    this.root.add(torso);

    return this.root
};


Robot.prototype.reset = function () {
    this.root.children[0].rotation.set(0,0,0);
    this.root.children[0].children[2].rotation.set(0,0,0);
    this.root.children[0].children[3].rotation.set(0,0,0);
    this.root.children[0].children[4].rotation.set(0,0,0);
    this.root.children[0].children[5].rotation.set(0,0,0);
    this.root.children[0].children[6].rotation.set(0,0,0);

    this.root.children[0].children[3].children[2].rotation.set(0,0,0);
    this.root.children[0].children[4].children[2].rotation.set(0,0,0);
    this.root.children[0].children[3].children[2].children[2].rotation.set(0,0,0);
    this.root.children[0].children[4].children[2].children[2].rotation.set(0,0,0);

    this.root.children[0].children[5].children[2].rotation.set(0,0,0);
    this.root.children[0].children[6].children[2].rotation.set(0,0,0);
    this.root.children[0].children[5].children[2].rotation.set(0,0,0);
    this.root.children[0].children[6].children[2].rotation.set(0,0,0);
};

Robot.prototype.selectChild = function (forward) {
    if (forward) {
        if (currentObject == undefined || currentObject == null) {
            currentObject = this.root.children[0];
            console.log("selected child: " + currentObject.name);
            currentObject.children[1].material = selectedMaterial;
        } else if (currentObject.children.length == 2) {
            console.log(currentObject.name + " does not have a child")
        } else {
            currentObject = currentObject.children[2];
            console.log("selected child: " + currentObject.name);
            if (currentObject.parent != null) {
                currentObject.parent.children[1].material = defaultMaterial;
            }
            currentObject.children[1].material = selectedMaterial;
        }
    } else {
        var childObject = currentObject;
        if (currentObject == undefined || currentObject == null) {
            currentObject = this.root.children[0];
            console.log("selected Parent: " + currentObject.name);
            currentObject.children[1].material = selectedMaterial;
        } else if (currentObject.parent == undefined || currentObject.parent == this.root) {
            console.log(currentObject.name + " is an orphan");
        } else {
            currentObject = childObject.parent;
            console.log("selected Parent: " + currentObject.name);
            childObject.children[1].material = defaultMaterial;
            currentObject.children[1].material = selectedMaterial;
        }
    }
}
;

Robot.prototype.selectSibling = function (forward) {
    var prevObject = currentObject;
    var currentObjectIndex;

    if (currentObject.parent != undefined) {
        currentObjectIndex = findIndex(currentObject);
    }

    if (forward) {
        if (currentObject.parent == undefined || currentObject.parent.children[currentObjectIndex + 1] == undefined) {
            console.log(currentObject.name + " doesn't have next sibling");
        } else {
            prevObject.children[1].material = defaultMaterial;
            currentObject = currentObject.parent.children[currentObjectIndex + 1];
            currentObject.children[1].material = selectedMaterial;
        }
    } else {
        if (currentObject.parent == undefined || currentObject.parent.children[currentObjectIndex - 1] == undefined ||
        currentObject.parent.children[currentObjectIndex-1].type != "Object3D") {
            console.log(currentObject.name + " doesn't have previous sibling");
        } else {
            prevObject.children[1].material = defaultMaterial;
            currentObject = currentObject.parent.children[currentObjectIndex - 1];
            currentObject.children[1].material = selectedMaterial;
        }
    }
};

Robot.prototype.toggleSelection = function (object) {
    if (currentObject != undefined) {
        currentObject.children[1].material = defaultMaterial;
        currentObject.children[1].geometry.colorsNeedUpdate = true;
    }
    currentObject = object;
    console.log("selected object: " + currentObject.name);
    currentObject.children[1].material = selectedMaterial;
    currentObject.children[1].geometry.colorsNeedUpdate = true;
};

Robot.prototype.rotateOnAxis = function (axis, degree) {
    var object = currentObject;
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), degToRad(degree));
    object.matrix.multiply(rotationMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
};

Robot.prototype.toggleAxisVisibility = function (){
    currentObject.children[0].visible = !currentObject.children[0].visible;
}

function findIndex(object) {
    var siblings = object.parent.children;
    var index;
    for (var i = 0; i < siblings.length; i++) {
        if (object.name == siblings[i].name) {
            index = i;
            return index;
        }
    }
    return null;
}

function setPivotPosition(pivot, x, y, z) {
    pivot.position.set(x, y, z)
}

function setMeshPosition(pivot, x, y, z) {
    pivot.children[1].position.set(x, y, z);
}