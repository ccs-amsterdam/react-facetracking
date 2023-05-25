import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import {
  FaceLandmarker,
  FilesetResolver,
  ImageSource,
  FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

const StyledDiv = styled.div<{ showVideo?: boolean }>`
  position: relative;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid grey;
    border-radius: 7px;
    background: white;
    cursor: pointer;
  }

  video {
    ${(p) => {
      if (!p.showVideo)
        return `position: fixed;
          pointer-events: none;
          visibility: hidden;       `;
    }}
  }
`;

export interface FaceLandmarkSnapshot {
  time: string;
  scores: FaceLandmarkScore[];
}

interface FaceLandmarkScore {
  category: string;
  min: number;
  max: number;
  mean: number;
  observations: number;
  sum?: number; // just for calculating
}

interface Props {
  onSnapshot: (snapshot: FaceLandmarkSnapshot) => any;
  intervalTime?: number;
  showVideo?: boolean;
}

function FaceLandmark({ onSnapshot, intervalTime, showVideo }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = React.useState("initializing");
  const videoActive = status === "stream active";
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker>();
  const results = useRef<FaceLandmarkerResult[]>([]);

  useEffect(() => {
    streamVideo(videoRef, setStatus);
  }, [videoRef]);

  useEffect(() => {
    setupMediapipe().then((faceLandmarker) => {
      setFaceLandmarker(faceLandmarker);
    });
  }, []);

  useEffect(() => {
    if (status !== "stream active") return;
    let isMounted = true;
    function takeSnapshot() {
      try {
        snapShot(videoRef, faceLandmarker, results.current);
        if (isMounted) window.requestAnimationFrame(takeSnapshot);
      } catch (e) {
        console.error(e);
        setupMediapipe().then((faceLandmarker) => {
          setFaceLandmarker(faceLandmarker);
        });
      }
    }
    takeSnapshot();
    return () => {
      isMounted = false;
    };
  }, [faceLandmarker, videoRef, status, results]);

  useEffect(() => {
    const timeBetweenSnapshots = intervalTime || 1000;

    const interval = setInterval(() => {
      const snapshot = {
        time: new Date().toISOString(),
        scores: computeFaceLandmarkScores(results.current),
      };
      if (snapshot.scores.length === 0) return;
      onSnapshot(snapshot);
      results.current = [];
    }, timeBetweenSnapshots);
    return () => clearInterval(interval);
  }, [results, onSnapshot, intervalTime]);

  function onClick() {
    if (videoActive) {
      videoRef.current?.pause();
      setStatus("stream paused");
    } else {
      streamVideo(videoRef, setStatus);
    }
  }

  return (
    <StyledDiv showVideo={showVideo}>
      <button onClick={onClick}>{videoActive ? "Disable" : "Enable"}</button>
      <video ref={videoRef} />
    </StyledDiv>
  );
}

async function streamVideo(
  videoRef: RefObject<HTMLVideoElement>,
  setStatus: Dispatch<SetStateAction<string>>
) {
  const status = videoStatus(videoRef);
  if (status === "not supported") {
    setStatus("not supported");
    return;
  }
  if (status === "stream active") {
    setStatus("stream active");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 250 },
    });
    let video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      await video.play();
      setStatus("stream active");
    }
  } catch (error) {
    console.log(error);
    setStatus("stream failed");
  }
}

function videoStatus(videoRef: RefObject<HTMLVideoElement>) {
  if (
    !("mediaDevices" in navigator) ||
    !("getUserMedia" in navigator.mediaDevices)
  ) {
    return "not supported";
  }
  if (!videoRef.current) return "no video";
  if (!videoRef.current.srcObject) return "no stream";
  if (videoRef.current.paused) return "stream paused";
  return "stream active";
}

async function setupMediapipe() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  const faceLandmarker = await FaceLandmarker.createFromOptions(
    filesetResolver,
    {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    }
  );

  return faceLandmarker;
}

function snapShot(
  videoRef: RefObject<HTMLVideoElement>,
  faceLandmarker: FaceLandmarker | undefined,
  results: FaceLandmarkerResult[]
) {
  if (!videoRef.current || !faceLandmarker) return;
  const video = videoRef.current;
  if (video) {
    const result = faceLandmarker.detectForVideo(
      video as ImageSource,
      performance.now()
    );
    results.push(result);
  }
}

function computeFaceLandmarkScores(
  results: FaceLandmarkerResult[]
): FaceLandmarkScore[] {
  const safeResults = results.filter(
    (result) => !!result.faceBlendshapes?.[0]?.categories
  );
  if (safeResults.length === 0) return [];
  const n = safeResults.length;

  const first = safeResults[0].faceBlendshapes?.[0].categories;
  if (!first) return [];
  const scores: FaceLandmarkScore[] = first.map((category: any) => {
    return {
      category: category.categoryName,
      min: category.score,
      max: category.score,
      mean: category.score / n,
      observations: n,
    };
  });

  for (let i = 1; i < n; i++) {
    const result = safeResults[i];
    const categories = result.faceBlendshapes?.[0].categories || [];

    for (let category of categories) {
      scores[category.index].min = Math.min(
        scores[category.index].min,
        category.score
      );
      scores[category.index].max = Math.max(
        scores[category.index].max,
        category.score
      );
      scores[category.index].mean =
        scores[category.index].mean + category.score / n;
    }
  }
  return scores;
}

export default React.memo(FaceLandmark);
