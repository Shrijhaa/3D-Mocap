
import { Injectable } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, Bone } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private canvasElement!: HTMLCanvasElement;
  // field of view
  private FOV = 60;
  // the 3D avatar
  private avatar: any;

  // Skeleton mappings
  // Use this diagram to match body joints
  bodySkeleton = {};

  constructor() { 
    console.log("hello");
  }

  setup(canvas: HTMLCanvasElement){
    // assign a canvas
    this.canvasElement = canvas;
    // initialize the WebGL renderer
    this.renderer = new WebGLRenderer({ canvas: this.canvasElement });
    this.renderer.setSize( this.canvasElement.width, this.canvasElement.height );
    // initialize the camera
    this.camera = new PerspectiveCamera(this.FOV, this.canvasElement.width / this.canvasElement.height, 0.1, 1000);
    // initialize the scene
    this.scene = new Scene();
    // add AmbientLight to illuminate the scene
    var light = new AmbientLight(0xffffff);
    this.scene.add(light);
  }

  animate() {
    requestAnimationFrame( this.animate.bind(this) );
    this.renderer.render( this.scene, this.camera );
  }

  async load3DModel(){
    // loads GLTF or GLB formarts
    // checkout loaders of other formats in https://threejs.org/docs/examples/en/loaders/
    const loader = new GLTFLoader();
    const loadedData = await loader.loadAsync('../assets/model/avatarGLT.glb');
    // make sure to confirm the index of your mesh in scene.children
    this.avatar = loadedData.scene.children[2]
    this.scene.add(this.avatar);
    // skeleton mappings
    this.mapBodySkeleton();
  }

  getSkeletonFromMesh(_name: string):  Bone{
    // given a skeleton name, return mesh object
    let bone= undefined;
    this.scene.traverse((child) => {
      if (child.name === _name) {
        console.log (child);
        bone = child;
      }
    });
    
    return bone;
  }

  mapBodySkeleton(){
    // manually map skeleton names in body to 
    // 23 joint indexes provided by mediapipe/pose
    this.bodySkeleton = {
      "Neck": 2,
      "Head": 3,
      "LeftEye": 4,
      "RightEye": 6,
      "HeadTop_End": 7,
      "LeftShoulder": 10,
      "RightShoulder": 11,
      "LeftArm": 12,
      "RightArm": 13,
      "LeftForeArm": 15,
      "RightForeArm": 16,
      "LeftUpLeg": 18,
      "RightUpLeg": 19,
      "LeftLeg": 20,
      "RightLeg": 21,
      "LeftFoot": 22,
      "RightFoot": 23,
      "LeftToeBase": 29,
      "RightToeBase": 30,
      "LeftToe_End": 24,
      "RightToe_End": 25,
      "LeftToe_End_end": -1,
      "RightToe_End_end": -1
    }
  }

  transformBodySkeleton(_skeletonPositions: any[]) {
    _skeletonPositions.forEach((position, index) => {
      let name = this.bodySkeleton[index.toString()];
      let bone = this.getSkeletonFromMesh(name);
      bone.position.x = position.x;
      bone.position.y = position.y;
      bone.position.z = position.z;
    })
  }

}