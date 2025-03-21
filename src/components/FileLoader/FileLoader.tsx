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
    <div
      style={{ cursor: "pointer" }}
      className="upload-file"
      onClick={handleUploadClick}
    >
      <div style={{ textAlign: "center" }} className="filedropper-text2">
        Click to {props.image ? "change" : "import"} your meal photo
      </div>
      <input
        style={{ display: "none" }}
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
      <div style={{ color: "var(--primary-color)", minWidth: "100px" }}>
        {props.image
          ? props.image.name.length > 10
            ? props.image.name.slice(0, 10) + "..."
            : props.image.name
          : ""}
      </div>
    </div>
  );
}

export default FileLoader;
