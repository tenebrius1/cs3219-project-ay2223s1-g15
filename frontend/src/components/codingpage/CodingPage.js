import { Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import "./codingpage.css";
import { useState } from "react";
import BasicTab from "./BasicTab";
import CodePad from "./CodePad";

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
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
                <Typography>Type your code here</Typography>
                <CodePad />
            </Box>
            <Box className="rightBox">
                <Box className="adminArea">
                    <BasicTab />
                </Box>
                <Box className="endTurnBox">
                    <Button variant="outlined" color="success">End Turn</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default CodingPage;
