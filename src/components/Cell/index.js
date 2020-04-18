import React, { memo } from "react";
import PropTypes from "prop-types";

// Helpers
import { TETROMINOS } from "../../helpers/tetrominos";

// Styles
import { CellWrapper } from "./styles";

const Cell = ({ type }) => {
  return <CellWrapper type={type} color={TETROMINOS[type]?.color} />;
};

Cell.propTypes = {};

export default memo(Cell);
