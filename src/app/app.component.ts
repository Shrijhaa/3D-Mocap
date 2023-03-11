import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

import { MlService } from './services/ml.service';
import { ThreeService } from './services/three.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoplayer: ElementRef | any;
  @ViewChild('threeCanvas') threeCanvas: ElementRef | any;

  constructor(
    private mlService: MlService,
    private threeService: ThreeService) {
      console.log("hello");
    }

  ngAfterViewInit(): void {
    // Setup 3D environment 
    
    this.threeService.setup(this.threeCanvas.nativeElement);
    this.threeService.load3DModel();
    this.threeService.animate();

    // initialize  camera
    this.initCamera();

    // subscribe to pose results
    this.mlService.poseResults$.subscribe((poseKeypoints) => {
      this.threeService.transformBodySkeleton(poseKeypoints);
    }, (error) => {
      console.log("pose results error:")
      console.log(error)
    })
  }

  initCamera(){
    this.mlService.processInput(this.videoplayer.nativeElement);
  }
}