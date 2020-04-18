import styled from "styled-components";

export const CellWrapper = styled.div`
  width: auto;
  background-color: rgba(${({ color }) => color}, 0.8);
  border: ${({ type }) => (type === 0 ? 0 : "4px solid")};
  border-bottom-color: rgba(${({ color }) => color}, 0.1);
  border-right-color: rgba(${({ color }) => color}, 1);
  border-top-color: rgba(${({ color }) => color}, 1);
  border-left-color: rgba(${({ color }) => color}, 0.3);
`;
