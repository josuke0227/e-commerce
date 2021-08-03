import { useEffect } from "react";
import { Grow, Button } from "@material-ui/core";

const AutocompleteActionButtons = ({
  buttonState,
  loading,
  action,
  setAction,
  handleCancelButtonClick,
  handleActionButtonClick,
}) => {
  useEffect(() => {
    if (!buttonState) return;
    const keys = Object.keys(buttonState);

    let action;
    keys.forEach((k) => {
      if (buttonState[k] === true) action = k;
    });
    if (action === undefined) return setAction("");
    setAction(action);
  }, [buttonState, setAction]);

  const renderButton = (label) => {
    return (
      <Grow in={action === label}>
        <>
          <Button
            disabled={loading}
            variant="outlined"
            color="primary"
            onClick={handleActionButtonClick}
          >
            {label}
          </Button>
          <Button
            disabled={loading}
            variant="outlined"
            color="default"
            onClick={handleCancelButtonClick}
          >
            cancel
          </Button>
        </>
      </Grow>
    );
  };
  return action && renderButton(action);
};

export default AutocompleteActionButtons;
