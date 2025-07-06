"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "@/components/Experience"; // or wherever your file lives

export default function AvatarPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="rounded-full w-96 h-96 overflow-hidden border border-gray-300">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
