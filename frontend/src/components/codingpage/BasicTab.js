import { useState } from "react";
import { Box, Tab, Tabs, TextField } from "@mui/material";
import TabPanel from "./TabPanel";

function BasicTab() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} variant={"fullWidth"} onChange={handleChange} aria-label="basic tabs example" textColor={"secondary"} indicatorColor={"secondary"}>
                <Tab label="Question" {...a11yProps(0)} />
                <Tab label="Notes" {...a11yProps(1)} />
                <Tab label="Output" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel
                children={
                    <Box sx={{ display: 'flex', padding: 2, height: '22rem' }}>
                        Commodo in amet laboris dolor tempor.
                    </Box>
                }
                value={value}
                index={0}
            />
            <TabPanel
                children={
                    <TextField
                        fullWidth
                        multiline
                        rows={14}
                        placeholder={"Write your notes here"}
                        color={"secondary"}
                        focused={false}
                />}
                value={value}
                index={1}
            />
            <TabPanel
                children={
                    <Box sx={{ display: 'flex', padding: 2, height: '22rem' }}>
                        Output
                    </Box>
                }
                value={value}
                index={2}
            />
        </Box>
    )
}

export default BasicTab;
