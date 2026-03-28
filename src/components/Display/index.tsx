import { DisplayWrapper } from './styles';

interface DisplayProps {
  text: string;
  isGameOver?: boolean;
}

const Display = ({ isGameOver, text }: DisplayProps) => (
  <DisplayWrapper $isGameOver={isGameOver}>{text}</DisplayWrapper>
);

export default Display;
