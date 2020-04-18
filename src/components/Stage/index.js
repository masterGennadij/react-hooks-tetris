import React from "react";
import PropTypes from "prop-types";

// Components
import Cell from "../Cell";

// Styles
import { StageWrapper } from "./styles";

const Stage = ({ stage }) => {
  return (
    <StageWrapper width={stage[0]?.length} height={stage?.length}>
      {stage.map((row) =>
        row.map(([type], index) => <Cell key={index} type={type} />)
      )}
    </StageWrapper>
  );
};

Stage.propTypes = {};

export default Stage;
