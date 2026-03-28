import styled from 'styled-components';

export const TetrisWrapper = styled.div`
  background: linear-gradient(160deg, #0d0d14 0%, #111122 60%, #0d0d14 100%);
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  outline: none;
`;

export const TetrisContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 32px 40px;

  aside {
    width: 160px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    padding: 16px 12px 8px;
    gap: 12px;
    width: 100%;

    aside {
      width: 100%;
      max-width: 300px;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 6px;

      > div {
        display: flex;
        gap: 6px;
        flex: 1;
        min-width: 100%;
      }

      > div > div {
        margin: 0;
        flex: 1;
      }
    }
  }
`;
