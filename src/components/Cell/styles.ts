import styled from 'styled-components';
import type { CellValue } from '../../types';

interface CellWrapperProps {
  $type: CellValue;
  $color: string | undefined;
}

export const CellWrapper = styled.div<CellWrapperProps>`
  width: auto;
  background: ${({ $type, $color }) =>
    $type === 0 ? 'rgba(255, 255, 255, 0.025)' : `rgba(${$color}, 0.88)`};
  border: 1px solid
    ${({ $type, $color }) =>
      $type === 0 ? 'rgba(255, 255, 255, 0.04)' : `rgba(${$color}, 0.45)`};
  box-shadow: ${({ $type, $color }) =>
    $type === 0 ? 'none' : `inset 0 1px 0 rgba(255, 255, 255, 0.18)`};
`;
