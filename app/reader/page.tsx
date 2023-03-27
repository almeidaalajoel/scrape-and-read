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
  // if (!url) redirect("/");
  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const entry = $(".entry-content");
    const ps = entry.find("p, img").not(":has(a)").get();

    let prev = entry.find("a:icontains('prev')").attr("href") || "";
    if (!prev) {
      prev = entry.find("a:icontains('previous')").attr("href") || "";
    }
    let next = entry.find("a:icontains('next')").attr("href") || "";

    return (
      <Container>
        <div className="flex flex-grow flex-col w-full lg:w-[65%] xl:w-[53%] text-[rgb(10,10,10)] bg-white dark:bg-[rgb(23,21,21)] dark:text-[rgb(200,200,200)] p-2 lg:p-12 lg:pt-6 leading-7 text-xl border border-solid border-gray-300 dark:border-gray-900">
          <div className="flex flex-col space-y-4 my-6 break-words text-2xl">
            {ps.map((ele, i) => {
              if (ele.name == "p") return <p key={i}>{$(ele).text()}</p>;
              else {
                return (
                  <div key={i} className="xl:w-[50%] self-center">
                    <img
                      src={$(ele).attr("data-orig-file") || ""}
                      alt="img"
                      sizes={$(ele).attr("sizes")}
                    />
                  </div>
                );
              }
            })}
            <div className="h-[150px]" />
            <Navigation
              prevURL={"/reader?url=" + prev}
              nextURL={"/reader?url=" + next}
            />
          </div>
        </div>
      </Container>
    );
  } catch (e) {
    console.log(e);
    return redirect("/?error=" + url);
  }
}

export const dynamic = "force-dynamic";
