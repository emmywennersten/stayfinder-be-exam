import PropertyList from "@/components/PropertyList";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
      <PropertyList searchParams={searchParams} />
    </main>
  );
}
