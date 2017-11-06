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
    var torsoPivot = new THREE.Object3D();
    var torso = new Node(buildPivot(torsoPivot,
        new THREE.Mesh(torsoGeometry, defaultMaterial)), "torso_node");

    // Make a head and push it to it's parent(torso)
    var headGeometry = new THREE.DodecahedronGeometry(1, 0);
    var headPivot = new THREE.Object3D();
    var head = new Node(buildPivot(headPivot,
        new THREE.Mesh(headGeometry, defaultMaterial)), "head_node");
    setPivotPosition(head, 0, 2.1, 0);
    head.setParent(torso);

    // Make upper arms and push them to their parent(torso)
    var upperArmGeometry = new THREE.BoxGeometry(.5, 1.4, 0.5);
    var leftUpperArmPivot = new THREE.Object3D();
    var rightUpperArmPivot = new THREE.Object3D();
    var leftUpperArm = new Node(buildPivot(leftUpperArmPivot,
        new THREE.Mesh(upperArmGeometry, defaultMaterial)), "left_upper_arm");
    var rightUpperArm = new Node(buildPivot(rightUpperArmPivot,
        new THREE.Mesh(upperArmGeometry, defaultMaterial)), "right_upper_arm");
    leftUpperArm.setParent(torso);
    rightUpperArm.setParent(torso);
    setPivotPosition(rightUpperArm, 1.3, 1.5, 0);
    setPivotPosition(leftUpperArm, -1.3, 1.5, 0);
    setMeshPosition(rightUpperArm, 0, -0.75, 0);
    setMeshPosition(leftUpperArm, 0, -0.75, 0);


    // Make lower arms and push them to their parents(upper arms)
    var lowerArmGeometry = new THREE.BoxGeometry(.5, 2, .5);
    var leftLowerArmPivot = new THREE.Object3D();
    var rightLowerArmPivot = new THREE.Object3D();
    var leftLowerArm = new Node(buildPivot(leftLowerArmPivot,
        new THREE.Mesh(lowerArmGeometry, defaultMaterial)), "left_lower_arm");
    var rightLowerArm = new Node(buildPivot(rightLowerArmPivot,
        new THREE.Mesh(lowerArmGeometry, defaultMaterial)), "right_lower_arm");
    leftLowerArm.setParent(leftUpperArm);
    rightLowerArm.setParent(rightUpperArm);
    setPivotPosition(leftLowerArm, -1.3, 0, 0);
    setPivotPosition(rightLowerArm, 1.3, 0, 0);
    setMeshPosition(leftLowerArm, 0, -1, 0);
    setMeshPosition(rightLowerArm, 0, -1, 0);

    // Make hands and push them to their parents(lower arms)
    var handGeometry = new THREE.SphereGeometry(.35);
    var leftHandPivot = new THREE.Object3D();
    var rightHandPivot = new THREE.Object3D()
    var leftHand = new Node(buildPivot(leftHandPivot,
        new THREE.Mesh(handGeometry, defaultMaterial)), "left_hand");
    var rightHand = new Node(buildPivot(rightHandPivot,
        new THREE.Mesh(handGeometry, defaultMaterial)), "right_hand");
    leftHand.setParent(leftLowerArm);
    rightHand.setParent(rightLowerArm);
    setPivotPosition(leftHand, -1.3, -2.3, 0);
    setPivotPosition(rightHand, 1.3, -2.3, 0);

    // Make legs and push them to their parent(torso)
    var legGeometry = new THREE.BoxGeometry(.8, 3.5, 1);
    var leftLegPivot = new THREE.Object3D();
    var rightLegPivot = new THREE.Object3D();
    var leftLeg = new Node(buildPivot(leftLegPivot,
        new THREE.Mesh(legGeometry, defaultMaterial)), "left_leg");
    var rightLeg = new Node(buildPivot(rightLegPivot,
        new THREE.Mesh(legGeometry, defaultMaterial)), "right_leg");
    leftLeg.setParent(torso);
    rightLeg.setParent(torso);
    setPivotPosition(leftLeg, -.5, -1.55, 0);
    setPivotPosition(rightLeg, .5, -1.55, 0);
    setMeshPosition(leftLeg, 0, -1.75, 0);
    setMeshPosition(rightLeg, 0, -1.75, 0);

    // Make feet and push them to their parents(leg)
    var footGeometry = new THREE.BoxGeometry(.8, .4, 1.8);
    var leftFootPivot = new THREE.Object3D();
    var rightFootPivot = new THREE.Object3D();
    var leftFoot = new Node(buildPivot(leftFootPivot,
        new THREE.Mesh(footGeometry, defaultMaterial)), "left_foot");
    var rightFoot = new Node(buildPivot(rightFootPivot,
        new THREE.Mesh(footGeometry, defaultMaterial)), "right_foot");
    leftFoot.setParent(leftLeg);
    rightFoot.setParent(rightLeg);
    setPivotPosition(leftFoot, -.5, -5.2, 0);
    setPivotPosition(rightFoot, .5, -5.2, 0);
    setMeshPosition(leftFoot, 0, 0, .4);
    setMeshPosition(rightFoot, 0, 0, .4);

    this.robotTree = new RobotTree(torso);

    // add the Meshes to scene
    this.root.add(torso.pivot);
    this.root.add(head.pivot);
    this.root.add(rightUpperArm.pivot);
    this.root.add(leftUpperArm.pivot);
    this.root.add(leftLowerArm.pivot);
    this.root.add(rightLowerArm.pivot);
    this.root.add(leftHand.pivot);
    this.root.add(rightHand.pivot);
    this.root.add(leftLeg.pivot);
    this.root.add(rightLeg.pivot);
    this.root.add(leftFoot.pivot);
    this.root.add(rightFoot.pivot);


    return this.root
};


