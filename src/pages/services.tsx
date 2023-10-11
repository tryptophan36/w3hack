import React from "react";
import CircularLoader from "@/components/CircularLoader";
import { useEffect, useState } from "react";
import ShopProduct from "../components/productcard/ShopProduct";
import Navbar from "../components/navbar/Navbar";
import { Box, Container,Typography,Button,Modal,TextField} from "@mui/material";
import {getUnsignedDoc,getSignedDoc,createDoc,AddSigner} from "../utils/contractMethods.js"
import { useMagicContext } from '@/components/magic/MagicProvider';
function Services() {
  const { magic } = useMagicContext();
  const [signedData, setSignedData] = useState<any[]>([]);
  const [unsignedData, setUnsignedData] = useState<any[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [meta, setMeta] = useState<string | null>(null);
  const [signer, setSigner] = useState<string | null>(null);
  const [isLoader,setIsLoader]=useState(false)
  const [isLoader2,setIsLoader2]=useState(false)
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
      <ShopProduct key = {Number(c)} id = {Number(c)}  isPending={false}/>
    )
   })
   const UnsignedCards = unsignedData?.map(c=>{
    return(
      <ShopProduct key = {Number(c)} id = {Number(c)} isPending={true}/>
    )
   })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  //fxns
  const handleAddSigner = async()=>{
    setIsLoader(true)
    setTimeout(()=>{
     setIsLoader(false)
    },5000)
    const res= await AddSigner(magic,4,signer)
    console.log(res)
  }

  const create = async()=>{
    setIsLoader2(true)
    setTimeout(()=>{
     setIsLoader2(false)
    },5000)
    const res= await createDoc(magic,meta,account)
    console.log(res)

  }
  return (
    <>
      <Navbar />

      <div className="home-page">
        <Button sx={{border:"2px solid black",background:"white",marginTop:"1rem"}}
         onClick={handleOpen}
        >Create Document</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box height="100%" display="flex" flexDirection="column" >
            <Typography variant="h6" textAlign="center" margin={"0.5rem 0"}>Create Document</Typography>
            <Box display="flex" >
            { <CircularLoader isLoader={isLoader2}/>}
         <TextField id="outlined-basic" label="Name" onChange={(e)=>setMeta(e.target.value)}variant="outlined" />
            <Button sx={{border:"1px solid black"}} onClick={create}>Submit </Button>
            </Box>
            <Typography variant="h6" textAlign="center" margin={"3rem 0 1rem 0"}>Add Signer</Typography>
          <Box display="flex" marginTop="">
          <TextField id="outlined-basic" label="Address" onChange={(e)=>setSigner(e.target.value)}variant="outlined" />
          <Button size="small" sx={{border:"1px solid black"}}
           onClick={handleAddSigner}
          >Add Signers</Button>
          
          </Box>
          { <CircularLoader isLoader={isLoader}/>}
            </Box>
          </Box>
        </Modal>

        <Box >
        </Box>
        {signedData.length>0 && <Box sx={{width:"100%", margin:"1rem"}}>
        <Typography variant='h3' textAlign="center" color="White">Signed Documents</Typography>
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

{  unsignedData.length>0 &&     <Box sx={{width:"100%"}}>
        <Typography variant='h3' textAlign="center" color="black">Unsigned Documents</Typography>
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