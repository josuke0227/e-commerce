import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Avatar, Badge, Grid, Typography } from "@material-ui/core";
import ImagePreviewer from "./ImagePreviewer";
import { isEmptyObject } from "../util/isEmptyobject";

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

const ImageSelector = ({ images, setValues, error }) => {
  const classes = useStyles();
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleImageRemove = (fileName) => {
    const currentImages = { ...images };
    Object.keys(currentImages).forEach((key) => {
      if (currentImages[key].name === fileName) {
        delete currentImages[key];
      }
    });
    setValues(currentImages);
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
        {!isEmptyObject(images) &&
          Object.keys(images).map((key, index) => {
            const file = images[key];
            const imageUrl = URL.createObjectURL(file);
            return (
              <Badge
                key={index}
                badgeContent={"x"}
                color="secondary"
                onClick={() => {
                  handleImageRemove(file.name);
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
        {renderedTotalFileSize()}
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
          onChange={(e) => setValues(e.target.files)}
        />
        <label htmlFor="contained-button-file">
          <Button variant="outlined" color="primary" component="span">
            Choose Image(s)
          </Button>
        </label>
      </Grid>
      <Typography color="error">{error && "Invalid data."}</Typography>
    </Grid>
  );
};

export default ImageSelector;
