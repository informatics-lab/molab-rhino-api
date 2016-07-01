/**
 * Created by tom on 01/07/2016.
 */

var container;
var camera, cameraTarget, rhino, scene, renderer;

init();
setMaterial();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(200, 20, 200);
    cameraTarget = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    // Lights
    scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
    addShadowedLight(1000, 100, 1000, 0xffffff, 1.35);
    addShadowedLight(500, 100, -1000, 0xffaa00, 1);

    // renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = false;
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function addShadowedLight(x, y, z, color, intensity) {
    var directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);
    directionalLight.castShadow = true;
    var d = 1;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.bias = -0.005;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var timer = Date.now() * 0.0005;
    camera.position.x = Math.cos(timer) * 200;
    camera.position.z = Math.sin(timer) * 200;
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
}

function setMaterial(textureUrl) {

    if (rhino) {
        console.log("clearing old rhino");
        // rhino.geometry.dispose();
        rhino.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                // child.material.map = texture;
                child.geometry.dispose();
            }
        });
        scene.remove(rhino);
    }

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var material;
    if(textureUrl) {
        var loader = new THREE.TextureLoader(manager);
        loader.load(textureUrl, function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
            texture.needsUpdate = true;

            // do something with the texture
            material = new THREE.MeshPhongMaterial({
                map: texture
            });

        });
    } else {
        material = new THREE.MeshPhongMaterial({
            color: 0x666666
        })
    }

    var loader = new THREE.OBJLoader(manager);
    loader.load('data/newRhino.obj', function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                // child.material.map = texture;
                child.material = material;
            }
        });
        object.position.set(0, -20, 0);
        object.rotation.set(Math.PI / 2, Math.PI, 0);
        rhino = object;
        scene.add(rhino);
        console.log(object);
    });

    console.log("Rhino texture is now using", textureUrl);

};