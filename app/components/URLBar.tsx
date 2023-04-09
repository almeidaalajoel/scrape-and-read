"use client";
import { ChangeEvent, useState } from "react";

const URLBar = ({ error }: { error: string }) => {
    const [text, setText] = useState("");
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e?.target.value);
    };

    return (
        <div className="flex flex-col w-1/3 items-center">
            <div className="flex flex-row w-full justify-center">
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
        </div>
    );
};

export default URLBar;
