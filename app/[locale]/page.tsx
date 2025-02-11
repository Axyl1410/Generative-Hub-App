import Loading from "@/components/common/loading";
import { WorldMap } from "@/components/ui/world-map";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function Page() {
  const t = useTranslations("home");

  return (
    <div className="w-full bg-background py-10 dark:bg-background-dark">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xl font-bold text-black dark:text-white md:text-4xl">
          {t("title")}
        </p>
        <p className="mx-auto max-w-2xl py-4 text-sm text-neutral-500 md:text-lg">
          {t("content")}
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <WorldMap
          dots={[
            {
              start: {
                lat: 64.2008,
                lng: -149.4937,
              }, // Alaska (Fairbanks)
              end: {
                lat: 34.0522,
                lng: -118.2437,
              }, // Los Angeles
            },
            {
              start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
              end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            },
            {
              start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 28.6139, lng: 77.209 }, // New Delhi
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
          ]}
        />
      </Suspense>
    </div>
  );
}
