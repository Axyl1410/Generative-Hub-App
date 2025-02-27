import BackButton from "@/components/common/back-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl">Explore</h1>
        <BackButton className="h-fit" />
      </div>
      {children}
    </div>
  );
}
