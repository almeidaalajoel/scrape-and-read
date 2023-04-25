/* eslint-disable @next/next/no-img-element */
import Navigation from "../components/Navigation";
import { redirect } from "next/navigation";
import Container from "../components/Container";

interface ParsedData {
  name: string;
  text: string;
  src: string;
  sizes: string;
}

interface MyData {
  parsed: ParsedData[];
  next: string;
  nextNavigationError: boolean;
  prev: string;
  prevNavigationError: boolean;
}

export const runtime = "experimental-edge";

export default async function Reader({
  searchParams: { url },
}: {
  searchParams: { url: string };
}) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, url }),
    };
    const elementsResponse = await fetch(
      "http://localhost:3000/api/cheerioparse",
      options
    );
    const elements = await elementsResponse.json();
    const {
      parsed,
      next,
      nextNavigationError,
      prev,
      prevNavigationError,
    }: MyData = elements;

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
            <Navigation
              prevURL={prev}
              nextURL={next}
              url={url}
              prevNavigationError={prevNavigationError}
              nextNavigationError={nextNavigationError}
            />
            {parsed.map((ele, i) => {
              const text = ele.text;
              if (ele.name == "p") {
                if (text) return <p key={i}>{text}</p>;
              } else if (ele.name == "img") {
                let src = ele.src;
                if (src.startsWith("/")) {
                  let domain = new URL(url).hostname;
                  src = "https://" + domain + src;
                }
                return (
                  <div key={i} className="xl:w-[50%] self-center">
                    <img src={src || ""} alt="img" sizes={ele.sizes} />
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
    return redirect("/?error=" + url);
  }
}

export const dynamic = "force-dynamic";
