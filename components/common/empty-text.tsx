import { Link } from "@/i18n/routing";

interface EmptyTextProps {
  text: string;
  link?: string;
  textLink?: string;
}

const EmptyText = ({ text, link, textLink }: EmptyTextProps) => {
  return (
    <div className="mt-10 flex h-[500px] justify-center">
      <p className="max-w-lg text-center text-lg font-semibold text-black dark:text-white">
        {text}{" "}
        {link && (
          <Link href={link} className="ml-2 text-link underline">
            {textLink}
          </Link>
        )}
      </p>
    </div>
  );
};

export default EmptyText;
