import React from "react";
import { useEffect, useState } from "react";
import ShopProduct from "../components/productcard/ShopProduct";
import Navbar from "../components/navbar/Navbar";
import { Box, Container,Typography,Button,Modal,TextField} from "@mui/material";
import {getUnsignedDoc,getSignedDoc} from "../utils/contractMethods.js"
import { useMagicContext } from '@/components/magic/MagicProvider';
function Services() {
  const { magic } = useMagicContext();
  const [signedData, setSignedData] = useState<any[]>([]);
  const [unsignedData, setUnsignedData] = useState<any[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  useEffect(() => {
    const user = localStorage.getItem('user');
    setAccount(user);
  }, []);
 
  useEffect(()=>{
    const getUnsign = async()=>{
      const doc = await getUnsignedDoc(magic,account)
      return doc

    }
    const getSign = async()=>{
      const doc = await getSignedDoc(magic,account)
      return doc
    }

    getUnsign().then(v=>setUnsignedData(v))
    getSign().then(v=>setSignedData(v))
  },[account])
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minHeight:"400px",
    width: "auto",
    height: "auto",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  
   const signedCards = signedData?.map(c=>{
    return(
      <ShopProduct key = {Number(c)} id = {Number(c)}/>
    )
   })
   const UnsignedCards = unsignedData?.map(c=>{
    return(
      <ShopProduct key = {Number(c)} id = {Number(c)}/>
    )
   })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAddSigner = ()=>{
    
  }
  return (
    <>
      <Navbar />
      <div className="home-page">
        <Button sx={{border:"2px solid black",background:"white",marginTop:"1rem"}}
         onClick={handleOpen}
        >Create Card</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box>
            <Box display="flex" >
            <TextField id="outlined-basic" label="Name" variant="outlined" />
            <Button sx={{border:"1px solid black",}}>Submit</Button>
            </Box>
          <Button sx={{marginTop:"1rem",border:"1px solid black"}}
           onClick={handleAddSigner}
          >Add Signers</Button>
            </Box>
          </Box>
        </Modal>

        <Box >
        </Box>
        {signedData.length>0 && <Box sx={{border:"1px solid black",width:"100%",background:"black", margin:"1rem"}}>
        <Typography variant='h3' textAlign="center" color="white">Signed Cards</Typography>
        <Box
          sx={{
            display:"flex",
            flexWrap:"wrap",
            justifyContent:"flex-start",
          }}
        >
          {signedCards}
        </Box>
        </Box>}

{   unsignedData.length>0 &&     <Box sx={{border:"1px solid black",width:"100%",background:"black"}}>
        <Typography variant='h3' textAlign="center" color="white">Unsigned Cards</Typography>
        <Box
          sx={{
            display:"flex",
            flexWrap:"wrap",
            justifyContent:"flex-start",
          }}
        >
          {UnsignedCards}
        </Box>
        </Box>}
        
      </div>
      <Box></Box>
    </>
  );
}

export default Services;