import Container from "./components/Container";
import URLBar from "./components/URLBar";

interface PageProps {
    searchParams: Params;
}

interface Params {
    error: string;
}

export default function Home({ searchParams: { error } }: PageProps) {
    return (
        <div className="bg-stone-900 min-h-[100dvh] flex justify-center items-center">
            <div className="flex flex-col w-full items-center">
                <URLBar error={error} />
            </div>
        </div>
    );
}
