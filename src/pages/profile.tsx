import {useCallback,useState,useEffect} from 'react'
import {Typography,Box} from '@mui/material'
import Navbar from '../components/navbar/Navbar'
import ShowUI from '@/components/magic/wallet-methods/ShowUi';
import { useMagicContext } from '@/components/magic/MagicProvider';
import UserInfo from '@/components/magic/cards/UserInfoCard';
import {getDoc,getUnsignedDoc} from "../utils/contractMethods.js"
function Profile  ()  {
  const [account, setAccount] = useState<string | null>(null);
  const [email,setEmail]=useState<string|undefined>("");
  const { magic } = useMagicContext();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setAccount(user);
    const checkAuth=async ()=>{
      if (!magic) return;
    try {
      const {email} = await magic.user.getMetadata();
      setEmail(email?.split('@')[0])
      
    } catch (error) {
      // setDisabled(false);
      console.error(error);
    }
    }
    checkAuth()
    
  }, []);

  useEffect(()=>{
    const getUnsign = async()=>{
      const doc = await getUnsignedDoc(magic,account)
      return doc


    }
    getUnsign().then(v=>console.log("unsigned doc",v))
  },[account])
  return (

    <>
    <Navbar/>
    <div className='home-page'>
      {email && <Typography variant='h4' color='white'>Welcome, </Typography>}
      <Typography variant='h4' marginBottom="2rem" color='white' textTransform='capitalize'>{email} </Typography>
      <ShowUI/>
    <Box display={"flex"} justifyContent={"center"} m={"3rem 0 0 0"}>
   
    </Box>
    {account && <UserInfo setAccount={setAccount}/>}


    </div>
    </>
  )
}

export default Profile