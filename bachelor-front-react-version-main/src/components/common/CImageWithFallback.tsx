import { useState } from "react";
// @ts-ignore
import fallbackImage from "../../assets/images/image_failed_to_load.svg";

interface Props {
  src?: string;
  className?: string;
}

function CImageWithFallback(props: Props) {
  const { src, className } = props;

  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  function handleOnError() {
    setImgSrc(fallbackImage);
  }

  return <img alt="" src={imgSrc ? imgSrc : fallbackImage} onError={handleOnError} className={className} />;
}

export default CImageWithFallback;
