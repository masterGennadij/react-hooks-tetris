import React from 'react';
import { StartButtonWrapper } from './styles';

interface StartButtonProps {
  onClick: () => void;
}

const StartButton = ({ onClick }: StartButtonProps) => (
  <StartButtonWrapper onClick={onClick}>Start Game</StartButtonWrapper>
);

export default StartButton;
