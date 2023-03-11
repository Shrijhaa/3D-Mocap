import { Injectable } from '@angular/core';
// make sure your import controls_utils_3d before control utils
import { Camera } from '@mediapipe/camera_utils';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class MlService {
  // use the camera util provided by mediapose
  camera: any;
  // tracking model
  pose: any;
  // skeleton results
  // subjects enhance reactive programming due to the real-time nature of the application
  poseResults$ = new Subject();
  // set the input video dimensions
  // we chose smaller dimensions to make inference a bit faster
  private videoSize = { width: 320, height: 180 };

  constructor() {
    this.initialisePoseModel();
  }

  async initialisePoseModel() {
    // initialize the pose estimation model. 
    // make sure to configure your workspace correctly to avoid 404 errors
    this.pose = new Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});

    // check out configurations in official docs
    // https://google.github.io/mediapipe/solutions/pose.html
    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.pose.onResults(this.postProcess3DPose);
  }

  postProcess3DPose(results: any) {
    // cancel processing results if no pose is found in frame
    if (!results.poseLandmarks) {
        return;
    }
    // push pose estimation results to subscribers
    this.poseResults$.next(results.poseLandmarks);
  }

  processInput(videoElement: any) {
    // initialize the camera with the video element from UI
    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        // pose estimation inference
        await this.pose.send({ image: videoElement });
      },
      width: this.videoSize.width,
      height: this.videoSize.height
    });
    this.camera.start();
  }
}