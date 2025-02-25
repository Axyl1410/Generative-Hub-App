import styles from "@/styles/skeleton.module.scss";
import { useMemo } from "react";

type Props = {
  width?: string;
  height?: string;
  type?: "default" | "image";
  imageAspectRatio?: "square" | "1:1" | "4:3" | "16:9";
};

export default function Skeleton({
  height,
  width,
  type = "default",
  imageAspectRatio = "16:9",
}: Props) {
  const aspectRatioStyle = useMemo(() => {
    if (type !== "image" || !imageAspectRatio) return {};

    const ratioMap = {
      square: "1/1",
      "1:1": "1/1",
      "4:3": "4/3",
      "16:9": "16/9",
    };

    return {
      aspectRatio: ratioMap[imageAspectRatio],
    };
  }, [imageAspectRatio, type]);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: "inherit",
        ...aspectRatioStyle,
      }}
      className={`${styles.skeleton} ${type === "image" ? styles.image : ""}`}
      aria-label="Loading"
      role="progressbar"
    />
  );
}
