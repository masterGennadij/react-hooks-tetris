import styled from 'styled-components';

interface StageWrapperProps {
  $width: number | undefined;
  $height: number | undefined;
}

export const StageWrapper = styled.div<StageWrapperProps>`
  --board-width: min(25vw, 300px);

  display: grid;
  grid-template-rows: repeat(
    ${({ $height }) => $height},
    calc(var(--board-width) / ${({ $width }) => $width})
  );
  grid-template-columns: repeat(${({ $width }) => $width}, 1fr);
  width: var(--board-width);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  background: #06060e;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 600px) {
    --board-width: min(86vw, 300px);
  }
`;
