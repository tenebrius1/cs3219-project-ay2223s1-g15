import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function TabPanel({ children, value, index, height, ...other }) {
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
        <Box height={height} sx={{padding: "3%"}} overflow={"auto"}>
          <Typography
            style={{
              whiteSpace: "pre-line",
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
