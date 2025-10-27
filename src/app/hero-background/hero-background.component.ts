import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'app-hero-background',
  templateUrl: './hero-background.component.html',
  styleUrls: ['./hero-background.component.css'],
})
export class HeroBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas', { static: true }) canvasRef!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private stars!: THREE.Points;
  private lines!: THREE.Line[];
  private animationId!: number;
  private blobs: THREE.Mesh[] = [];

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }

 private initScene(): void {
  const width = window.innerWidth;
  const height = window.innerHeight;

  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  this.camera.position.z = 80;

  this.renderer = new THREE.WebGLRenderer({
    canvas: this.canvasRef.nativeElement,
    alpha: true,
  });
  this.renderer.setSize(width, height);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  

  // 🎨 สีโทนสีน้ำฟุ้ง ๆ เขียว-มิ้นต์-เทาอ่อน
  const colors = [0x88ffaa, 0xaaffcc, 0x99ddaa, 0xccffdd];

  for (let i = 0; i < 30; i++) {
    // 🔺 สร้างรูปทรงเรขาคณิตแบบสุ่ม
    const shapeType = Math.floor(Math.random() * 3);
    let geometry: THREE.BufferGeometry;

    switch (shapeType) {
      case 0:
        geometry = new THREE.CircleGeometry(5 + Math.random() * 10, 6 + Math.floor(Math.random() * 6));
        break;
      case 1:
        geometry = new THREE.RingGeometry(3, 5 + Math.random() * 5, 6 + Math.floor(Math.random() * 6));
        break;
      case 2:
      default:
        geometry = new THREE.DodecahedronGeometry(4 + Math.random() * 3);
        break;
    }

    const material = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.05 + Math.random() * 0.07,
      depthWrite: false,
    });

    const blob = new THREE.Mesh(geometry, material);
    blob.position.x = (Math.random() - 0.5) * 150;
    blob.position.y = (Math.random() - 0.5) * 100;
    blob.position.z = (Math.random() - 0.5) * 50;

    blob.rotation.z = Math.random() * Math.PI;
    blob.rotation.x = Math.random() * Math.PI;
    blob.rotation.y = Math.random() * Math.PI;

    this.scene.add(blob);
    this.blobs.push(blob);
  }

  window.addEventListener('resize', () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

 private animate = () => {
  this.animationId = requestAnimationFrame(this.animate);

  const time = Date.now() * 0.001;

  this.blobs.forEach((blob, i) => {
    blob.rotation.x += 0.001 + i * 0.00003;
    blob.rotation.y += 0.0015 + i * 0.00002;
    blob.position.x += Math.sin(time + i) * 0.02;
    blob.position.y += Math.cos(time + i * 0.5) * 0.015;
  });

  this.renderer.render(this.scene, this.camera);
};


}
