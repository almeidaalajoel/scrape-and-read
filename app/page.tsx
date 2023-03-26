import URLBar from "./components/URLBar";

interface PageProps {
  searchParams: Params;
}

interface Params {
  error: string;
}

export default function Home({ searchParams: { error } }: PageProps) {
  return (
    <main>
      <div className="">
        <URLBar />
        {error ? <p>URL &quot;{error}&quot; could not be parsed</p> : null}
      </div>
    </main>
  );
}
