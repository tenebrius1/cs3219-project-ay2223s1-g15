import { Box, Button, Typography } from "@mui/material";
import "./codingpage.css";
import { useState } from "react";
import BasicTab from "./BasicTab";
import CodePad from "./CodePad";
import { Link } from "react-router-dom";
import CodingLanguageSelector from "./CodingLanguageSelector";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CodingPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="mainCodingPageBox">
      <Box className="codingSpace">
        <Box className="titleBar">
          <CodingLanguageSelector />
          <Button
            component={Link}
            to="/dashboard"
            variant="outlined"
            color="error"
          >
            End Interview
          </Button>
        </Box>
        <CodePad />
      </Box>
      <Box className="adminSpace">
        <BasicTab />
      </Box>
    </Box>
  );
}

export default CodingPage;
