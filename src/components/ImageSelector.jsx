import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Avatar, Badge, Grid, Typography } from "@material-ui/core";
import ImagePreviewer from "./ImagePreviewer";

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

const ImageSelector = ({ values, setValues }) => {
  const classes = useStyles();
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [fileSize, setFileSize] = useState(0);

  const handleImageRemove = (fileName) => {
    const images = { ...values.images };
    Object.keys(images).forEach((key) => {
      if (images[key].name === fileName) {
        delete images[key];
      }
    });
    setValues({ ...values, images });
  };

  const handleInputChange = (e) => {
    setValues({ ...values, images: e.target.files });
  };

  const handleImageClick = (imageUrl, e) => {
    e.stopPropagation(e);
    setSelectedImageUrl(imageUrl);
    setOpen(true);
  };

  const renderedTotalFileSize = () => {
    let totalSize = 0;
    const keys = Object.keys(values.images);
    if (keys.length > 0) {
      keys.forEach((key) => (totalSize += values.images[key].size));
    }

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
        selectedImageUrl={selectedImageUrl}
      />
      <Grid item xs={12}>
        {Object.keys(values.images).map((key, index) => {
          const file = values.images[key];
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
          onChange={handleInputChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload Image(s)
          </Button>
        </label>
      </Grid>
    </Grid>
  );
};

export default ImageSelector;
