import { FC, ReactNode } from "react";
import Header from "./header";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="mt-8">{children}</div>
    </>
  );
};

export default Layout;
