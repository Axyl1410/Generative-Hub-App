import FileUpload from "@/components/FileUpload";

const HomePage = () => {
  return (
    <div>
      <h1>Upload Script to Generate Art</h1>
      <FileUpload />
      <div>
        <iframe src="/index.html" width="100%" height="600px"></iframe>
      </div>
    </div>
  );
};

export default HomePage;
