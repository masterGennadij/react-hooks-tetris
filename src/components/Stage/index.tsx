import Cell from '../Cell';
import { StageWrapper } from './styles';
import type { Stage } from '../../types';

interface StageProps {
  stage: Stage;
}

const StageComponent = ({ stage }: StageProps) => (
  <StageWrapper $width={stage[0]?.length} $height={stage?.length}>
    {stage.map((row) =>
      row.map(([type], index) => <Cell key={index} type={type} />)
    )}
  </StageWrapper>
);

export default StageComponent;
