# HelloArmadillo - Interactive 3D WebGL Project

A WebGL-based 3D graphics project built with Three.js, featuring an interactive 3D scene with custom shaders, texture mapping, real-time lighting effects, and character controls.

## 📋 Overview

This project demonstrates advanced WebGL rendering techniques including custom GLSL shaders, PBR (Physically Based Rendering) texture mapping, dynamic lighting, and interactive 3D scene manipulation. It features two versions: a foundational implementation and an extended version with game mechanics.

## ✨ Features

### Core Features
- **3D Models**: Interactive Armadillo character and boxing glove models with custom materials
- **Shader Rendering**: Custom GLSL vertex and fragment shaders for advanced visual effects
- **Real-time Lighting**: Dynamic point light system that responds to scene interactions
- **Texture Mapping**: Multiple texture maps including diffuse, normal, displacement, AO (Ambient Occlusion), and roughness maps
- **Interactive Controls**: Keyboard and mouse controls for scene navigation and object manipulation
- **PBR Materials**: Physically based rendering for realistic surface appearance

### Part 2 Extended Features
- **Character Controls**: Full character movement system with rotation and jumping mechanics
- **Physics System**: Realistic physics simulation with collision detection
- **Animation System**: Bounce animations and particle explosion effects
- **Game Loop**: Structured game loop architecture with state management
- **UI System**: User interface for game state and information display

## 🎮 Controls

### Part 1 - Orb Control
- **W / S**: Move orb forward / backward
- **A / D**: Move orb left / right
- **Q / E**: Move orb up / down
- **Left Mouse Drag**: Rotate (orbit) around the scene
- **Right Mouse Drag**: Pan camera
- **Mouse Wheel**: Zoom in / out

### Part 2 - Character Control
- **W / S**: Move character forward / backward
- **A / D**: Move character left / right
- **J / L**: Rotate character left / right
- **Space**: Jump
- **Left / Right Mouse Drag**: Rotate camera around the scene
- **Mouse Wheel**: Zoom in / out

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- VS Code (recommended) with Live Server extension
- Or any local web server

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LyuLucas1207/HelloArmadillo-ThreeJsWebGLandShaders.git
cd HelloArmadillo-ThreeJsWebGLandShaders
```

2. Navigate to the desired version:
   - For basic version: `part1/`
   - For extended version: `part2/`

3. Open the project:
   - **Option 1 (VS Code)**: Right-click `A1.html` → "Open with Live Server"
   - **Option 2**: Use any local web server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     ```

4. Open your browser and navigate to `http://localhost:8000` (or the port your server uses)

## 📁 Project Structure

```
HelloArmadillo-ThreeJsWebGLandShaders/
├── README.md              # This file
├── A1.html               # Root HTML file
├── A1.js                 # Root JavaScript file
├── part1/                # Basic version
│   ├── A1.html
│   ├── A1.js
│   ├── glsl/             # GLSL shader files
│   │   ├── armadillo.vs.glsl
│   │   ├── armadillo.fs.glsl
│   │   ├── glove.vs.glsl
│   │   ├── glove.fs.glsl
│   │   ├── sphere.vs.glsl
│   │   └── sphere.fs.glsl
│   ├── images/           # Texture maps
│   ├── js/               # JavaScript utilities
│   └── obj/              # 3D model files
├── part2/                # Extended version with game mechanics
│   ├── A1.html
│   ├── A1.js
│   ├── src/              # Source code organized by feature
│   │   ├── animations/   # Animation systems
│   │   ├── constants/    # Game constants
│   │   ├── game/         # Game logic
│   │   ├── input/        # Input handling
│   │   ├── interface/    # UI components
│   │   ├── models/       # 3D model managers
│   │   ├── physics/      # Physics system
│   │   └── GameLoop.js   # Main game loop
│   ├── glsl/             # GLSL shader files
│   ├── images/           # Texture maps
│   ├── js/               # JavaScript utilities
│   └── obj/              # 3D model files
└── glsl/                 # Shared shader files
```

## 🛠️ Technology Stack

- **Three.js**: 3D graphics library for WebGL
- **WebGL**: Web Graphics Library for rendering
- **GLSL**: OpenGL Shading Language for custom shaders
- **HTML5 Canvas**: Rendering surface
- **JavaScript ES6+**: Modern JavaScript features

## 🎨 Shader System

The project implements custom GLSL shaders for:
- **Vertex Shaders**: Transform vertex positions and pass data to fragment shaders
- **Fragment Shaders**: Calculate pixel colors with custom lighting and material properties
- **Dynamic Uniforms**: Real-time updates for light positions and material properties

## 📊 Texture Maps

The project uses multiple texture maps for realistic rendering:
- **Diffuse Map**: Base color texture
- **Normal Map**: Surface detail and bump mapping
- **Displacement Map**: Height-based surface deformation
- **AO Map**: Ambient occlusion for realistic shadows
- **Roughness Map**: Surface roughness for PBR materials

## 🏗️ Architecture (Part 2)

Part 2 features a modular architecture:
- **Game Loop**: Central game loop with fixed timestep
- **Input Service**: Centralized keyboard input handling
- **Physics Service**: Physics simulation and collision detection
- **Effect Manager**: Particle effects and visual effects system
- **State Management**: Game state and UI state management
- **Model Managers**: Modular 3D model loading and management

## 🔧 Development

### Code Organization
- **Part 1**: Simple, straightforward implementation for learning
- **Part 2**: Modular, scalable architecture with separation of concerns

### Key Components
- Scene setup and initialization
- Shader loading and material configuration
- Model loading (OBJ format)
- Lighting setup and management
- Camera controls (OrbitControls)
- Keyboard input handling

## 📝 License

This project is available for educational purposes.

## 👤 Author

**Chongkai Lyu**
- GitHub: [@LyuLucas1207](https://github.com/LyuLucas1207)

## 🙏 Acknowledgments

- Three.js community and documentation
- UBC CPSC 314 course materials
- Texture resources and 3D models used in this project

## 📚 Additional Resources

For detailed keyboard controls and specific instructions for each version, please refer to the `README.txt` file in the respective `part1/` or `part2/` directory.

---

**Note**: Make sure your browser supports WebGL 2.0 for optimal performance. You can check WebGL support at [get.webgl.org](https://get.webgl.org/).
