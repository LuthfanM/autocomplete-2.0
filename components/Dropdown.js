import React, { useRef, useState, useEffect } from "react";
import { usePopper } from "react-popper";
import classNames from "classnames";
import { ListedItems } from "./ListedItems";
import useDebounce from "@/hooks/useDebounce";
import { IconInput } from "./IconInput";
import { DOWN_KEY, ENTER_KEY, ESC_KEY, UP_KEY } from "@/constants";
import useOutsideAlerter from "@/hooks/useOutsiderClick";

const Dropdown = (Props) => {
  const {
    data,
    title,
    width,
    disabled,
    loading,
    onChangeText,
    description,
    async,
  } = Props;

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listItemRef = useRef(null);
  useOutsideAlerter(listRef);
  const { styles, attributes } = usePopper(inputRef.current, listRef.current, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const [isClicked, setIsClicked] = useState(false);

  const [settings, setSettings] = useState({
    active: 0,
    filtered: [],
    userInput: "",
    checked: [],
  });
  const debouncedValue = useDebounce(settings.userInput, 500);

  // just run for syn
  useEffect(() => {
    if (!async) {
      const handleClick = (event) => {
        if (inputRef.current && inputRef.current.contains(event.target)) {
          setIsClicked(true);
          setSettings({
            active: settings.active,
            filtered: data,
            userInput: settings.userInput,
            checked: settings.checked,
          });
          document.removeEventListener("mousedown", handleClick);
        } else {
          setIsClicked(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }
  }, [isClicked]);

  console.log("clicked", settings);

  const onChange = (e) => {
    if (onChangeText && debouncedValue.length <= 0) onChangeText();

    const userInput = e.currentTarget.value;

    if (loading && userInput.length <= 0) {
      return;
    }

    setSettings({
      active: settings.active,
      filtered: settings.filtered,
      userInput: userInput,
      checked: settings.checked,
    });
  };

  useEffect(() => {
    let filteredData;
    if (debouncedValue.length > 0)
      filteredData = data.filter(
        (d) =>
          d?.name.toLowerCase().indexOf(debouncedValue.toLowerCase()) != -1 ||
          d?.description.toLowerCase().indexOf(debouncedValue.toLowerCase()) !=
            -1
      );

    setSettings({
      active: settings.active,
      filtered: filteredData,
      userInput: settings.userInput,
      checked: settings.checked,
    });
  }, [debouncedValue]);

  const closeList = () => {
    setSettings({
      active: settings.active,
      filtered: settings.filtered,
      userInput: "",
      checked: [],
    });
    if (!async) {
      setIsClicked(false);
    }
  };

  const onKeyDown = (e) => {
    const { active, filtered } = settings;
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
      listItemRef.current.clickItem();
      // setSettings({
      //   active: active,
      //   filtered: settings.filtered,
      //   userInput: filtered[active],
      //   checked: [...settings.checked, filtered[active]]
      // });
      return;
    } else if (e.keyCode === UP_KEY) {
      if (active === 0) {
        return;
      }
      setSettings({
        active: active - 1,
        filtered: settings.filtered,
        userInput: settings.userInput,
        checked: settings.checked,
      });
      // scrollToItem(active - 1);
    } else if (e.keyCode === DOWN_KEY) {
      if (active === filtered?.length - 1) {
        return;
      }
      setSettings({
        active: active + 1,
        filtered: settings.filtered,
        userInput: settings.userInput,
        checked: settings.checked,
      });
      // scrollToItem(active + 1);
    } else if (e.keyCode === ESC_KEY) {
      console.log("Closed by ESC");
      closeList();
    }
  };

  const onListedClick = (e) => {
    // console.log(e);
  };

  const onUpdateSettings = (val) => {
    setSettings({
      active: val,
      filtered: settings.filtered,
      userInput: settings.userInput,
      checked: settings.checked,
    });
  };

  return (
    <div className="relative w-full min-h-full">
      <div className="p-4 h-1/2 w-full flex flex-col overflow-visible">
        <p className="mb-2">{title}</p>
        <div
          ref={inputRef}
          style={{
            width: `${width ? width : "200"}px`,
          }}
          // onClick={setOpen ? setOpen : null}
        >
          <IconInput
            placeholder={description}
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={settings.value}
            disabled={disabled}
            isLoading={loading}
          />
          <div
            className={classNames("flex z-10", {
              "invisible pointer-events-none":
                debouncedValue.length || isClicked > 0 ? false : true,
            })}
            ref={listRef}
            style={{ ...styles.popper, width: "inherit" }}
            {...attributes.popper}
          >
            {settings.filtered?.length > 0 && (
              <ListedItems
                ref={listItemRef}
                active={settings.active}
                items={settings.filtered}
                onUpdateSettings={onUpdateSettings}
                onListClick={(e) => onListedClick(e)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Dropdown.defaultProps = {
  data: [],
};

export default Dropdown;
