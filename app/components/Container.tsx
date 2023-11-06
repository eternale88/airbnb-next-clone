//app folders have to have client components defined
// as they are server components by default. We don't want to mix and match, server components will fetch data from the database

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Container;
