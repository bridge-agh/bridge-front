import {
  AmbientLight,
  AxesHelper,
  Clock,
  DirectionalLight,
  GridHelper,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CardObject from "./card";
import BackgroundPlane from "./background";

export default class GameScene {
  canvasHTMLRef: HTMLElement;

  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;

  clock: Clock;
  stats: Stats;
  controls: OrbitControls;

  ambientLight: AmbientLight;
  directionLight: DirectionalLight;

  constructor(canvasID: string) {
    this.canvasHTMLRef = document.getElementById(canvasID)!;

    if (this.canvasHTMLRef == null) {
      throw new Error("Canvas not found");
    }

    this.renderer = new WebGLRenderer({
      // canvas: canvasHTMLRef,
      antialias: true,
    });
    this.renderer.setSize(this.canvasHTMLRef.offsetWidth, this.canvasHTMLRef.offsetHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.canvasHTMLRef.appendChild(this.renderer.domElement);

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );


    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.clock = new Clock();
    
    // js stats
    this.stats = new Stats();
    this.canvasHTMLRef.appendChild(this.stats.dom);

    // ambient light (whole scene)
    this.ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    // direction light (point)
    this.directionLight = new DirectionalLight(0xffffff, 1);
    this.directionLight.position.set(0, 0, 10);
    this.directionLight.castShadow = true;
    this.scene.add(this.directionLight);

    // auto resize canavs
    window.addEventListener("resize", () => {
      this.onWindowResize();
    });

    const axisHelper = new AxesHelper(5);
    this.scene.add(axisHelper);
    
    const gridHelper = new GridHelper(10, 10);
    gridHelper.rotateX(Math.PI / 2);
    this.scene.add(gridHelper);

    // const geometry = new BoxGeometry();
    // const material = new MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new Mesh(geometry, material);
    // this.scene.add(cube);

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 6;


    // load items here
    this.addElement(BackgroundPlane());
    this.addElement(CardObject(0, 0, 0));
    
  }

  animate(){
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
    this.controls.update();
  }

  render(){
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.renderer.setSize(0, 0); // forces parent div to fit height
    this.camera.aspect = this.canvasHTMLRef.clientWidth / this.canvasHTMLRef.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvasHTMLRef.clientWidth, this.canvasHTMLRef.clientHeight);
  }

  addElement(element: Object3D){
    this.scene.add(element);
  }
}

