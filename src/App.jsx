import React from "react";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { ThemeProvider } from "./provider/ThemeProvider";
import AuthProvider from "./provider/AuthProvider";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
