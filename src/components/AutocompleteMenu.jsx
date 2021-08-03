import { useState, useEffect } from "react";
import { IconButton, Popover, List, ListItem } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const AutocompleteMenu = ({
  options,
  label,
  handleListItemClick,
  buttonState,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setAnchorEl(null);
  }, [buttonState]);

  const handleMenuIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const iconStyle = {
    marginRight: "0.5rem",
  };

  return (
    <>
      <IconButton color="default" onClick={handleMenuIconClick}>
        <MenuIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List>
          <ListItem button onClick={() => handleListItemClick("add")}>
            <AddIcon style={iconStyle} />
            {`Add new ${label}`}
          </ListItem>
          {options.length > 0 && (
            <>
              <ListItem button onClick={() => handleListItemClick("edit")}>
                <EditIcon style={iconStyle} /> {`Edit ${label}`}
              </ListItem>
              <ListItem button onClick={() => handleListItemClick("delete")}>
                <DeleteOutlineIcon style={iconStyle} />
                {`Delete ${label}`}
              </ListItem>
            </>
          )}
        </List>
      </Popover>
    </>
  );
};

export default AutocompleteMenu;
