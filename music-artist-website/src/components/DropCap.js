import React from 'react';
import './Biography.css';

const DropCap = ({ children }) => {
  const firstLetter = children.charAt(0);
  const restOfText = children.slice(1);

  return (
    <p className="drop-cap">
      <span className="drop-cap-letter">{firstLetter}</span>
      {restOfText}
    </p>
  );
};

export default DropCap;