import React from 'react'
import {Box,TextField} from '@mui/material'
const CreateVc = () => {
    
    const handleSubmit=()=>{
        
    }

  return (
    
    <Box>
     <form action=""
      onSubmit={handleSubmit}
     >
      <h3>Proof Of Name</h3>
     <TextField id="outlined-basic" label="Name..." variant="outlined" />
     </form>
    </Box>
  )
}

export default CreateVc