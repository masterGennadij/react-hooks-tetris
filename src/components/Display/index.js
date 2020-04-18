import React from "react";
import PropTypes from "prop-types";

// Styles
import { DisplayWrapper } from "./styles";

const Display = ({ isGameOver, text }) => {
  return <DisplayWrapper isGameOver={isGameOver}>{text}</DisplayWrapper>;
};

Display.propTypes = {};

export default Display;
