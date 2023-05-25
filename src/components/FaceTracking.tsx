// import React, { useEffect, useRef, useState } from "react";
// import { styled } from "styled-components";

// //import { FaceDetector, FilesetResolver } from "@mediapipe/face_detection";
// import {
//   FaceDetector,
//   FilesetResolver,
//   ImageSource,
// } from "@mediapipe/tasks-vision";
// import Webcam from "react-webcam";

// const StyledDiv = styled.div`
//   position: relative;
//   .FaceBox {
//     position: absolute;
//     top: 0;
//     left: 0;
//     border: 1px solid red;
//   }
// `;

// async function setupMediapipe() {
//   const vision = await FilesetResolver.forVisionTasks(
//     // path/to/wasm/root
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
//   );
//   const facedetector = await FaceDetector.createFromOptions(vision, {
//     baseOptions: {
//       modelAssetPath: process.env.PUBLIC_URL + "blaze_face_short_range.tflite",
//     },
//     runningMode: "VIDEO",
//   });
//   return facedetector;
// }

// function FaceTracking() {
//   const [facedetector, setFacedetector] = useState<FaceDetector>();
//   const faceboxRef = useRef<HTMLDivElement>(null);
//   const webcamRef = useRef<Webcam>(null);

//   useEffect(() => {
//     setupMediapipe().then((facedetector) => {
//       setFacedetector(facedetector);
//     });
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     function takeSnapshot() {
//       try {
//         snapShot(webcamRef, faceboxRef, facedetector);
//         if (isMounted) window.requestAnimationFrame(takeSnapshot);
//       } catch (e) {
//         console.error(e);
//         setupMediapipe().then((facedetector) => {
//           setFacedetector(facedetector);
//         });
//       }
//     }
//     takeSnapshot();
//     return () => {
//       isMounted = false;
//     };
//   }, [facedetector, webcamRef]);

//   return (
//     <StyledDiv>
//       <Webcam ref={webcamRef} />
//       <div className="FaceBox" ref={faceboxRef} />
//     </StyledDiv>
//   );
// }

// function snapShot(webcamRef: any, faceboxRef: any, facedetector: any) {
//   if (!webcamRef.current || !facedetector) return;
//   const video = webcamRef.current.video;
//   if (video) {
//     const result = facedetector.detectForVideo(
//       video as ImageSource,
//       performance.now()
//     );
//     const boundingBox = result.detections[0].boundingBox;
//     if (!boundingBox) return;
//     drawFacebox(webcamRef, faceboxRef, boundingBox);
//   }
// }

// function drawFacebox(webcamRef: any, faceboxRef: any, boundingBox: any) {
//   faceboxRef.current.style.left = `${boundingBox.originX}px`;
//   faceboxRef.current.style.top = `${boundingBox.originY}px`;
//   faceboxRef.current.style.width = `${boundingBox.width}px`;
//   faceboxRef.current.style.height = `${boundingBox.height}px`;
// }

// export default FaceTracking;

export default 4;
