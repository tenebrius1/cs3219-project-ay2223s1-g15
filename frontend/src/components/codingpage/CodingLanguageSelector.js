import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function CodingLanguageSelector({ currentLanguage, setCurrentLanguage }) {
  const [anchorElement, setAnchorElement] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorElement(null);
    setOpen(false);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setAnchorElement(null);
    setOpen(false)
  };

  return (
    <>
      <Button
        id="language-change-button"
        aria-controls={open ? "language-change-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="secondary"
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon color="secondary" />}
      >
        {currentLanguage}
      </Button>
      <Menu
        id="language-change-menu"
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-change-button",
        }}
      >
        <MenuItem onClick={(event) => handleLanguageChange("python")}>
          Python
        </MenuItem>
        <MenuItem onClick={(event) => handleLanguageChange("java")}>
          Java
        </MenuItem>
        <MenuItem onClick={(event) => handleLanguageChange("c")}>C</MenuItem>
      </Menu>
    </>
  );
}

export default CodingLanguageSelector;
