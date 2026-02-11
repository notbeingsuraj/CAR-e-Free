import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center, useGLTF } from '@react-three/drei';

// Generic low-poly car model from drei/three.js examples
const CAR_MODEL_URL = 'https://vazxmixjsiez.useloader.workers.dev/ferrari.glb';

function CarModel({ url }) {
    const { scene } = useGLTF(url || CAR_MODEL_URL);
    return (
        <Center>
            <primitive
                object={scene.clone()}
                scale={0.6}
                rotation={[0, Math.PI / 4, 0]}
            />
        </Center>
    );
}

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 0.5, 2]} />
            <meshStandardMaterial color="#e5e5e5" />
        </mesh>
    );
}

const Car3DViewer = ({ modelUrl, style }) => {
    return (
        <div className="car-3d-canvas" style={{ width: '100%', height: '100%', ...style }}>
            <Canvas
                camera={{ position: [3, 2, 5], fov: 45 }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <directionalLight position={[-5, 3, -5]} intensity={0.3} />
                <Suspense fallback={<LoadingFallback />}>
                    <CarModel url={modelUrl} />
                    <Environment preset="city" />
                </Suspense>
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={2}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.2}
                />
            </Canvas>
        </div>
    );
};

export default Car3DViewer;
