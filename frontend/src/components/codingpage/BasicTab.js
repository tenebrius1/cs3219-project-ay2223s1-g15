import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import TabPanel from './TabPanel';
import './codingpage.css';

function BasicTab({ output }) {
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
    <>
      <Box className='adminArea'>
        <Box sx={{ borderColor: 'divider' }}>
          <Tabs
            value={value}
            variant={'fullWidth'}
            onChange={handleChange}
            aria-label='basic tabs example'
            textColor={'secondary'}
            indicatorColor={'secondary'}
          >
            <Tab label='Question' {...a11yProps(0)} />
            <Tab label='Notes' {...a11yProps(1)} />
            <Tab label='Output' {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel
          children={'Commodo in amet laboris dolor tempor.'}
          value={value}
          index={0}
        />
        <TabPanel
          children={
            <TextField
              fullWidth
              multiline
              variant='filled'
              placeholder={'Write your notes here'}
              color={'secondary'}
              focused={true}
              InputProps={{
                disableUnderline: true,
                sx: {
                  height: '70vh',
                },
              }}
              margin='none'
            />
          }
          value={value}
          index={1}
        />
        <TabPanel children={output} value={value} index={2} />
      </Box>
      <Box className='endTurnBox'>
        <Button variant='outlined' color='error'>
          End Turn
        </Button>
      </Box>
    </>
  );
}

export default BasicTab;
