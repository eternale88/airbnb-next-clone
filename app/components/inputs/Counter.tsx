"use client";

import { useCallback } from "react";
import { AiOutlineMinus } from "react-icons/ai";

interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  title,
  subtitle,
  value,
  onChange,
}) => {
  //add ammenities
  const onAdd = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

  //subtract ammenities
  const onReduce = useCallback(() => {
    // we don't want to have negative numbers
    if (value === 1) {
      return;
    }

    onChange(value - 1);
  }, [onChange, value]);

  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-col'>
        <div className='font-medium'>{title}</div>
        <div className='font-light'>{subtitle}</div>
      </div>
      <div className='flex flex-row items-center gap-4'>
        <div
          onClick={onReduce}
          className='
            w-10
            h-10
            rounded-full
            border-[1px]
            border-neutral-400
            flex
            items-center
            justify-center
            text-neutral-600
            cursor-pointer
            hover:opacity-80
            transition
          '
        >
          <AiOutlineMinus />
        </div>
      </div>
    </div>
  );
};

export default Counter;