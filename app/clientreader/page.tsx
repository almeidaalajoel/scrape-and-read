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
    $(entry).find("script, style").remove();
    let prev, next;
    if (url && domain == "xianxiaengine.com") {
      // Special case
      setElements(entry.find(".bullet-comment-span, h1, hr").get());
      let h1 = entry.find("h1").text();
      if (h1.toLowerCase().includes("part 1")) {
        if (pathname.endsWith("/")) next = url.slice(0, url.length - 1);
        next = url + "-part-2";
      }
      if (h1.toLowerCase().includes("part 2")) {
        next = url.replace("-part-2", "");
        prev = next;
        const chapter = next.match(/\d+(?=\D*$)/);
        if (chapter) {
          const nextChapter = parseInt(chapter[0]) + 1;
          next = next.replace(chapter[0], nextChapter.toString());
        }
      }
    } else {
      setElements(entry.find("p, img, h1, h2, h3, h4, h5, h6, hr").get());

      if (domain == "americanfaux.com") {
        // Special case
        const endOfText = $(".wp-block-separator");
        const navLinks = endOfText.next("p");
        const prevLink = navLinks.children("a").first();
        const nextLink = navLinks.children("a").last();
        prev = prevLink.attr("href") || "";
        next = nextLink.attr("href") || "";
      } else if (domain == "zirusmusings.net") {
        // Special case
        prev = entry.find("a:icontains('prev')").last().attr("href") || "";
        next = entry.find("a:icontains('next')").last().attr("href") || "";
      } else {
        prev = entry.find("a:icontains('prev')").attr("href") || "";
        next = entry.find("a:icontains('next')").attr("href") || "";
      }
    }
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
    if (prev && next) {
      const r = new RegExp("^(?:[a-z+]+:)?//", "i");
      if (!r.test(prev)) prev = "https://" + domain + prev;
      if (!r.test(next)) next = "https://" + domain + next;
      setPrev(prev);
      setNext(next);
    }
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
