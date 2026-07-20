import { useRef, useEffect, memo } from 'react'
import * as THREE from 'three'

// memo: prevent re-mount on every Hero render (Three.js is expensive to init)
const ThreeBackground = memo(function ThreeBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 2000)
    camera.position.set(0, 0, 120)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ─── Particle wave grid ───────────────────────────────────
    const COLS = 60
    const ROWS = 44
    const COUNT = COLS * ROWS
    const positions = new Float32Array(COUNT * 3)
    const scales    = new Float32Array(COUNT)
    const colors    = new Float32Array(COUNT * 3)

    const c1 = new THREE.Color('#4f8ef7')  // blue
    const c2 = new THREE.Color('#00d4ff')  // cyan

    let idx = 0
    for (let ix = 0; ix < COLS; ix++) {
      for (let iy = 0; iy < ROWS; iy++) {
        positions[idx * 3]     = (ix / (COLS - 1)) * 240 - 120
        positions[idx * 3 + 1] = 0
        positions[idx * 3 + 2] = (iy / (ROWS - 1)) * 180 - 90
        scales[idx] = 1
        const t = ix / COLS
        const col = c1.clone().lerp(c2, t)
        colors[idx * 3]     = col.r
        colors[idx * 3 + 1] = col.g
        colors[idx * 3 + 2] = col.b
        idx++
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('scale',    new THREE.BufferAttribute(scales, 1))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      vertexShader: `
        attribute float scale;
        attribute vec3 aColor;
        varying float vAlpha;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vec3 pos = position;
          float wave = sin((pos.x * 0.08) + uTime) * 14.0
                     + cos((pos.z * 0.12) + uTime * 0.8) * 8.0;
          pos.y = wave;
          float s = (sin((pos.x * 0.08) + uTime) + 1.0) * 1.5
                  + (cos((pos.z * 0.12) + uTime * 0.8) + 1.0) * 1.5 + 0.5;
          gl_PointSize = s * (280.0 / -(modelViewMatrix * vec4(pos,1.0)).z);
          vAlpha = 0.35 + (wave + 22.0) / 44.0 * 0.5;
          vColor = aColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = (1.0 - d * 2.0) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // ─── Floating orbs ────────────────────────────────────────
    const orbGeo = new THREE.SphereGeometry(1, 16, 16)
    const orbs = []
    const orbData = [
      { pos: [-60, 20, -40], color: 0x4f8ef7, size: 14 },
      { pos: [ 70,-15, -60], color: 0x00d4ff, size: 10 },
      { pos: [ 10, 35, -80], color: 0x7c5ff5, size: 8  },
    ]
    orbData.forEach(({ pos, color, size }) => {
      const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 })
      const mesh = new THREE.Mesh(orbGeo, m)
      mesh.scale.setScalar(size)
      mesh.position.set(...pos)
      scene.add(mesh)

      // glow sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: makeGlowTexture(color),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.setScalar(size * 18)
      sprite.position.set(...pos)
      scene.add(sprite)
      orbs.push({ mesh, sprite, baseY: pos[1] })
    })

    function makeGlowTexture(color) {
      const size = 256
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = size
      const ctx = canvas.getContext('2d')
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
      const c = new THREE.Color(color)
      grad.addColorStop(0,   `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},0.25)`)
      grad.addColorStop(0.4, `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},0.08)`)
      grad.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, size, size)
      return new THREE.CanvasTexture(canvas)
    }

    // ─── Mouse parallax ───────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ─── Animation loop ───────────────────────────────────────
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      mat.uniforms.uTime.value = t * 0.55

      // gentle camera parallax
      camera.position.x += (mouse.x * 18 - camera.position.x) * 0.04
      camera.position.y += (-mouse.y * 10 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)

      // orbs float
      orbs.forEach((orb, i) => {
        orb.mesh.position.y   = orb.baseY + Math.sin(t * 0.4 + i * 2.1) * 8
        orb.sprite.position.y = orb.mesh.position.y
      })

      renderer.render(scene, camera)
    }
    animate()

    // ─── Resize — throttled to avoid layout thrashing ────────
    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        camera.aspect = mount.clientWidth / mount.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(mount.clientWidth, mount.clientHeight)
      }, 100)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      // Dispose GPU resources
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
})

export default ThreeBackground
