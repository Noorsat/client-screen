import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainRouting } from "src/routers";

export const Layout = () => {
  return (
    <div>
        <Router>
          <MainRouting />
        </Router>
    </div>
  );
};
