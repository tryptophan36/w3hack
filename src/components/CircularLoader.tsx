import * as React from 'react';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {Box,Typography} from '@mui/material';

export default function CircularLoader() {
  const [isLoader,setIsLoader]=useState<boolean>(true)
  React.useEffect(()=>{
     setIsLoader(true)
     setTimeout(()=>setIsLoader(false),10000)
  })
  return (
    <Box sx={{ display: 'flex' }}>
      {isLoader && <CircularProgress />}
      <Typography>Unverified</Typography>
    </Box>
  );
}
