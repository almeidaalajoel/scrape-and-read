"use client";
/* eslint-disable @next/next/no-img-element */
import * as cheerio from "cheerio";
import Navigation from "../components/Navigation";
import Container from "../components/Container";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Reader() {
  const [body, setBody] = useState("");
  const [prev, setPrev] = useState("");
  const [next, setNext] = useState("");
  const [prevNavigationError, setPrevNavigationError] = useState(false);
  const [nextNavigationError, setNextNavigationError] = useState(false);
  const [elements, setElements] = useState<cheerio.Element[]>([]); // [cheerio.Element]
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const $ = cheerio.load(body);

  useEffect(() => {
    const makeRequest = async () => {
      const res = await fetch("/api/fetchbody?url=" + url);
      console.log(res.status);
      if (res.status == 200) {
        const responseText = await res.text();
        setBody(responseText);
      } else {
        window.location.href = "/?error=" + url;
      }
    };
    makeRequest();
  }, [url, setBody]);

  useEffect(() => {
    const entry = $("html");
    setElements(
      entry
        .find("p, img, h1, h2, h3, h4, h5, h6, hr")
        .not(":has(a)")
        .get() as cheerio.Element[]
    );

    let prev = entry.find("a:icontains('prev')").attr("href") || "";
    let next = entry.find("a:icontains('next')").attr("href") || "";
    let prevNavigationError = false;
    let nextNavigationError = false;

    if (!prev || !next) {
      if (url) {
        const chapter = url.match(/\d+(?=\D*$)/);
        if (chapter) {
          let chapterNum = parseInt(chapter[0]);
          if (!prev) {
            let prevChapter = chapterNum - 1;
            prev = url.replace(chapter[0], prevChapter.toString());
          }
          if (!next) {
            let nextChapter = chapterNum + 1;
            next = url.replace(chapter[0], nextChapter.toString());
          }
        } else {
          if (!prev) {
            prev = "/?prevError=" + url;
            prevNavigationError = true;
          }
          if (!next) {
            next = "/?nextError=" + url;
            nextNavigationError = true;
          }
        }
      }
    }
    setPrev(prev);
    setNext(next);
    setPrevNavigationError(prevNavigationError);
    setNextNavigationError(nextNavigationError);
  }, [body, url]);

  return url ? (
    <Container>
      <div
        style={{
          fontFamily: "Bookerly",
          lineHeight: "2rem",
          fontSize: "1.25rem",
        }}
        className="flex flex-grow flex-col w-full lg:w-[65%] xl:w-[53%] text-[rgb(10,10,10)] bg-white dark:bg-[rgb(23,21,21)] dark:text-[rgb(200,200,200)] p-2 lg:p-12 lg:pt-6 leading-7 text-xl border border-solid border-gray-300 dark:border-gray-900"
      >
        <div className="flex flex-col space-y-8 my-6 break-words">
          <Navigation
            prevURL={prev}
            nextURL={next}
            url={url}
            prevNavigationError={prevNavigationError}
            nextNavigationError={nextNavigationError}
          />
          {body ? (
            elements.map((ele, i) => {
              const text = $(ele).text();
              if (ele.name == "p") {
                if (text) return <p key={i}>{text}</p>;
              } else if (ele.name == "img") {
                let src;
                if ($(ele).attr("src")?.startsWith("/")) {
                  let domain = new URL(url).hostname;
                  src = "https://" + domain + $(ele).attr("src");
                } else {
                  src = $(ele).attr("src");
                }
                return (
                  <div key={i} className="xl:w-[50%] self-center">
                    <img
                      src={src || ""}
                      alt="img"
                      sizes={$(ele).attr("sizes")}
                    />
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
            })
          ) : (
            <Loader />
          )}
          <div className="h-[150px]" />
          <Navigation
            prevURL={prev}
            nextURL={next}
            url={url}
            prevNavigationError={prevNavigationError}
            nextNavigationError={nextNavigationError}
          />
        </div>
      </div>
    </Container>
  ) : (
    <Container>
      <div
        style={{
          fontFamily: "Bookerly",
          lineHeight: "2rem",
          fontSize: "1.25rem",
        }}
        className="flex flex-grow flex-col w-full lg:w-[65%] xl:w-[53%] text-[rgb(10,10,10)] bg-white dark:bg-[rgb(23,21,21)] dark:text-[rgb(200,200,200)] p-2 lg:p-12 lg:pt-6 leading-7 text-xl border border-solid border-gray-300 dark:border-gray-900 items-center"
      >
        <Loader />
      </div>
    </Container>
  );
}

export const dynamic = "force-dynamic";
