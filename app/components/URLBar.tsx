"use client";
import React, { ChangeEvent, useState } from "react";
import Link from "next/link";

const URLBar = () => {
  const [text, setText] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e?.target.value);
  };

  return (
    <>
      <input value={text} onChange={handleChange} />
      <Link href={"/reader?url=" + text}>Submit</Link>
    </>
  );
};

export default URLBar;
