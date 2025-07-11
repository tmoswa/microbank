import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AuthProvider from './context/AuthContext';
import Spinner from './components/Spinner';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={<Spinner />} persistor={persistor}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);
