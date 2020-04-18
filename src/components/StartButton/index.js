import React from "react";
import PropTypes from "prop-types";

// Styles
import { StartButtonWrapper } from "./styles";

const StartButton = ({ onClick }) => {
  return <StartButtonWrapper onClick={onClick}>Start game</StartButtonWrapper>;
};

StartButton.propTypes = {};

export default StartButton;
