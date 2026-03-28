import { memo } from 'react';
import { TETROMINOS } from '../../helpers/tetrominos';
import { CellWrapper } from './styles';
import type { CellValue } from '../../types';

interface CellProps {
  type: CellValue;
}

const Cell = ({ type }: CellProps) => (
  <CellWrapper $type={type} $color={TETROMINOS[type]?.color} />
);

export default memo(Cell);
