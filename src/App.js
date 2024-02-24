// App.js
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import AppRouter from './AppRouter';
import {SidebarProvider} from './context/SidebarContext';
import { PageLoadingProvider } from './context/PageLoadingContext';

const App = () => {
  return (
    <div>
      <ChakraProvider>
      
        <SidebarProvider>
        <PageLoadingProvider>
         <AppRouter />
        </PageLoadingProvider>
        </SidebarProvider>
        
      </ChakraProvider>
    </div>
  );
};

export default App;
