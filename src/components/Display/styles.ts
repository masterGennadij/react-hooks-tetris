import styled from 'styled-components';

interface DisplayWrapperProps {
  $isGameOver?: boolean;
}

export const DisplayWrapper = styled.div<DisplayWrapperProps>`
  display: flex;
  align-items: center;
  margin: 0 0 10px 0;
  padding: 12px 14px;
  border: 1px solid
    ${({ $isGameOver }) =>
      $isGameOver ? 'rgba(255, 71, 87, 0.45)' : 'rgba(255, 255, 255, 0.09)'};
  border-radius: 8px;
  width: 100%;
  color: ${({ $isGameOver }) => ($isGameOver ? '#ff4757' : '#94a3b8')};
  font-family: 'Pixel', monospace;
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  white-space: nowrap;
`;
