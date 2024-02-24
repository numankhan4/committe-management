import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Initially closed on mobile
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Function to set loading state
  const setLoading = (loading) => {
    setIsLoading(loading);
  };


  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      // Close the sidebar on mobile when window width is less than 768px
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        // Open the sidebar by default on desktop when window width is greater than or equal to 768px
        setIsSidebarOpen(true);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Call handleResize on component mount to set initial sidebar state based on window width
    handleResize();

    // Cleanup function
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array to run this effect only once on component mount

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, isLoading, setLoading }}>
      {children}
    </SidebarContext.Provider>
  );
};
