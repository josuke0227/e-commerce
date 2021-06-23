import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Avatar, Badge, Grid, SvgIcon, Typography } from "@material-ui/core";
import ImagePreviewer from "./ImagePreviewer";
import { isEmptyObject } from "../util/isEmptyObject";
import { isArray } from "../util/isArray";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

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

const ImageSelector = ({ images, setImages, error }) => {
  const classes = useStyles();
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState("");
  const [open, setOpen] = useState(false);
  const [initialImages, setInitialImages] = useState([]);

  useEffect(() => {
    if (isArray(images)) setInitialImages(images);
  }, [images]);

  const handleFileObjectRemove = (image) => {
    filterObject(image);
  };

  const handleInitialImageRemove = (image) => {
    filterArray(image);
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
          initialImages.map((i) => (
            <Badge
              key={i._id}
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
        <AddCircleOutlineIcon color="disabled" />
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
        {!isEmptyObject(images) && !isArray(images) && renderedTotalFileSize()}
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
      <Typography color="error">{error && "Invalid data."}</Typography>
    </Grid>
  );
};

export default ImageSelector;
