import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

import { useElementDimensions } from '@/hooks/use-element-dimensions';

// GLSL shader code - must be strings for Three.js ShaderMaterial
const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uRipples[10];
  uniform float uRippleCount;
  
  varying vec2 vUv;
  
  // Smooth wave function with realistic ripple pattern
  float waveFunction(float dist, float radius) {
    float wavePhase = (dist - radius) / 15.0;
    // Create multiple sine waves for more complex pattern
    float wave = sin(wavePhase * 3.14159) * 0.5 + 0.5;
    wave += sin(wavePhase * 6.28318) * 0.3;
    wave *= exp(-abs(wavePhase) * 0.25);
    return wave;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 coord = uv * uResolution;
    
    float height = 0.0;
    vec2 normal = vec2(0.0);
    
    // Background subtle waves for atmosphere
    float backgroundWave = sin(coord.x * 0.01 + uTime * 0.5) * 0.02;
    backgroundWave += sin(coord.y * 0.01 + uTime * 0.3) * 0.02;
    backgroundWave += sin(coord.x * 0.015 + coord.y * 0.01 + uTime * 0.4) * 0.015;
    height += backgroundWave;
    
    // Process ripples
    for (int i = 0; i < 10; i++) {
      if (float(i) >= uRippleCount) break;
      
      vec2 rippleCenter = vec2(uRipples[i].x, uRipples[i].y);
      float dist = distance(coord, rippleCenter);
      float time = uRipples[i].z;
      
      if (time >= 0.0) {
        float speed = 120.0;
        float radius = time * speed;
        
        // Calculate max distance to screen edge (diagonal)
        float maxDist = length(uResolution);
        
        // Multiple wave rings for more realistic effect
        float wave1 = 0.0;
        float wave2 = 0.0;
        float wave3 = 0.0;
        
        // First wave ring (main wave) - extends to screen edge
        float dist1 = abs(dist - radius);
        float waveWidth1 = 80.0;
        // Remove radius limit - let waves travel to edge
        if (dist1 < waveWidth1) {
          wave1 = waveFunction(dist, radius);
          // Fade out based on distance from center and time (gentle fade)
          float distanceFade = 1.0 - smoothstep(maxDist * 0.3, maxDist, dist);
          float timeFade = exp(-time * 0.1);
          wave1 *= distanceFade * timeFade;
          wave1 *= smoothstep(waveWidth1, 0.0, dist1);
        }
        
        // Second wave ring (secondary, smaller)
        float radius2 = radius * 0.65;
        float dist2 = abs(dist - radius2);
        float waveWidth2 = 60.0;
        if (dist2 < waveWidth2 && time > 0.15) {
          wave2 = waveFunction(dist, radius2);
          float distanceFade = 1.0 - smoothstep(maxDist * 0.3, maxDist, dist);
          float timeFade = exp(-time * 0.1) * 0.7;
          wave2 *= distanceFade * timeFade;
          wave2 *= smoothstep(waveWidth2, 0.0, dist2);
        }
        
        // Third wave ring (inner, smallest)
        float radius3 = radius * 0.35;
        float dist3 = abs(dist - radius3);
        float waveWidth3 = 40.0;
        if (dist3 < waveWidth3 && time > 0.3) {
          wave3 = waveFunction(dist, radius3);
          float distanceFade = 1.0 - smoothstep(maxDist * 0.3, maxDist, dist);
          float timeFade = exp(-time * 0.1) * 0.5;
          wave3 *= distanceFade * timeFade;
          wave3 *= smoothstep(waveWidth3, 0.0, dist3);
        }
        
        float totalWave = wave1 + wave2 + wave3;
        height += totalWave * 0.8;
        
        // Calculate normal for lighting
        if (dist > 0.0) {
          vec2 dir = normalize(coord - rippleCenter);
          float gradient = (wave1 + wave2 + wave3) * 0.5;
          normal += dir * gradient;
        }
      }
    }
    
    // Normalize normal (with safety check)
    float normalLength = length(normal);
    if (normalLength > 0.001) {
      normal = normal / normalLength;
    }
    
    // Water colors matching landing palette (cyan, blue, purple)
    vec3 deepWater = vec3(0.0, 0.04, 0.16); // Deep blue/purple
    vec3 shallowWater = vec3(0.06, 0.18, 0.31); // Cyan-blue
    vec3 waveCrest = vec3(0.23, 0.71, 0.83); // Bright cyan (rgb(6,182,212) / 255)
    vec3 waveGlow = vec3(0.35, 0.58, 0.98); // Purple-blue glow
    
    // Mix colors based on height with gradient
    vec3 color = mix(deepWater, shallowWater, height * 0.5 + 0.3);
    
    // Add wave crest highlights with cyan glow
    float crest = smoothstep(0.3, 0.6, height);
    color = mix(color, waveCrest, crest * 0.5);
    
    // Add purple-blue glow to waves
    float glow = smoothstep(0.2, 0.5, height);
    color = mix(color, waveGlow, glow * 0.3);
    
    // Add lighting based on normal
    float lighting = dot(normal, normalize(vec2(0.5, 1.0))) * 0.3 + 0.7;
    color *= lighting;
    
    // Add cyan reflection on wave peaks
    color += vec3(0.23, 0.71, 0.83) * height * 0.4;
    
    gl_FragColor = vec4(color, 0.1);
  }
