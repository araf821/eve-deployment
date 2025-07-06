import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useGraph } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

const visemeMap = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

export default function Avatar({ modelPath = "/models/686a015d6959759fe7478549.glb", audioName = "welcome" }) {
  const { scene } = useGLTF(modelPath);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const group = useRef();

  const audio = useMemo(() => new Audio(`/audios/${audioName}.mp3`), [audioName]);
  const json = useLoader(THREE.FileLoader, `/audios/${audioName}.json`);
  const lipsync = JSON.parse(json);

  useEffect(() => {
    audio.play();
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  useFrame(() => {
    const currentTime = audio.currentTime;

    // Reset all visemes
    Object.values(visemeMap).forEach((v) => {
      const headIndex = nodes.Wolf3D_Head.morphTargetDictionary[v];
      const teethIndex = nodes.Wolf3D_Teeth.morphTargetDictionary[v];
      nodes.Wolf3D_Head.morphTargetInfluences[headIndex] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[teethIndex] = 0;
    });

    // Apply current viseme
    for (const cue of lipsync.mouthCues) {
      if (currentTime >= cue.start && currentTime <= cue.end) {
        const v = visemeMap[cue.value];
        if (!v) break;
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[v]] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[v]] = 1;
        break;
      }
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials["aleksandr@readyplayer"]} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  );
}

useGLTF.preload("/models/686a015d6959759fe7478549.glb");
