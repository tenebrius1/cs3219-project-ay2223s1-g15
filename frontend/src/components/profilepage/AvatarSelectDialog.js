import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "react-avatar-edit";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const AvatarSelectDialog = ({
  onClose,
  selectedValue,
  open,
  onCrop,
  saveImage,
  restoreDefault,
  handleDialogClose,
}) => {
  return (
    <Dialog
      onClose={handleDialogClose}
      open={open}
      fullWidth
      PaperProps={{
        sx: {
          height: "auto",
          maxHeight: "auto",
        },
      }}
    >
      <DialogTitle>
        Upload image
        {handleDialogClose ? (
          <IconButton
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#D8DEE9",
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <Box
        sx={{
          marginLeft: "2%",
          marginRight: "2%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Avatar
          width={"400"}
          height={"300"}
          onClose={onClose}
          onCrop={onCrop}
        />
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="outlined" color="secondary" onClick={restoreDefault}>
            Restore default
          </Button>
          <Button variant="contained" color="secondary" onClick={saveImage}>
            Save
          </Button>
        </Box>
        <br />
      </Box>
    </Dialog>
  );
};

export default AvatarSelectDialog;
