import * as React from 'react';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {Box,Typography} from '@mui/material';

export default function CircularLoader(props:any) {
  return (
    <Box sx={{ display: 'flex' }}>
      {props.isLoader && <CircularProgress />}
    </Box>
  );
}
