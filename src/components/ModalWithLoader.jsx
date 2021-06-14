import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Zoom,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";
import CheckIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { Container, Modal } from "@material-ui/core";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    margin: "0 auto",
    width: "70vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column",
    height: "50vh",
  },
  iconSuccess: {
    fill: green[500],
    fontSize: "4rem",
  },
  iconFailure: {
    fontSize: "4rem",
    fill: red[500],
  },
  loaderWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const ModalWithLoader = ({
  loading,
  success,
  open,
  setOpen,
  submittingError,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const handleModalClose = () => {
    setOpen(false);
    success === true && history.go(0);
  };

  return (
    <>
      <Modal
        className={classes.modalContainer}
        open={open}
        disableBackdropClick
      >
        <Container>
          <Paper className={classes.contentWrapper}>
            <Typography variant="h5" align="center">
              {loading && success === null && "Creating new product..."}
              {success && "Success!"}
              {success === false && submittingError}
            </Typography>
            <Box className={classes.loaderWrapper}>
              {loading && success === null && (
                <CircularProgress size="3.5rem" />
              )}
              {success && (
                <Zoom in={success}>
                  <CheckIcon className={classes.iconSuccess} />
                </Zoom>
              )}
              {success === false && (
                <Zoom in={success === false}>
                  <CancelIcon className={classes.iconFailure} />
                </Zoom>
              )}
            </Box>
            <Button
              className={classes.button}
              variant="contained"
              color="default"
              onClick={handleModalClose}
              // couldn't pass "success: null" to useStyles
              style={{ visibility: success !== null ? "visible" : "hidden" }}
            >
              Close
            </Button>
          </Paper>
        </Container>
      </Modal>
    </>
  );
};

export default ModalWithLoader;
