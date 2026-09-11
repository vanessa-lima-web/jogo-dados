"use client";

import { useEffect, useRef } from "react";

export default function Fundo3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    async function montar() {
      try {
        const THREE = await carregarThree();
        if (disposed || !host) return;
        cleanup = montarThree(host, THREE);
      } catch {
        if (disposed || !host) return;
        cleanup = montarFallback(host);
      }
    }

    montar();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className="fundo3d" aria-hidden />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThreeNS = any;

function carregarThree(): Promise<ThreeNS> {
  const w = window as Window & { THREE?: ThreeNS };
  if (w.THREE) return Promise.resolve(w.THREE);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/three@0.160.0/build/three.min.js";
    script.async = true;
    script.onload = () => {
      if (w.THREE) resolve(w.THREE);
      else reject(new Error("THREE não carregou"));
    };
    script.onerror = () => reject(new Error("falha ao baixar three.js"));
    document.head.appendChild(script);
  });
}

function montarThree(host: HTMLDivElement, THREE: ThreeNS) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(host.clientWidth, host.clientHeight);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070d, 0.05);

  const camera = new THREE.PerspectiveCamera(
    46,
    host.clientWidth / Math.max(host.clientHeight, 1),
    0.1,
    40
  );
  camera.position.set(0, 0.3, 8);

  scene.add(new THREE.HemisphereLight(0xb8c8ff, 0x08060c, 0.8));
  const key = new THREE.DirectionalLight(0x4de2ff, 1.2);
  key.position.set(4, 6, 3);
  scene.add(key);
  const fill = new THREE.PointLight(0x7b6cff, 18, 18);
  fill.position.set(-4, 2, 2);
  scene.add(fill);

  const dados: InstanceType<typeof THREE.Mesh>[] = [];
  const cores = [0xe8eefc, 0x4de2ff, 0xc6ff4d];
  const pos: [number, number, number][] = [
    [-4.2, 1.5, -2],
    [4.4, -1.1, -2.2],
    [3.1, 2.1, -3],
  ];
  pos.forEach((p, i) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.85, 0.85),
      new THREE.MeshStandardMaterial({
        color: cores[i],
        metalness: 0.35,
        roughness: 0.28,
        emissive: cores[i],
        emissiveIntensity: 0.12,
      })
    );
    mesh.position.set(...p);
    scene.add(mesh);
    dados.push(mesh);
  });

  const anel = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.025, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x4de2ff, transparent: true, opacity: 0.4 })
  );
  anel.rotation.x = 0.4;
  scene.add(anel);

  const pts: number[] = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    pts.push(Math.cos(a) * 2.4, Math.sin(a * 2) * 0.7, Math.sin(a) * 1.3);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  scene.add(
    new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x8adfff, size: 0.07 })
    )
  );

  const starGeo = new THREE.BufferGeometry();
  const stars = new Float32Array(900);
  for (let i = 0; i < stars.length; i += 3) {
    stars[i] = (Math.random() - 0.5) * 18;
    stars[i + 1] = (Math.random() - 0.5) * 10;
    stars[i + 2] = (Math.random() - 0.5) * 12 - 2;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(stars, 3));
  scene.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x8adfff, size: 0.025, transparent: true, opacity: 0.55 })
    )
  );

  let frame = 0;
  const tick = () => {
    frame = requestAnimationFrame(tick);
    const t = performance.now() / 1000;
    dados.forEach((d, i) => {
      d.rotation.x = t * (0.35 + i * 0.08);
      d.rotation.y = t * (0.28 + i * 0.05);
      d.position.y = pos[i][1] + Math.sin(t + i) * 0.18;
    });
    anel.rotation.z = t * 0.12;
    renderer.render(scene, camera);
  };
  tick();

  const onResize = () => {
    camera.aspect = host.clientWidth / Math.max(host.clientHeight, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    host.replaceChildren();
  };
}

function montarFallback(host: HTMLDivElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  host.appendChild(canvas);
  if (!ctx) return () => undefined;

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
    s: 0.4 + Math.random(),
  }));

  let frame = 0;
  const draw = () => {
    frame = requestAnimationFrame(draw);
    const w = (canvas.width = host.clientWidth);
    const h = (canvas.height = host.clientHeight);
    ctx.fillStyle = "#05070d";
    ctx.fillRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += 0.0008 * p.s;
      if (p.x > 1) p.x = 0;
      ctx.fillStyle = p.z > 0.7 ? "#c6ff4d" : "#4de2ff";
      ctx.globalAlpha = 0.35 + p.z * 0.5;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 1.2 + p.s, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  };
  draw();

  return () => {
    cancelAnimationFrame(frame);
    host.replaceChildren();
  };
}
