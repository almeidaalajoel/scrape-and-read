/* eslint-disable @next/next/no-img-element */
import * as cheerio from "cheerio";
import Navigation from "../components/Navigation";
import { redirect } from "next/navigation";
import Container from "../components/Container";

export default async function Reader({
  searchParams: { url },
}: {
  searchParams: { url: string };
}) {
  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const entry = $("html");
    const elements = entry
      .find("p, img, h1, h2, h3, h4, h5, h6, hr")
      .not(":has(a)")
      .get();

    let prev = entry.find("a:icontains('prev')").attr("href") || "";
    let next = entry.find("a:icontains('next')").attr("href") || "";
    let prevNavigationError = false;
    let nextNavigationError = false;

    if (!prev || !next) {
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

    return (
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
            {elements.map((ele, i) => {
              const text = $(ele).text();
              if (ele.name == "p") {
                if (text.trim()) {
                  return <p key={i}>{text}</p>;
                }
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
            })}
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
    );
  } catch (e: any) {
    console.log(e);
    return redirect("/?error=" + url);
  }
}

export const dynamic = "force-dynamic";
