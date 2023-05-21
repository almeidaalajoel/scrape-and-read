"use client";
import * as cheerio from "cheerio";
/* eslint-disable @next/next/no-img-element */

export default function ElementParser({
  elements,
  $,
  domain,
}: {
  elements: cheerio.Element[];
  $: cheerio.CheerioAPI;
  domain: string;
}) {
  if (domain == "xianxiaengine.com")
    return (
      <>
        {elements.map((ele, i) => {
          const text = $(ele).text();
          if (ele.name == "span") {
            if (text.trim()) return <p key={i}>{text}</p>;
          } else if (ele.name == "h1") {
            return <h1 key={i}>{text}</h1>;
          } else if (ele.name == "hr") {
            return <hr key={i} />;
          }
        })}
      </>
    );
  else
    return (
      <>
        {elements.map((ele, i) => {
          const text = $(ele).text();
          if (ele.name == "p") {
            if (text.trim()) return <p key={i}>{text}</p>;
          } else if (ele.name == "img") {
            const origSrc = $(ele).attr("src");
            let src = origSrc;
            if (origSrc?.startsWith("//")) src = "https:" + origSrc;
            else if (origSrc?.startsWith("/")) {
              src = "https://" + domain + origSrc;
            }
            return (
              <div key={i} className="xl:w-[50%] self-center">
                <img src={src || ""} alt="img" sizes={$(ele).attr("sizes")} />
              </div>
            );
          } else if (ele.name == "h1") {
            return <h1 key={i}>{text}</h1>;
          } else if (ele.name == "h2") {
            return <h2 key={i}>{text}</h2>;
          } else if (ele.name == "h3") {
            return <h3 key={i}>{text}</h3>;
          } else if (ele.name == "h4") {
            return <h4 key={i}>{text}</h4>;
          } else if (ele.name == "h5") {
            return <h5 key={i}>{text}</h5>;
          } else if (ele.name == "h6") {
            return <h6 key={i}>{text}</h6>;
          } else if (ele.name == "hr") {
            return <hr key={i} />;
          }
        })}
      </>
    );
}
