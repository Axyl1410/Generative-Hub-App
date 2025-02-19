import FileUpload from "@/components/FileUpload";
import { useTranslations } from "next-intl";

const HomePage = () => {
  const t = useTranslations("test");
  return (
    <div>
      <h1>{t("Upload_Script")} </h1>
      <FileUpload />
      <div>
        <iframe src="/index.html" width="100%" height="600px"></iframe>
      </div>
    </div>
  );
};

export default HomePage;
