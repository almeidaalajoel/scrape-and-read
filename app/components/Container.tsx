import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="dark">
      <div className="flex flex-col items-center flex-grow bg-[rgb(230,230,230)] dark:bg-black">
        {children}
      </div>
    </div>
  );
}
