"use client";
import { ChangeEvent, useState } from "react";

const URLBar = () => {
  const [text, setText] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e?.target.value);
  };

  return (
    <>
      <input value={text} onChange={handleChange} />
      <a href={"/reader?url=" + text}>Submit</a>
    </>
  );
};

export default URLBar;
