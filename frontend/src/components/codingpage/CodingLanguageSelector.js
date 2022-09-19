import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function CodingLanguageSelector() {
  const [anchorElement, setAnchorElement] = useState(null);
  const open = anchorElement;
  const [currentLanguage, setCurrentLanguage] = useState("python");

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setAnchorElement(null);
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
