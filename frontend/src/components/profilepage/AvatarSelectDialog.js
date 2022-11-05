import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Button } from "@mui/material";
import Avatar from "react-avatar-edit";

const AvatarSelectDialog = ({ onClose, selectedValue, open, onCrop, saveImage, restoreDefault, handleDialogClose }) => {

  return (
    <Dialog
      onClose={handleDialogClose} 
      open={open} 
      fullWidth
      PaperProps={{
        sx: {
          height: "auto",
          maxHeight: "auto"
        }
      }}
    >
      <DialogTitle>Upload image</DialogTitle>
      <Box
        sx={{
          marginLeft: "2%",
          marginRight: "2%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Avatar 
          width={"400"}
          height={"300"}
          onClose={onClose}
          onCrop={onCrop}
          // cropRadius={115}
          // labelStyle={{
          //     color: "#ECEFF4"
          // }}
          // imageWidth={'700'}
        />
        <br/>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Button variant="outlined" color="secondary" onClick={restoreDefault}>Restore default</Button>
          <Button variant="contained" color="secondary" onClick={saveImage}>Save</Button>
        </Box>
        <br/>
      </Box>
    </Dialog>
  );
};

export default AvatarSelectDialog;
