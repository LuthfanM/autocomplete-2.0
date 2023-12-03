import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomCard from "@/components/Cards";
import { Items } from "./Items";

export const ListedItems = forwardRef((props, ref) => {
  const { items = [], onListClick, active, onUpdateSettings } = props;

  const itemsRef = useRef([]);
  const [hoveredComponents, setHoveredComponents] = useState([]);

  const handleMouseEnter = (index) => {
    setHoveredComponents((prevHovered) => [...prevHovered, index]);
    onUpdateSettings(index);
  };

  const handleMouseLeave = (index) => {
    setHoveredComponents((prevHovered) =>
      prevHovered.filter((hoveredIndex) => hoveredIndex !== index)
    );
    onUpdateSettings(index);
  };

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, items.length);
  }, [items]);

  useEffect(() => {
    if (active !== null) {
      itemsRef.current[active]?.scrollIntoView();
    }
  }, [active]);

  useImperativeHandle(ref, () => {
    return {
      clickItem: () => onClickItem(),
    };
  });

  const onClickItem = () => {
    if (active !== null) {
      itemsRef.current[active].clickItem();
    }
  };

  const onChange = (value) => {
    onListClick(value);
  };

  return (
    <CustomCard className="p-2 flex flex-col flex-1 max-h-60 overflow-scroll w-[210px] text-red-600">
      <ul className="h-3/5">
        {items.map((val, idx) => {
          let temp;

          if (idx === active) {
            hoveredComponents.includes(active)
              ? (temp = "text-white cursor-pointer")
              : (temp = "bg-blue-600 text-white cursor-pointer");
          }

          return (
            <Items
              key={idx}
              ref={(el) => (itemsRef.current[idx] = el)}
              value={val}
              onClick={onChange}
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
              className={temp + " hover:bg-blue-300"}
            />
          );
        })}
      </ul>
    </CustomCard>
  );
});
