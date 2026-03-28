import styled from 'styled-components';

export const StartButtonWrapper = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Pixel', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.88;
  }

  &:active {
    transform: scale(0.97);
    opacity: 0.75;
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 3px;
  }
`;
