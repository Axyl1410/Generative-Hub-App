import Link from "next/link";

type Props = {
  text: string;
  link?: string;
  textLink?: string;
};

const EmptyText: React.FC<Props> = ({ text, link, textLink }) => {
  return (
    <div className="mt-10 flex h-[500px] justify-center">
      <div className="max-w-lg text-center text-lg font-semibold text-black dark:text-white">
        {text} {link && <Link href={link} className="text-blue-500 dark:text-blue-400 hover: underline">{textLink}</Link>}
      </div>
    </div>
  );
};

export default EmptyText;
