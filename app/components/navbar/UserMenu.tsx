"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  // handle user clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={menuRef}>
      <div className='flex flex-row items-center gap-3'>
        <div
          onClick={() => {}}
          className='
            hidden
            md:block
            text-sm 
            font-semibold 
            py-3 
            px-4 
            rounded-full 
            hover:bg-neutral-100 
            transition 
            cursor-pointer'
        >
          Airbnb your home
        </div>
        <div
          onClick={toggleOpen}
          className='
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          '
        >
          <AiOutlineMenu />
        </div>
        <div className='hidden md:block'>
          <Avatar />
        </div>
      </div>
      {isOpen && (
        <div
          className='
					absolute 
					rounded-xl 
					shadow-md
					w-[40vw]
					md:w-3/4 
					bg-white 
					overflow-hidden 
					right-0 
					top-12 
					text-sm
			'
        >
          <div className='flex flex-col cursor-pointer'>
            <>
              <MenuItem onClick={() => {}} label='Login' />
              <MenuItem onClick={() => {}} label='Sign up' />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
