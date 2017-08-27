import { PropTypes } from 'react';
import React from 'react';
import renderIf from 'render-if';

const Button = ({
  text,
  classNames,
  secondary = false,
  onClick,
  children,
}) => {
  let classList = [
    'button',
    secondary ? 'secondary' : 'primary'
  ];
  if (classNames) {
    classList = [].concat(classList, classNames);
  }
  return (
    <div className={classList.join(' ')}>
      {children}
      {renderIf(text)(
        <span>{text}</span>
      )}
      <div 
        className="overlay"
        onClick={onClick}></div>
    </div>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  classNames: PropTypes.arrayOf(PropTypes.string),
  secondary: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.element),
};

export default Button;
