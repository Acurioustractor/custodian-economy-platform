import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Cylinder, Html } from '@react-three/drei'
import * as THREE from 'three'

interface HubData {
  id: string
  title: string
  description: string
  position: [number, number, number]
  color: string
  connections: string[]
  stats: {
    participants: number
    successRate: number
    impact: string
  }
}

const hubData: HubData[] = [
  {
    id: 'community',
    title: 'Community Hub',
    description: 'Building trust & cultural connection',
    position: [-4, 0, 0],
    color: '#d4af37', // Achievement Gold
    connections: ['pathways', 'business'],
    stats: { participants: 400, successRate: 85, impact: '400+ young people transformed' }
  },
  {
    id: 'pathways',
    title: 'Pathways Hub',
    description: 'Training & certification',
    position: [0, 2, 0],
    color: '#2e7d32', // Growth Green
    connections: ['community', 'business'],
    stats: { participants: 350, successRate: 92, impact: '92% completion rate' }
  },
  {
    id: 'business',
    title: 'Business Hub',
    description: 'Meaningful employment',
    position: [4, 0, 0],
    color: '#73582c', // Heritage Brown
    connections: ['community', 'pathways'],
    stats: { participants: 300, successRate: 85, impact: '$1.1M annual savings' }
  }
]

function AnimatedHub({ data, onClick, isActive }: { data: HubData, onClick: () => void, isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      const scale = hovered ? 1.2 : (isActive ? 1.1 : 1)
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })

  return (
    <group position={data.position}>
      {/* Central sphere */}
      <Sphere
        ref={meshRef}
        args={[0.8, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={data.color} 
          emissive={data.color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </Sphere>

      {/* Hub title */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {data.title}
      </Text>

      {/* Stats panel */}
      {isActive && (
        <Html position={[0, -1.5, 0]} center>
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-[200px]">
            <h3 className="font-bold text-gray-800 mb-1">{data.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{data.description}</p>
            <div className="text-xs space-y-1">
              <div>👥 {data.stats.participants} participants</div>
              <div>📈 {data.stats.successRate}% success rate</div>
              <div>💰 {data.stats.impact}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function ConnectionLine({ from, to, active }: { from: [number, number, number], to: [number, number, number], active: boolean }) {
  
  return (
    <group>
      <Cylinder
        args={[0.02, 0.02, Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2) + Math.pow(to[2] - from[2], 2))]}
        position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2]}
        rotation={[0, 0, Math.atan2(to[1] - from[1], to[0] - from[0])]}
      >
        <meshStandardMaterial 
          color={active ? "#d4af37" : "#666666"} 
          emissive={active ? "#d4af37" : "#333333"}
          emissiveIntensity={active ? 0.2 : 0.05}
        />
      </Cylinder>
    </group>
  )
}

function Scene({ activeHub, setActiveHub }: { activeHub: string | null, setActiveHub: (id: string | null) => void }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Hubs */}
      {hubData.map((hub) => (
        <AnimatedHub 
          key={hub.id} 
          data={hub} 
          onClick={() => setActiveHub(activeHub === hub.id ? null : hub.id)}
          isActive={activeHub === hub.id}
        />
      ))}

      {/* Connections */}
      {hubData.map((hub) => 
        hub.connections.map((targetId) => {
          const target = hubData.find(h => h.id === targetId)
          if (!target) return null
          return (
            <ConnectionLine 
              key={`${hub.id}-${targetId}`}
              from={hub.position}
              to={target.position}
              active={activeHub === hub.id || activeHub === targetId}
            />
          )
        })
      )}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#73582c" transparent opacity={0.3} />
      </mesh>

      {/* Floating particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Sphere key={i} args={[0.02, 8, 8]} position={[
          (Math.random() - 0.5) * 20,
          Math.random() * 5,
          (Math.random() - 0.5) * 20
        ]}>
          <meshStandardMaterial color="#d4af37" transparent opacity={0.6} />
        </Sphere>
      ))}
    </>
  )
}

export function Interactive3DModel() {
  const [activeHub, setActiveHub] = useState<string | null>(null)

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Scene activeHub={activeHub} setActiveHub={setActiveHub} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            maxDistance={20}
            minDistance={5}
          />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 text-white">
        <h2 className="text-xl font-bold mb-2">Custodian Economy 3D Model</h2>
        <p className="text-sm opacity-75">Click hubs to explore • Drag to rotate • Scroll to zoom</p>
      </div>

      {/* Stats Panel */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 text-white">
        <h3 className="font-bold mb-2">Live Impact</h3>
        <div className="text-sm space-y-1">
          <div>🎯 400+ lives transformed</div>
          <div>💰 $1.1M annual savings</div>
          <div>📈 85% retention rate</div>
        </div>
      </div>
    </div>
  )
}