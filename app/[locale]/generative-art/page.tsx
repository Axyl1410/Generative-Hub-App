"use client";

import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";

const GenerativeArtPage: NextPage = () => {
  const [artParams, setArtParams] = useState({
    complexity: 50,
    colorScheme: "random",
    size: 800,
  });

  const [generatedArt, setGeneratedArt] = useState<string | null>(null);

  const generateArt = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = artParams.size;
    canvas.height = artParams.size;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < artParams.complexity; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ctx.lineWidth = Math.random() * 5;
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      setGeneratedArt(canvas.toDataURL());
    }
  };

  return (
    <Container>
      <Head>
        <title>Generate Art | NFT Art Generator</title>
        <meta
          name="description"
          content="Create unique generative art for your NFTs"
        />
      </Head>

      <Main>
        <Title>Create Your Generative Art</Title>

        <ControlPanel>
          <ControlGroup>
            <label>Complexity:</label>
            <input
              type="range"
              min="10"
              max="100"
              value={artParams.complexity}
              onChange={(e) =>
                setArtParams({
                  ...artParams,
                  complexity: parseInt(e.target.value),
                })
              }
            />
          </ControlGroup>

          <ControlGroup>
            <label>Color Scheme:</label>
            <select
              value={artParams.colorScheme}
              onChange={(e) =>
                setArtParams({
                  ...artParams,
                  colorScheme: e.target.value,
                })
              }
            >
              <option value="random">Random</option>
              <option value="monochrome">Monochrome</option>
              <option value="complementary">Complementary</option>
            </select>
          </ControlGroup>

          <GenerateButton onClick={generateArt}>Generate Art</GenerateButton>
        </ControlPanel>

        <ArtDisplay>
          {generatedArt ? (
            <ArtImage src={generatedArt} alt="Generated Art" />
          ) : (
            <PlaceholderText>Your art will appear here</PlaceholderText>
          )}
        </ArtDisplay>

        {generatedArt && (
          <ActionButtons>
            {/* <Button onClick={() => {}}>Mint as NFT</Button> */}
            <Button
              onClick={() => {
                const link = document.createElement("a");
                link.download = "generated-art.png";
                link.href = generatedArt;
                link.click();
              }}
            >
              Download
            </Button>
          </ActionButtons>
        )}
      </Main>
    </Container>
  );
};

export default GenerativeArtPage;

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: #0f0f0f;
  color: #fff;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #00ff87, #60efff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ControlPanel = styled.div`
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const ControlGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input,
  select {
    width: 100%;
    padding: 0.5rem;
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    color: #fff;
    border-radius: 0.5rem;

    &:focus {
      outline: none;
      border-color: #00ff87;
    }
  }
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #00ff87, #60efff);
  border: none;
  border-radius: 0.5rem;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ArtDisplay = styled.div`
  aspect-ratio: 1;
  max-width: 800px;
  margin: 0 auto;
  background: #1a1a1a;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArtImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const PlaceholderText = styled.div`
  color: #666;
  font-size: 1.2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 0.5rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3a3a3a;
    transform: translateY(-2px);
  }
`;
