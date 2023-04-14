import Container from "./components/Container";
import URLBar from "./components/URLBar";

interface PageProps {
  searchParams: Params;
}

export interface Params {
  error: string;
  prevError: string;
  nextError: string;
}

export default function Home({ searchParams }: PageProps) {
  const { error, prevError, nextError } = searchParams;
  return (
    <div className="bg-stone-900 min-h-[100dvh] flex justify-center items-center">
      <div className="flex flex-col w-full items-center">
        <URLBar error={error} prevError={prevError} nextError={nextError} />
      </div>
    </div>
  );
}
