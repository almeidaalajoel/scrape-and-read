import URLBar from "./components/URLBar";

export interface Params {
  error: string | undefined;
  prevError: string | undefined;
  nextError: string | undefined;
  url: string | undefined;
}

export default function Home({ searchParams }: { searchParams: Params }) {
  const { error, prevError, nextError, url } = searchParams;
  return (
    <div className="bg-stone-900 min-h-[100dvh] flex justify-center items-center">
      <div className="flex flex-col w-full items-center">
        <URLBar
          error={error}
          prevError={prevError}
          nextError={nextError}
          url={url}
        />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
