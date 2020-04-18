import styled from "styled-components";
import backgroundImage from "../../images/bg.png";

export const TetrisWrapper = styled.div`
  background: url(${backgroundImage}) #000;
  background-size: cover;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
`;

export const TetrisContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 40px;
  margin: 0 auto;
  width: 900px;

  aside {
    width: 100%;
    max-width: 200px;
    padding: 0 20px;
  }
`;
