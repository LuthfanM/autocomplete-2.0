import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";
import classNames from "classnames";

export const Items = forwardRef((props, ref) => {
  const { value, onClick, className, onMouseEnter, onMouseLeave } = props;
  const divRef = useRef();
  const inputRef = useRef();
  const [boxChecked, setBoxChecked] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      clickItem: () => onClickItem(),
      scrollIntoView: () => {
        divRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      },
    };
  });

  const onClickItem = (event) => {
    setBoxChecked(!boxChecked);
    onClick(value);
  };

  return (
    <li
      ref={divRef}
      key={value.id}
      className={classNames(
        "flex flex-row mb-1.5 leading-5 cursor-pointer focus:outline-none",
        {
          [className]: className,
        }
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onClickItem()}
    >
      <div className="flex items-center relative">
        <Image
          src={value.image}
          className="pr-1"
          alt="me"
          width="48"
          height="48"
        />
        <div className="ml-2">
          <div>{value.name}</div>
          <div>{value.description}</div>
        </div>
      </div>
      <input
        ref={inputRef}
        style={{ marginLeft: "auto" }}
        name="inputChecker"
        type="checkbox"
        checked={boxChecked}
        readOnly        
        // defaultChecked={boxChecked}
      />
    </li>
  );
});
