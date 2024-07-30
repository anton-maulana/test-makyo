import React from 'react';
import './app.container.css';
import {RouterProvider} from "react-router-dom";
import {AppRouter} from "../routes/app.route";

function App() {
  return (
      <div className="App">
          <header className="bg-amber-50 text-gray-900 p-4 text-center sticky top-0 drop-shadow-md">
              <nav>
                  <ul className="flex justify-items-start space-x-4">
                      <li>
                          <a href="#" className="hover:text-gray-200">Home</a>
                      </li>
                      <li>
                          <a href="#" className="hover:text-gray-200">Config</a>
                      </li>
                  </ul>
              </nav>
          </header>

          <main className="p-4 mt-4">
              <RouterProvider router={AppRouter} />
          </main>
      </div>
  );
}

export default App;
