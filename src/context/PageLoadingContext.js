import React, { createContext, useState, useContext } from 'react';
import { Spinner, Box } from '@chakra-ui/react';

const PageLoadingContext = createContext();

export const PageLoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading) => {
    setIsLoading(loading);
  };

  return (
    <PageLoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            backgroundColor="white"
            zIndex="9998"
            animation="fadeIn 0.3s ease"
          />
          <Spinner
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="9999"
            color="blue.500"
            size="xl"
          />
        </>
      )}
    </PageLoadingContext.Provider>
  );
};

export const usePageLoading = () => useContext(PageLoadingContext);
