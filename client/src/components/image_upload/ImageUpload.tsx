import { useRef, useState } from "react";
import { uploadFileToS3, getKeyFromS3Uri } from "../../s3";

interface Props {
  containerStyleClass: string;
  imgStyleClass: string;
  defaultPicture: string;
  imageUrl: string;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  image: File | null;
  bucket: string;
  callSecondFunction: boolean;
}

const ImageUpload = ({
  imgStyleClass,
  defaultPicture,
  imageUrl,
  setImage,
  setImageUrl,
  containerStyleClass,
  image,
  bucket,
  callSecondFunction,
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

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelectImg(event);
    if (callSecondFunction && file) {
      await uploadFileToS3(
        file!,
        bucket,
        setImageUrl,
        getKeyFromS3Uri(imageUrl)
      );
    }
  };

  return (
    <div className={`container${containerStyleClass}`}>
      <img
        className={imgStyleClass}
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
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageUpload;
