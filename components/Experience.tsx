import { Environment, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Model } from "./Avatar";

export const Experience = () => {
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls enableZoom={false} />
      <Model position={[0, -2.5, 0]} scale={2} />
      <Environment preset="sunset" />
    </>
  );
};
