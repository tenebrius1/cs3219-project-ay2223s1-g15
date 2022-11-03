import { Box, Button, Typography } from "@mui/material";
import "./codingpage.css";
import { useState } from "react";
import BasicTab from "./BasicTab";
import CodePad from "./CodePad";
import { Link, useNavigate } from "react-router-dom";
import CodingLanguageSelector from "./CodingLanguageSelector";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CodingPage() {
  const [value, setValue] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("python");
  const [output, setOutput] = useState('Output');
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEndClick = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <Box className="mainCodingPageBox">
      <Box className="codingSpace">
        <Box className="titleBar">
          <CodingLanguageSelector currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage} />
          <Button
            onClick={handleEndClick}
            variant="outlined"
            color="error"
          >
            End Interview
          </Button>
        </Box>
        <CodePad currentLanguage={currentLanguage} setOutput={setOutput} />
      </Box>
      <Box className="adminSpace">
        <BasicTab output={output} />
      </Box>
    </Box>
  );
}

export default CodingPage;
