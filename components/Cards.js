import React from "react";
import classNames from "classnames";

const CustomCard = (props) => {
  const {children, className} = props;

  return (
    <div
      className={classNames("border-2 rounded bg-white", {
        [className]: className,
      })}
    >
      {children}
    </div>
  );
};

export default CustomCard;