Robot.prototype.reset = function () {
};

Robot.prototype.selectChild = function (forward) {
    if (forward) {
        if (currentNode == undefined || currentNode == null) {
            currentNode = this.robotTree._root;
            console.log("selected child: " + currentNode.id);
            currentNode.pivot.children[0].material = selectedMaterial;
        } else if (!currentNode.hasChildren()) {
            console.log(currentNode.id + " does not have a child")
        } else {
            currentNode = currentNode.children[0];
            console.log("selected child: " + currentNode.id);
            if (currentNode.parent != null) {
                currentNode.parent.pivot.children[0].material = defaultMaterial;
            }
            currentNode.pivot.children[0].material = selectedMaterial;
        }
    } else {
        var childNode = currentNode;
        if (currentNode == undefined || currentNode == null) {
            currentNode = this.robotTree._root;
            console.log("selected Parent: " + currentNode.id);
            currentNode.pivot.children[0].material = selectedMaterial;
        } else if (currentNode.parent == null) {
            console.log(currentNode.id + " is an orphan");
        } else {
            currentNode = currentNode.parent;
            console.log("selected Parent: " + currentNode.id);
            childNode.pivot.children[0].material = defaultMaterial;
            currentNode.pivot.children[0].material = selectedMaterial
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
        if (currentNode.parent == undefined || currentNode.parent.children[currentNodeIndex + 1] == undefined) {
            console.log(currentNode.id + " doesn't have next sibling");
        } else {
            prevNode.pivot.children[0].material = defaultMaterial;
            currentNode = currentNode.parent.children[currentNodeIndex + 1];
            currentNode.pivot.children[0].material = selectedMaterial;
        }
    } else {
        if (currentNode.parent == undefined || currentNode.parent.children[currentNodeIndex - 1] == undefined) {
            console.log(currentNode.id + " doesn't have previous sibling")
        } else {
            prevNode.pivot.children[0].material = defaultMaterial;
            currentNode = currentNode.parent.children[currentNodeIndex - 1];
            currentNode.pivot.children[0].material = selectedMaterial;
        }
    }
};

Robot.prototype.toggleSelection = function () {
};

Robot.prototype.rotateOnAxis = function (axis, degree) {
    rotateTree(currentNode, axis, degree);
};

function rotateTree(node, axis, degree) {
    if (!node.hasChildren()) {
        rotateObject(node, axis, degree);
    } else {
        rotateObject(node, axis, degree);
        rotateTree(node.children[0], axis, degree);
    }
}

function rotateObject(node, axis, degree) {
    var object = node.pivot;
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), degToRad(degree));
    object.matrix.multiply(rotationMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
}

function findIndex(node) {
    var siblings = node.parent.children;
    var index;
    for (var i = 0; i < siblings.length; i++) {
        if (node.id == siblings[i].id) {
            index = i;
            return index;
        }
    }
    return null;
}

function setPivotPosition(node, x, y, z) {
    node.pivot.position.set(x, y, z)
}

function setMeshPosition(node, x, y, z) {
    node.pivot.children[0].position.set(x, y, z);
}

function buildPivot(pivot, mesh) {
    pivot.add(mesh);
    pivot.add(new THREE.AxisHelper(1));
    return pivot;
}

function Node(pivot, id) {
    this.pivot = pivot;
    this.id = id;
    this.parent = null;
    this.children = [];

    this.hasChildren = function () {
        return (this.children.length == 0) ? false : true;
    }

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