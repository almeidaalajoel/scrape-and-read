import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: NextRequest) {
  const parseText = async () => {
    const { text, url } = await request.json();
    const $ = cheerio.load(text);
    const entry = $("html");
    const elements = entry.find("p, img, h1, h2, h3, h4, h5, h6, hr").get();

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
    const parsed = elements.map((ele) => {
      const eleData = {
        name: ele.name,
        text: $(ele).text(),
        src: "",
        sizes: $(ele).attr("sizes") ?? "",
      };
      if ($(ele).attr("src")?.startsWith("/")) {
        let domain = new URL(url).hostname;
        eleData.src = "https://" + domain + $(ele).attr("src");
      } else {
        eleData.src = $(ele).attr("src") ?? "";
      }
      return eleData;
    });
    return { parsed, next, nextNavigationError, prev, prevNavigationError };
  };

  let data;
  try {
    data = await parseText();
  } catch (e) {
    console.log(e);
    return new NextResponse("Failed to parse data", {
      status: 400,
    });
  }
  return NextResponse.json(data);
}
