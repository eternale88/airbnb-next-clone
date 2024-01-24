import { RefObject, useEffect } from "react";

interface ClickProps {
  ref: RefObject<HTMLElement>;
  callback: () => void;
}

const UseClickOutside = ({ ref, callback }: ClickProps) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      //second condition after  && is checking if it's not a child of menuRef, which means the click happened outside.
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, callback]);
};

export default UseClickOutside;
