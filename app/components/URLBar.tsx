"use client";
import { ChangeEvent, useState, useEffect, use } from "react";
import { Params } from "../page";

const URLBar = ({ error, prevError, nextError }: Params) => {
  const [text, setText] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e?.target.value);
  };

  useEffect(() => {
    if (error) {
      setText(error);
    }
    if (prevError) {
      setText(prevError);
    }
    if (nextError) {
      setText(nextError);
    }
  }, [error, prevError, nextError]);

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-1/3 items-center">
      <div className="flex flex-col md:flex-row w-full justify-center">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter URL"
          className="input bg-stone-600 w-full text-stone-300"
        />
        <a className="btn" href={"/reader?url=" + text}>
          Submit
        </a>
      </div>
      {error ? (
        <p className="text-red-600 font-bold ">
          URL &quot;{error}&quot; could not be parsed
        </p>
      ) : null}
      {prevError ? (
        <p className="text-red-600 font-bold ">Could not find prev URL</p>
      ) : null}
      {nextError ? (
        <p className="text-red-600 font-bold ">Could not find next URL</p>
      ) : null}
    </div>
  );
};

export default URLBar;
