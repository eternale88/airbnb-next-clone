"use client";
//app folders have to have client components defined
// as they are server components by default. We don't want to mix and match, server components will fetch data from the database

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className='
			max-w-[2520px]
      mx-auto
      xl:px-20
      md:px-10
      sm:px-2
      px-4'
    >
      {children}
    </div>
  );
};

export default Container;
