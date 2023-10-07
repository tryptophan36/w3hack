import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard({title,price,image,description,id}:{title:string,price:number,image:string,description:string,id:number}) {
  return (
    <Card sx={{width:"25%",margin:"1rem",Height:"200px"}}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
        <Typography sx={{ fontSize: 14 }} color="black" gutterBottom>
          {title}
        </Typography>
        <img 
        style={{height:"10rem",width:"10 rem" ,margin:"1rem 0"}}
        src={image} alt="" />
        <p>${price}</p>
        <Box >
        <Button  size="small">Buy Now</Button>
        <Button size="small">Pay Later</Button>
      </Box>
        </Box>
       
      </CardContent>
      
    </Card>
  );
}
