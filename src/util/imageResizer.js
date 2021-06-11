import Resizer from "react-image-file-resizer";

export const imageResizer = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      720,
      720,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
