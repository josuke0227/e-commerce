import { IconButton } from "@material-ui/core";
import MoreIcon from "@material-ui/icons/MoreVert";

const ShowMoreButton = ({ mobileMenuId, handleMobileMenuOpen }) => {
  return (
    <IconButton
      aria-label="show more"
      aria-controls={mobileMenuId}
      aria-haspopup="true"
      onClick={handleMobileMenuOpen}
      color="inherit"
    >
      <MoreIcon />
    </IconButton>
  );
};

export default ShowMoreButton;
