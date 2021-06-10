import { makeStyles } from "@material-ui/core/styles";
import { Container, Modal } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ImagePreviewer = ({ open, setOpen, selectedImageUrl }) => {
  const classes = useStyles();
  return (
    <Modal
      className={classes.modalContainer}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Container>
        <img
          src={selectedImageUrl}
          width="100%"
          onClick={() => setOpen(false)}
        />
      </Container>
    </Modal>
  );
};

export default ImagePreviewer;
