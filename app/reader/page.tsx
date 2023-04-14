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
    const ps = entry
      .find("p, img, h1, h2, h3, h4, h5, h6")
      .not(":has(a)")
      .get();

    let prev = entry.find("a:icontains('prev')").attr("href") || "";
    if (!prev) {
      prev = entry.find("a:icontains('previous')").attr("href") || "";
    }
    let next = entry.find("a:icontains('next')").attr("href") || "";
    let navigationError = false;
    if (!prev) {
      prev = "/?prevError=" + url;
      navigationError = true;
    }
    if (!next) {
      next = "/?nextError=" + url;
      navigationError = true;
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
          <div className="flex flex-col space-y-8 my-6 break-words">
            {ps.map((ele, i) => {
              if (ele.name == "p") {
                return <p key={i}>{$(ele).text()}</p>;
              } else if (ele.name == "img") {
                return (
                  <div key={i} className="xl:w-[50%] self-center">
                    <img
                      src={$(ele).attr("src") || ""}
                      alt="img"
                      sizes={$(ele).attr("sizes")}
                    />
                  </div>
                );
              } else if (ele.name == "h1") {
                return <h1 key={i}>{$(ele).text()}</h1>;
              } else if (ele.name == "h2") {
                return <h2 key={i}>{$(ele).text()}</h2>;
              } else if (ele.name == "h3") {
                return <h3 key={i}>{$(ele).text()}</h3>;
              } else if (ele.name == "h4") {
                return <h4 key={i}>{$(ele).text()}</h4>;
              } else if (ele.name == "h5") {
                return <h5 key={i}>{$(ele).text()}</h5>;
              } else if (ele.name == "h6") {
                return <h6 key={i}>{$(ele).text()}</h6>;
              }
            })}
            <div className="h-[150px]" />
            <Navigation
              prevURL={prev}
              nextURL={next}
              navigationError={navigationError}
            />
          </div>
        </div>
      </Container>
    );
  } catch (e) {
    return redirect("/?error=" + url);
  }
}

export const dynamic = "force-dynamic";
