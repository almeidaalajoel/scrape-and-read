"use client";
import * as cheerio from "cheerio";
import Navigation from "../components/Navigation";
import Container from "../components/Container";
import Loader from "../components/Loader";
import ElementParser from "../components/ElementParser";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Reader() {
  const [body, setBody] = useState("");
  const [prev, setPrev] = useState("");
  const [next, setNext] = useState("");
  const [prevNavigationError, setPrevNavigationError] = useState(false);
  const [nextNavigationError, setNextNavigationError] = useState(false);
  const [elements, setElements] = useState<cheerio.Element[]>([]); // [cheerio.Element]
  const [domain, setDomain] = useState("");
  const [pathname, setPathname] = useState("");
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const $ = cheerio.load(body);

  useEffect(() => {
    if (url) {
      const urlObj = new URL(url);
      setDomain(urlObj.hostname);
      setPathname(urlObj.pathname);
    }
  }, [url]);

  useEffect(() => {
    const makeRequest = async () => {
      const res = await fetch("/api/fetchbody?url=" + url);
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
    if (domain == "xianxiaengine.com")
      setElements(entry.find(".bullet-comment-span, h1, hr").get());
    else setElements(entry.find("p, img, h1, h2, h3, h4, h5, h6, hr").get());

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
  }, [body, url, domain, pathname]);

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
        <div className="flex flex-col space-y-6 lg:space-y-8 my-6 break-words">
          <Navigation
            prevURL={prev}
            nextURL={next}
            url={url}
            prevNavigationError={prevNavigationError}
            nextNavigationError={nextNavigationError}
          />
          {body ? (
            <ElementParser elements={elements} $={$} domain={domain} />
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
      <div className="flex flex-grow flex-col w-full lg:w-[65%] xl:w-[53%] text-[rgb(10,10,10)] bg-white dark:bg-[rgb(23,21,21)] dark:text-[rgb(200,200,200)] p-2 lg:p-12 lg:pt-6 leading-7 text-xl border border-solid border-gray-300 dark:border-gray-900 items-center">
        <Loader />
      </div>
    </Container>
  );
}

export const dynamic = "force-dynamic";
