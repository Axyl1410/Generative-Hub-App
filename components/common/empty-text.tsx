const EmptyText = ({ text }: { text: string }) => {
  return (
    <div className="mt-10 flex h-[500px] justify-center">
      <p className="max-w-lg text-center text-lg font-semibold text-black dark:text-white">
        {text}
      </p>
    </div>
  );
};

export default EmptyText;
