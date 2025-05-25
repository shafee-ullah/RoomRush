import React from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { ThemeProvider } from './provider/ThemeProvider';

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </div>
    </ThemeProvider>
  );
};

export default App;