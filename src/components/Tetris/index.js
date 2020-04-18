import React from "react";
import PropTypes from "prop-types";

// Utils
import { createStage } from "../../helpers/gameHelpers";

// Components
import Stage from "../Stage";
import StartButton from "../StartButton";
import Display from "../Display";

const Tetris = (props) => {
  return (
    <div>
      <Stage stage={createStage()} />
      <aside>
        <div>
          <Display text="score" />
          <Display text="rows" />
          <Display text="level" />
        </div>
        <StartButton />
      </aside>
    </div>
  );
};

Tetris.propTypes = {};

export default Tetris;
