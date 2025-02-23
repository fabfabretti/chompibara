import { useRef } from "react";
import "./FileLoader.css";

type FileLoaderProps = {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
};

function FileLoader(props: FileLoaderProps) {
  // State
  // State is managed by parent

  // Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  //Functions
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      props.setImage(file);
    }
  };
  return (
    <div className="upload-file" onClick={handleUploadClick}>
      <div className="filedropper-text1">
        Drop your picture to import your meal
      </div>
      <div className="filedropper-text2">or click to browse</div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default FileLoader;
