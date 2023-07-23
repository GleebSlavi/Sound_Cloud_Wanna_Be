import { useRef, useState } from "react";

interface Props {
  imgStyleClass: string;
  defaultPicture: string;
  imageUrl: string;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const ImageUpload = ({
  imgStyleClass,
  defaultPicture,
  imageUrl,
  setImage,
  setImageUrl,
}: Props) => {
  const fileInputRefImg = useRef<HTMLInputElement>(null);
  let file: File | null = null;

  const [hovering, setHovering] = useState(false);

  const handleFileSelectImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      file = selectedFile;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className={"container add-picture-container"}>
      <img
        className={`add-picture${imgStyleClass}`}
        src={!imageUrl ? defaultPicture : imageUrl}
        onClick={() => fileInputRefImg.current?.click()}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      />
      {hovering && <span className="picture-text-pop-up">Add photo</span>}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRefImg}
        style={{ display: "none" }}
        onChange={handleFileSelectImg}
      />
    </div>
  );
};

export default ImageUpload;