`;

interface WaterEffectProps {
  className?: string;
  letterIRef?: React.RefObject<HTMLElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export interface WaterEffectRef {
  createRipple: (x: number, y: number) => void;
}

export const WaterEffect = forwardRef<WaterEffectRef, WaterEffectProps>(
  ({ className, letterIRef, containerRef: containerRefProp }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const ripplesRef = useRef<Array<{ x: number; y: number; time: number; strength: number }>>([]);
    const emptyRef = useRef<HTMLElement | null>(null);
    const hasCreatedWavesRef = useRef(false);
    const createRippleRef = useRef<((clientX: number, clientY: number) => void) | null>(null);
    const letterIDimensions = useElementDimensions(
      letterIRef || emptyRef,
      true,
      undefined,
      0.5,
      containerRefProp || undefined,
    );

    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      // Batch reads to avoid forced reflow
      const rect = container.getBoundingClientRect();
      const width = rect.width || container.clientWidth;
      const height = rect.height || container.clientHeight;

      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const rippleVectors = new Array(10).fill(null).map(() => new THREE.Vector3(0, 0, -1));
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(width, height) },
          uRipples: { value: rippleVectors },
          uRippleCount: { value: 0 },
        },
        transparent: true,
      });
      materialRef.current = material;

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Function to create ripple at specific coordinates
      const createRipple = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;

        // Batch reads to avoid forced reflow
        const rect = containerRef.current.getBoundingClientRect();
        const currentHeight = rect.height || containerRef.current.clientHeight;
        const x = clientX - rect.left;
        const y = currentHeight - (clientY - rect.top);

        ripplesRef.current.push({
          x,
          y,
          time: 0,
          strength: 1.0,
        });

        if (ripplesRef.current.length > 10) {
          ripplesRef.current.shift();
        }
      };

      // Store createRipple in ref for useImperativeHandle
      createRippleRef.current = createRipple;

      // Handle clicks - click events already fire after layout, so we can read immediately
      const handleClick = (event: MouseEvent) => {
        createRipple(event.clientX, event.clientY);
      };

      container.addEventListener('click', handleClick);

      // Animation loop
      const clock = new THREE.Clock();
      let animationId: number;

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        if (materialRef.current) {
          materialRef.current.uniforms.uTime.value = elapsedTime;

          // Update ripples
          const beforeUpdate = ripplesRef.current.length;
          ripplesRef.current = ripplesRef.current
            .map((ripple) => {
              if (ripple.time === 0) {
                return { ...ripple, time: elapsedTime };
              }
              return ripple;
            })
            .filter((ripple) => {
              const age = elapsedTime - ripple.time;
              // Keep ripples until they fade out naturally (about 10 seconds)
              return age < 10.0;
            });

          if (ripplesRef.current.length > 0 && beforeUpdate !== ripplesRef.current.length) {
            console.log('Ripples updated:', {
              before: beforeUpdate,
              after: ripplesRef.current.length,
              ripples: ripplesRef.current,
            });
          }

          // Update existing Vector3 objects instead of creating new ones
          const rippleVectors = materialRef.current.uniforms.uRipples.value as THREE.Vector3[];
          const activeRipples = ripplesRef.current.map((ripple) => {
            const age = elapsedTime - ripple.time;
            return { x: ripple.x, y: ripple.y, age };
          });

          // Update ripple vectors
          for (let i = 0; i < 10; i++) {
            if (i < activeRipples.length) {
              rippleVectors[i].set(activeRipples[i].x, activeRipples[i].y, activeRipples[i].age);
            } else {
              rippleVectors[i].set(0, 0, -1);
            }
          }

          materialRef.current.uniforms.uRippleCount.value = activeRipples.length;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize - use requestAnimationFrame to batch reads
      const handleResize = () => {
        requestAnimationFrame(() => {
          if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

          // Batch all geometric reads together
          const rect = containerRef.current.getBoundingClientRect();
          const newWidth = rect.width || containerRef.current.clientWidth;
          const newHeight = rect.height || containerRef.current.clientHeight;

          rendererRef.current.setSize(newWidth, newHeight);
          if (materialRef.current) {
            materialRef.current.uniforms.uResolution.value.set(newWidth, newHeight);
          }
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('click', handleClick);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        material.dispose();
        geometry.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }, [containerRefProp]);

    // Create waves when letterIDimensions become available
    useEffect(() => {
      if (!containerRef.current || !letterIDimensions || !sceneRef.current) {
        console.log('WaterEffect: Missing dependencies', {
          hasContainer: !!containerRef.current,
          hasLetterIDimensions: !!letterIDimensions,
          hasScene: !!sceneRef.current,
        });
        return;
      }

      const container = containerRef.current;

      // Function to create waves when container is ready
      const createWaves = () => {
        if (hasCreatedWavesRef.current) {
          console.log('Waves already created, skipping');
          return;
        }

        // Batch reads to avoid forced reflow
        const rect = container.getBoundingClientRect();
        const width = rect.width || container.clientWidth;
        const height = rect.height || container.clientHeight;

        console.log('createWaves called:', { width, height, center: letterIDimensions.center });

        // Wait for container to have proper dimensions
        if (width === 0 || height === 0) {
          console.log('Container dimensions not ready:', { width, height });
          return;
        }

        if (letterIDimensions.center.x > 0 && letterIDimensions.center.y > 0) {
          const letterX = letterIDimensions.center.x;
          // Flip Y coordinate for shader (shader uses bottom-left origin, DOM uses top-left)
          const letterY = height - letterIDimensions.center.y;

          // Validate coordinates
          if (letterX < 0 || letterX > width || letterY < 0 || letterY > height) {
            console.log('Invalid coordinates:', {
              letterX,
              letterY,
              width,
              height,
              center: letterIDimensions.center,
            });
            return;
          }

          console.log('Creating waves at letter I:', {
            letterX,
            letterY,
            width,
            height,
            center: letterIDimensions.center,
          });
          hasCreatedWavesRef.current = true;

          // Create main wave at letter position immediately
          console.log('Adding wave 1 to ripplesRef, current count:', ripplesRef.current.length);
          ripplesRef.current.push({
            x: letterX,
            y: letterY,
            time: 0,
            strength: 1.0,
          });
          console.log('After adding wave 1, count:', ripplesRef.current.length);

          // Create additional waves around letter for more dramatic effect
          setTimeout(() => {
            console.log('Adding wave 2 to ripplesRef, current count:', ripplesRef.current.length);
            ripplesRef.current.push({
              x: letterX - 30,
              y: letterY - 20,
              time: 0,
              strength: 0.7,
            });
            console.log('After adding wave 2, count:', ripplesRef.current.length);
          }, 300);

          setTimeout(() => {
            console.log('Adding wave 3 to ripplesRef, current count:', ripplesRef.current.length);
            ripplesRef.current.push({
              x: letterX + 30,
              y: letterY + 20,
              time: 0,
              strength: 0.7,
            });
            console.log('After adding wave 3, count:', ripplesRef.current.length);
          }, 500);
        }
      };

      // Try immediately
      createWaves();

      const resizeObserver = new ResizeObserver(() => {
        createWaves();
      });

      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }, [letterIDimensions]);

    // Expose createRipple method via ref
    useImperativeHandle(ref, () => ({
      createRipple: (clientX: number, clientY: number) => {
        createRippleRef.current?.(clientX, clientY);
      },
    }));

    return <div ref={containerRef} className={`w-full h-full ${className || ''}`} />;
  },
);

WaterEffect.displayName = 'WaterEffect';
