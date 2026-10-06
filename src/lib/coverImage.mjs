const UPLOAD_COVER = /^(\/uploads\/.+)\.(jpe?g|png)$/i;

export const coverPicture = (src = "") => {
  const match = String(src).match(UPLOAD_COVER);

  if (!match) {
    return { fallback: src, webpSrcSet: "", sizes: "" };
  }

  const base = match[1];
  return {
    fallback: src,
    webpSrcSet: `${base}-640.webp 640w, ${base}.webp 1200w`,
    sizes: "(max-width: 768px) 100vw, 1200px",
  };
};
