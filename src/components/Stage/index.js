import React from "react";
import PropTypes from "prop-types";

// Components
import Cell from "../Cell";

const Stage = ({ stage }) => {
  return (
    <div>
      {stage.map((row) =>
        row.map(([type], index) => <Cell key={index} type={type} />)
      )}
    </div>
  );
};

Stage.propTypes = {};

export default Stage;
