import React, { useState } from 'react';
import { GithubAuthProvider, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getDoc, doc, collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom';
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
  CloseButton,
  Alert, AlertIcon,
  Spinner
} from "@chakra-ui/react";
// Assets
import signInImage from "./../assets/images/signInImage.jpg";

function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleEmailSignIn = async (e) => {
  
    setError(null);
    setSuccess(null);
    setLoading(true); // Start loading

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = result.user;

      // Check approval status
      const userDoc = doc(collection(firestore, 'users'), loggedInUser.uid);
      const userDocSnapshot = await getDoc(userDoc);

      if (userDocSnapshot.exists() && userDocSnapshot.data().approved) {
        setUser(loggedInUser);
        setSuccess('Login successful!');
        navigate('/app/dashboard'); // Redirect to the dashboard after successful login
      } else {
        setError('User not approved or email not verified');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const loggedInUser = result.user;
        setUser(loggedInUser);
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const loggedInUser = result.user;
        setUser(loggedInUser);
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(result => {
        setUser(null);
        setSuccess('Sign out successful!');
      })
      .catch(error => {
        setError(error.message);
      })
  }

  // Chakra color mode
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");
  return (
    <Flex position='relative' mb='40px'>
       
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        mb='30px'
        pt={{ sm: "100px", md: "0px" }}>
        <Flex
          alignItems='center'
          justifyContent='start'
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}>
          <Flex
            direction='column'
            w='100%'
            background='transparent'
            p='48px'
            mt={{ md: "150px", lg: "80px" }}>
            <Heading color={titleColor} fontSize='32px' mb='10px'>
              Welcome Back
            </Heading>
            <Text
              mb='36px'
              ms='4px'
              color={textColor}
              fontWeight='bold'
              fontSize='14px'>
              Enter your email and password to sign in
            </Text>
            {error && (
                <Alert mb='15px' status="error" mt={4}>
                  <AlertIcon />
                  {error}
                  <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError(null)} />
                </Alert>
              )}
              {success && (
                <Alert mb='15px' status="success" mt={4}>
                  <AlertIcon />
                  {success}
                  <CloseButton position="absolute" right="8px" top="8px" onClick={() => setSuccess(null)} />
                </Alert>
              )}
            <FormControl>
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Email
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='24px'
                fontSize='sm'
                type='text'
                placeholder='Your email adress'
                size='lg'
                required 
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSignIn();
                  }
                }}
              />
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Password
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='36px'
                fontSize='sm'
                type='password'
                placeholder='Your password'
                size='lg'
                required
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSignIn();
                  }
                }}
              />
              <FormControl display='flex' alignItems='center'>
                <Switch id='remember-login' colorScheme='teal' me='10px' />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  ms='1'
                  fontWeight='normal'>
                  Remember me
                </FormLabel>
              </FormControl>
              {loading ? ( // Render the loader when loading is true
              <Spinner  mt='20px'  mb='20px' fontSize='10px'/>
            ) : (<>
              <Button
                fontSize='10px'
                type='submit'
                bg='teal.300'
                w='100%'
                h='45'
                mb='20px'
                color='white'
                mt='20px'
                _hover={{
                  bg: "teal.200",
                }}
                _active={{
                  bg: "teal.400",
                }}
                onClick={handleEmailSignIn}
                >
                SIGN IN
              </Button>
              </>
               )}
            </FormControl>
            <Flex
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              maxW='100%'
              mt='0px'>
              <Text color={textColor} fontWeight='medium'>
                Don't have an account?
                <Link as={ReactRouterLink} to='/register' color={titleColor}  ms='5px' fontWeight='bold'>
                  Sign Up
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX='hidden'
          h='100%'
          w='40vw'
          position='absolute'
          right='0px'>
          <Box
            bgImage={signInImage}
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius='20px'></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Login;
