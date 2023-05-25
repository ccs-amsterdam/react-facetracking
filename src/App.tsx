import React, { useState } from "react";

//import FaceTracking from "./components/FaceTracking";
import FaceLandmark, { FaceLandmarkSnapshot } from "./components/FaceLandmark";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`;

const ScoreContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  grid-gap: 1rem;
`;

const Score = styled.div`
  padding: 0.3rem;
  margin: 0rem 1rem;
  display: flex;
  justify-content: space-between;
  border: 0.5px dotted grey;
  border-radius: 5px;
  position: relative;

  display: flex;
  align-items: center;

  .Bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    min-width: 2px;
    width: 100%;
    background: #7575d078;
    z-index: 1;
    transition: margin-left 0.2s, max-width 0.2s;
  }
  .Line {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 4px;
    transform: TranslateX(-2px);
    background: #540f7785;
    transition: margin-left 0.2s;
  }
`;

function App() {
  const [faceLandmark, setFaceLandmark] = useState<FaceLandmarkSnapshot>();

  return (
    <StyledDiv>
      {/* <FaceTracking /> */}
      <FaceLandmark onSnapshot={setFaceLandmark} intervalTime={1000} />

      <ScoreContainer>
        {faceLandmark?.scores.map((score) => {
          return (
            <Score key={score.category}>
              {score.category}
              <span>{score.mean.toFixed(2)}</span>
              <div
                className="Bar"
                style={{
                  marginLeft: `${score.min * 100}%`,
                  maxWidth: `${(score.max - score.min) * 100}%`,
                }}
              />
              <div
                className="Line"
                style={{ marginLeft: `${score.mean * 100}%` }}
              />
            </Score>
          );
        })}
      </ScoreContainer>

      {/* <pre>{JSON.stringify(faceLandmark, null, 2)}</pre> */}
    </StyledDiv>
  );
}

export default App;
