import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './container/app.container';
import reportWebVitals from './reportWebVitals';
import {DummyService} from "./services/dummy.service";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const services = {
    dummyService: new DummyService()
};

export type ServicesContextType = {
    dummyService: DummyService;
};

export const AppContext = createContext<ServicesContextType | null>(null);
const { Provider } = AppContext;

root.render(
  <React.StrictMode>
      <Provider value={services}>
          <App />
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
