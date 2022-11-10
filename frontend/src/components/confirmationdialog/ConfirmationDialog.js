import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

const ConfirmationDialog = ({
  open,
  close,
  confirm,
  title,
  body,
  accept,
  decline,
}) => {
  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      scroll={"paper"}
      PaperProps={{
        sx: {
          height: "auto",
          maxHeight: "90%",
        },
      }}
    >
      <DialogTitle>
        {title}
        {close && (
          <IconButton
            onClick={close}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#D8DEE9",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography>{body}</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "2%",
            }}
          >
            <Button color="error" variant="outlined" onClick={close}>
              {decline}
            </Button>
            <Button color="secondary" variant="contained" onClick={confirm}>
              {accept}
            </Button>
          </Box>
        </Box>
      </DialogTitle>
    </Dialog>
  );
};

export default ConfirmationDialog;
