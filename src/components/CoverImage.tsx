import type { ImgHTMLAttributes } from "react";
import { coverPicture } from "@/lib/coverImage.mjs";

type CoverImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

const CoverImage = ({ src, alt = "", className, ...rest }: CoverImageProps) => {
  const picture = coverPicture(src);

  if (!picture.webpSrcSet) {
    return <img src={src} alt={alt} className={className} {...rest} />;
  }

  return (
    <picture>
      <source type="image/webp" srcSet={picture.webpSrcSet} sizes={picture.sizes} />
      <img src={src} alt={alt} className={className} {...rest} />
    </picture>
  );
};

export default CoverImage;
