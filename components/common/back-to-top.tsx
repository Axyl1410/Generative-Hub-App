"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const BackToTop = () => {
  const [Visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () =>
      window.scrollY > 50 ? setVisible(true) : setVisible(false);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {Visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="group fixed bottom-2 right-2 rounded-lg shadow"
          onClick={handleClick}
        >
          <span className="absolute inset-0 -z-10 h-full w-full rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 filter transition-all duration-300 ease-out group-hover:blur-[8px]" />

          <div
            className={
              "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background p-1.5 text-black transition-colors hover:border-sky-500 dark:border-white dark:bg-background-dark dark:text-white dark:hover:border-sky-500 lg:h-9 lg:w-9"
            }
          >
            <ChevronUp className="size-5 lg:size-6" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
