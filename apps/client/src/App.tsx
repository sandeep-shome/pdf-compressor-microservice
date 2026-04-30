import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "@/pages/root-page";
import Download from "@/pages/download-page";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      index: true,
      element: <Root />,
    },
    {
      path: "/download/:id",
      element: <Download />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
