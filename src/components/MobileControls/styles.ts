import styled from 'styled-components';

export const ControlsWrapper = styled.div`
  display: none;
  padding: 8px 0 28px;
  width: 100%;
  justify-content: center;

  @media (pointer: coarse), (max-width: 600px) {
    display: flex;
  }
`;

export const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 72px);
  grid-template-rows: repeat(2, 72px);
  gap: 8px;
`;

export const ControlBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.8);
  font-size: 22px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: background 0.1s ease, transform 0.1s ease;

  &:active,
  &:focus {
    background: rgba(255, 255, 255, 0.18);
    transform: scale(0.91);
    outline: none;
  }
`;
