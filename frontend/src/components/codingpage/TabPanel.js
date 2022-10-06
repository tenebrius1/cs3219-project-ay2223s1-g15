import { Box, Typography } from "@mui/material";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      className="adminAreaDisplay"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box height={"70vh"} padding={"1%"} overflow={'auto'}>
          <Typography
            style={{
              whiteSpace: 'pre-line',
            }}
          >
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
