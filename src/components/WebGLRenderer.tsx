import React, { useRef, useEffect, useCallback } from 'react';

interface WebGLRendererProps {
  vehicleState: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    speed: number;
  };
  cityData: {
    buildings: Array<{
      position: { x: number; z: number };
      size: { width: number; height: number; depth: number };
      type: string;
    }>;
    roads: Array<{
      points: Array<{ x: number; z: number }>;
      width: number;
      type: string;
    }>;
    landmarks: Array<{
      position: { x: number; z: number };
      name: string;
    }>;
  };
  cameraMode: 'first-person' | 'third-person' | 'chase';
}

export const WebGLRenderer: React.FC<WebGLRendererProps> = ({ 
  vehicleState, 
  cityData, 
  cameraMode 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>();

  // Debug: Log props
  console.log('WebGLRenderer props:', { 
    vehicleState: !!vehicleState, 
    cityData: !!cityData, 
    cameraMode,
    buildings: cityData?.buildings?.length || 0,
    roads: cityData?.roads?.length || 0,
    landmarks: cityData?.landmarks?.length || 0
  });

  // WebGL shaders
  const vertexShaderSource = `
    attribute vec3 position;
    attribute vec3 color;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    varying vec3 vColor;
    
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vColor = color;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vColor;
    
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `;

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    console.log('WebGL initialized successfully');
    glRef.current = gl;

    // Create shader program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    // Set up WebGL state
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.53, 0.81, 0.92, 1.0); // Sky blue

    // Set up viewport
    resizeCanvas();
  }, []);

  // Create shader
  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // Create program
  const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Create building geometry
  const createBuildingGeometry = (building: any) => {
    const { position, size } = building;
    const { width, height, depth } = size;
    const { x, z } = position;

    // Create cube vertices
    const vertices = [
      // Front face
      x - width/2, 0, z - depth/2,
      x + width/2, 0, z - depth/2,
      x + width/2, height, z - depth/2,
      x - width/2, height, z - depth/2,
      
      // Back face
      x - width/2, 0, z + depth/2,
      x + width/2, 0, z + depth/2,
      x + width/2, height, z + depth/2,
      x - width/2, height, z + depth/2,
      
      // Left face
      x - width/2, 0, z - depth/2,
      x - width/2, 0, z + depth/2,
      x - width/2, height, z + depth/2,
      x - width/2, height, z - depth/2,
      
      // Right face
      x + width/2, 0, z - depth/2,
      x + width/2, 0, z + depth/2,
      x + width/2, height, z + depth/2,
      x + width/2, height, z - depth/2,
      
      // Top face
      x - width/2, height, z - depth/2,
      x + width/2, height, z - depth/2,
      x + width/2, height, z + depth/2,
      x - width/2, height, z + depth/2,
      
      // Bottom face
      x - width/2, 0, z - depth/2,
      x + width/2, 0, z - depth/2,
      x + width/2, 0, z + depth/2,
      x - width/2, 0, z + depth/2,
    ];

    // Create colors based on building type - make them more visible
    const getBuildingColor = (type: string) => {
      switch (type) {
        case 'commercial': return [0.8, 0.2, 0.2]; // Bright red
        case 'industrial': return [0.2, 0.8, 0.2]; // Bright green
        case 'residential': return [0.2, 0.2, 0.8]; // Bright blue
        default: return [0.8, 0.8, 0.2]; // Bright yellow
      }
    };

    const color = getBuildingColor(building.type);
    const colors = [];
    for (let i = 0; i < 24; i++) {
      colors.push(...color);
    }

    return { vertices, colors };
  };

  // Create road geometry
  const createRoadGeometry = (road: any) => {
    const vertices: number[] = [];
    const colors: number[] = [];
    const roadColor = [0.3, 0.3, 0.3]; // Brighter gray for visibility

    for (let i = 0; i < road.points.length - 1; i++) {
      const p1 = road.points[i];
      const p2 = road.points[i + 1];
      const halfWidth = road.width / 2;

      // Create road segment as a quad
      vertices.push(
        p1.x - halfWidth, 0.1, p1.z,
        p1.x + halfWidth, 0.1, p1.z,
        p2.x + halfWidth, 0.1, p2.z,
        p2.x - halfWidth, 0.1, p2.z,
      );

      // Add colors for the quad
      for (let j = 0; j < 4; j++) {
        colors.push(...roadColor);
      }
    }

    return { vertices, colors };
  };

  // Create vehicle geometry
  const createVehicleGeometry = (vehicle: any) => {
    const { position, rotation } = vehicle;
    const { x, z } = position;
    const y = 0.5; // Vehicle height

    const vertices = [
      // Vehicle body (simplified as a box) - make it larger
      x - 3, y, z - 2,
      x + 3, y, z - 2,
      x + 3, y + 2, z - 2,
      x - 3, y + 2, z - 2,
      
      x - 3, y, z + 2,
      x + 3, y, z + 2,
      x + 3, y + 2, z + 2,
      x - 3, y + 2, z + 2,
    ];

    const colors = [
      1.0, 0.0, 1.0, // Bright magenta
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
    ];

    return { vertices, colors };
  };

  // Render scene
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) {
      console.log('WebGL or program not ready:', { gl: !!gl, program: !!program });
      return;
    }

    if (!cityData) {
      console.log('No city data available for rendering');
      return;
    }

    resizeCanvas();

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Test: Draw a simple scene to verify WebGL is working
    if (!cityData || cityData.buildings.length === 0) {
      console.log('No city data or buildings to render, drawing test scene');
      
      gl.useProgram(program);
      const positionLocation = gl.getAttribLocation(program, 'position');
      const colorLocation = gl.getAttribLocation(program, 'color');
      const modelViewMatrixLocation = gl.getUniformLocation(program, 'modelViewMatrix');
      const projectionMatrixLocation = gl.getUniformLocation(program, 'projectionMatrix');
      
      // Set up projection matrix
      const fieldOfView = 45 * Math.PI / 180;
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 1000.0;
      const projectionMatrix = createPerspectiveMatrix(fieldOfView, aspect, zNear, zFar);
      gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
      
      // Set up camera matrix
      const cameraMatrix = createCameraMatrix(vehicleState, cameraMode);
      gl.uniformMatrix4fv(modelViewMatrixLocation, false, cameraMatrix);
      
      // Draw a simple ground plane
      const groundVertices = [
        -50, 0, -50,
        50, 0, -50,
        50, 0, 50,
        -50, 0, -50,
        50, 0, 50,
        -50, 0, 50
      ];
      const groundColors = [
        0.2, 0.6, 0.2, // Green
        0.2, 0.6, 0.2,
        0.2, 0.6, 0.2,
        0.2, 0.6, 0.2,
        0.2, 0.6, 0.2,
        0.2, 0.6, 0.2
      ];
      
      renderGeometry(gl, positionLocation, colorLocation, groundVertices, groundColors);
      
      // Draw a simple test triangle
      const testVertices = [
        0, 2, -5,
        2, 2, -5,
        1, 4, -5
      ];
      const testColors = [
        1, 0, 0, // Red
        0, 1, 0, // Green
        0, 0, 1  // Blue
      ];
      
      renderGeometry(gl, positionLocation, colorLocation, testVertices, testColors);
      return;
    }

    // Use shader program
    gl.useProgram(program);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'position');
    const colorLocation = gl.getAttribLocation(program, 'color');
    const modelViewMatrixLocation = gl.getUniformLocation(program, 'modelViewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'projectionMatrix');

    // Set up projection matrix
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;
    
    const projectionMatrix = createPerspectiveMatrix(fieldOfView, aspect, zNear, zFar);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

    // Set up camera based on mode
    const cameraMatrix = createCameraMatrix(vehicleState, cameraMode);
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, cameraMatrix);

    // Render buildings
    console.log(`Rendering ${cityData.buildings.length} buildings`);
    let renderedCount = 0;
    cityData.buildings.forEach((building, index) => {
      // Only render buildings within a reasonable distance for testing
      const distance = Math.sqrt(building.position.x * building.position.x + building.position.z * building.position.z);
      if (distance < 200) { // Only render buildings within 200 units
        const geometry = createBuildingGeometry(building);
        renderGeometry(gl, positionLocation, colorLocation, geometry.vertices, geometry.colors);
        renderedCount++;
      }
    });
    console.log(`Actually rendered ${renderedCount} buildings within 200 units`);

    // Test: Render a simple building right in front of the vehicle
    const testBuilding = {
      position: { x: 0, z: -10 },
      size: { width: 10, height: 20, depth: 10 },
      type: 'test'
    };
    const testGeometry = createBuildingGeometry(testBuilding);
    renderGeometry(gl, positionLocation, colorLocation, testGeometry.vertices, testGeometry.colors);
    console.log('Rendered test building at (0, -10)');

    // Render roads
    console.log(`Rendering ${cityData.roads.length} roads`);
    cityData.roads.forEach((road, index) => {
      const geometry = createRoadGeometry(road);
      if (geometry.vertices.length > 0) {
        renderGeometry(gl, positionLocation, colorLocation, geometry.vertices, geometry.colors);
      }
    });

    // Render vehicle
    console.log('Rendering vehicle at position:', vehicleState.position);
    const vehicleGeometry = createVehicleGeometry(vehicleState);
    renderGeometry(gl, positionLocation, colorLocation, vehicleGeometry.vertices, vehicleGeometry.colors);

    // Render landmarks
    console.log(`Rendering ${cityData.landmarks.length} landmarks`);
    cityData.landmarks.forEach((landmark, index) => {
      const landmarkGeometry = createLandmarkGeometry(landmark);
      renderGeometry(gl, positionLocation, colorLocation, landmarkGeometry.vertices, landmarkGeometry.colors);
    });

    // Render ground plane
    const groundVertices = [
      -1000, 0, -1000,
      1000, 0, -1000,
      1000, 0, 1000,
      -1000, 0, -1000,
      1000, 0, 1000,
      -1000, 0, 1000
    ];
    const groundColors = [
      0.2, 0.6, 0.2, // Green
      0.2, 0.6, 0.2,
      0.2, 0.6, 0.2,
      0.2, 0.6, 0.2,
      0.2, 0.6, 0.2,
      0.2, 0.6, 0.2
    ];
    renderGeometry(gl, positionLocation, colorLocation, groundVertices, groundColors);
  }, [vehicleState, cityData, cameraMode, resizeCanvas]);

  // Create landmark geometry
  const createLandmarkGeometry = (landmark: any) => {
    const { position } = landmark;
    const { x, z } = position;
    const height = 3;

    const vertices = [
      x - 1, 0, z - 1,
      x + 1, 0, z - 1,
      x + 1, height, z - 1,
      x - 1, height, z - 1,
      
      x - 1, 0, z + 1,
      x + 1, 0, z + 1,
      x + 1, height, z + 1,
      x - 1, height, z + 1,
    ];

    const colors = [
      1.0, 0.84, 0.0, // Gold
      1.0, 0.84, 0.0,
      1.0, 0.84, 0.0,
      1.0, 0.84, 0.0,
      1.0, 0.84, 0.0,
      1.0, 0.84, 0.0,
      1.0, 0.84, 0.0,
      1.0, 0.84, 0.0,
    ];

    return { vertices, colors };
  };

  // Render geometry
  const renderGeometry = (
    gl: WebGLRenderingContext, 
    positionLocation: number, 
    colorLocation: number, 
    vertices: number[], 
    colors: number[]
  ) => {
    if (vertices.length === 0) return;

    // Create buffers
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    // Upload position data
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Upload color data
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

    // Clean up
    gl.deleteBuffer(positionBuffer);
    gl.deleteBuffer(colorBuffer);
  };

  // Create perspective matrix
  const createPerspectiveMatrix = (fov: number, aspect: number, near: number, far: number): number[] => {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  };

  // Create camera matrix
  const createCameraMatrix = (vehicle: any, mode: string): number[] => {
    const { position, rotation } = vehicle;
    let cameraX = position.x;
    let cameraY = position.y;
    let cameraZ = position.z;

    // Adjust camera position based on mode
    switch (mode) {
      case 'first-person':
        cameraY += 1.5; // Eye level
        break;
      case 'third-person':
        cameraX -= Math.sin(rotation.y) * 8;
        cameraZ -= Math.cos(rotation.y) * 8;
        cameraY += 3;
        break;
      case 'chase':
        cameraX -= Math.sin(rotation.y) * 15;
        cameraZ -= Math.cos(rotation.y) * 15;
        cameraY += 5;
        break;
    }

    // Create look-at matrix
    const targetX = position.x;
    const targetY = position.y;
    const targetZ = position.z;

    const forward = normalize([
      targetX - cameraX,
      targetY - cameraY,
      targetZ - cameraZ
    ]);

    const right = normalize(cross(forward, [0, 1, 0]));
    const up = cross(right, forward);

    return [
      right[0], up[0], -forward[0], 0,
      right[1], up[1], -forward[1], 0,
      right[2], up[2], -forward[2], 0,
      -dot(right, [cameraX, cameraY, cameraZ]),
      -dot(up, [cameraX, cameraY, cameraZ]),
      dot(forward, [cameraX, cameraY, cameraZ]),
      1
    ];
  };

  // Vector math utilities
  const normalize = (v: number[]): number[] => {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / length, v[1] / length, v[2] / length];
  };

  const cross = (a: number[], b: number[]): number[] => {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  };

  const dot = (a: number[], b: number[]): number => {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  };

  // Initialize WebGL on mount
  useEffect(() => {
    initWebGL();
  }, [initWebGL]);

  // Render on updates
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(render);
  }, [render]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: 'none' }}
    />
  );
};
