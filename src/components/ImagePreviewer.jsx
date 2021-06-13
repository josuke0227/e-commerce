import { makeStyles } from "@material-ui/core/styles";
import { Container, Modal } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ImagePreviewer = ({ open, setOpen, content }) => {
  const classes = useStyles();
  return (
    <Modal
      className={classes.modalContainer}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Container>{content}</Container>
    </Modal>
  );
};

export default ImagePreviewer;
