import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Avatar, Badge, Grid, Typography } from "@material-ui/core";
import ImagePreviewer from "./ImagePreviewer";
import { isEmptyObject } from "../util/isEmptyObject";
import { isArray } from "../util/isArray";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { deleteImage } from "../services/productServices";
import ConfirmDialog from "./shared/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(1),
  },
  input: {
    display: "none",
  },
  avatarImage: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  buttonContainer: {
    marginTop: theme.spacing(1),
  },
  avatarWrapper: {
    margin: theme.spacing(1),
    flexDirection: "column",

    "& > p": {
      margin: 0,
    },
  },
}));

const ImageSelector = ({ images, setImages, errors, user }) => {
  const classes = useStyles();
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState("");
  const [open, setOpen] = useState(false);
  const [initialImages, setInitialImages] = useState([]);
  const [image, setImage] = useState(null);

  // ConfirmDialog dependencies
  const INITIAL_RESULT_STATE = { success: null, message: "" };
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(INITIAL_RESULT_STATE);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (isArray(images)) setInitialImages(images);
  }, [images]);

  const handleFileObjectRemove = (image) => {
    filterObject(image);
  };

  const handleInitialImageRemove = async (image) => {
    setImage(image);
    setShowDialog({ show: true, message: "Are you sure to remove image?" });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await deleteImage(image.public_id, user);
      filterArray(image);
      setResult({ ...result, success: true });
    } catch (error) {
      const message = "Image delete failed.";
      setResult({ message, success: false });
    }
    setLoading(false);
    setShowDialog({ ...showDialog, show: false });
  };

  const handleCancel = () => {
    setShowDialog({ ...showDialog, show: false });
    setResult(INITIAL_RESULT_STATE);
  };

  const filterArray = (image) => {
    const updatedImages = initialImages.filter((i) => i._id !== image._id);
    setInitialImages(updatedImages);
  };

  const filterObject = (image) => {
    const currentImages = { ...images };
    Object.keys(currentImages).forEach((key) => {
      if (currentImages[key].name === image) {
        delete currentImages[key];
      }
    });
    setImages(currentImages);
  };

  const handleImageClick = (imageUrl, e) => {
    e.stopPropagation(e);
    setSelectedImageUrl(imageUrl);
    setOpen(true);
  };

  const renderedTotalFileSize = () => {
    if (isEmptyObject(images)) return;

    let totalSize = 0;
    const keys = Object.keys(images);
    if (keys.length > 0) {
      keys.forEach((key) => (totalSize += images[key].size));
    } else if (keys.length < 1) return;

    return (
      <Typography>Total file size: {getMegaByte(totalSize)} / 3 MB</Typography>
    );
  };

  const getMegaByte = (byte) => {
    const megaByte = byte / 1000000;
    return megaByte.toFixed(2) + "MB";
  };

  const handleButtonClick = () => {
    let randomString = Math.random().toString(36);

    setFileInputKey(randomString);
  };

  return (
    <>
      <ConfirmDialog
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        showDialog={showDialog}
        loading={loading}
        result={result}
      />
      <Grid container className={classes.container}>
        <ImagePreviewer
          open={open}
          setOpen={setOpen}
          content={
            <img
              src={selectedImageUrl}
              width="100%"
              onClick={() => setOpen(false)}
              alt="small selected images."
            />
          }
        />
        <Grid item xs={12}>
          {initialImages.length > 0 &&
            initialImages.map((i, idx) => (
              <Badge
                key={idx}
                badgeContent={"x"}
                color="secondary"
                onClick={() => handleInitialImageRemove(i)}
                className={classes.avatarWrapper}
              >
                <Avatar
                  className={classes.avatarImage}
                  variant="square"
                  src={i.url}
                  onClick={(e) => handleImageClick(i.url, e)}
                />
              </Badge>
            ))}
          {initialImages.length > 0 && (
            <AddCircleOutlineIcon color="disabled" />
          )}
          {!isEmptyObject(images) &&
            !isArray(images) &&
            Object.keys(images).map((key, index) => {
              const file = images[key];
              const imageUrl = URL.createObjectURL(file);
              return (
                <Badge
                  key={index}
                  badgeContent={"x"}
                  color="secondary"
                  onClick={() => {
                    handleFileObjectRemove(file.name);
                  }}
                  className={classes.avatarWrapper}
                >
                  <Avatar
                    className={classes.avatarImage}
                    variant="square"
                    src={imageUrl}
                    onClick={(e) => handleImageClick(imageUrl, e)}
                  />
                  <Typography variant="caption" display="block">
                    {getMegaByte(file.size)}
                  </Typography>
                </Badge>
              );
            })}
        </Grid>
        <Grid item xs={12}>
          {!isEmptyObject(images) &&
            !isArray(images) &&
            renderedTotalFileSize()}
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => setImages(e.target.files)}
            key={fileInputKey || ""}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="outlined"
              color="primary"
              component="span"
              onClick={handleButtonClick}
            >
              Choose Image(s)
            </Button>
          </label>
        </Grid>
        <Typography color="error">{errors}</Typography>
      </Grid>
    </>
  );
};

export default ImageSelector;
