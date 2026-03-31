import React, { lazy, Suspense } from "react";
import Layout from "./containers/Layout";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { KeycloakProvider } from "./context/KeycloakContext";
import { ProjectProvider } from "./context/ProjectContext";
import { ToastProvider } from "./context/ToastContext";
import { LabourProvider } from "./context/LabourContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AppProvider } from './context/AppContext';
import LoadingSpinner from './Components/common/LoadingSpinner';
import { LoadingBar } from './Components/common/LoadingSpinner';
import { AnimatePresence } from 'framer-motion';
import { ClientProvider } from './context/ClientContext';

const Login = lazy(() => import("./Pages/Login.js"));

// ErrorBoundary for catching lazy load errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'red', textAlign: 'center' }}>
          <h2>Something went wrong while loading this page.</h2>
          <pre>{this.state.error?.message || String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const useKeycloak = process.env.REACT_APP_USE_KEYCLOAK === 'true';

  const AppContent = () => (
    <AuthProvider>
      <ProjectProvider>
        <AppProvider>
          <LabourProvider>
            <ToastProvider>
              <ClientProvider>
                <Router>
                  <LoadingBar />
                  <AnimatePresence mode="wait">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="/" element={<Navigate to="/login" replace />} />
                          <Route
                            path="/app/*"
                            element={
                              <ProtectedRoute>
                                <Layout />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                      </Suspense>
                    </ErrorBoundary>
                  </AnimatePresence>
                </Router>
              </ClientProvider>
            </ToastProvider>
          </LabourProvider>
        </AppProvider>
      </ProjectProvider>
    </AuthProvider>
  );

  return useKeycloak ? (
    <KeycloakProvider>
      <AppContent />
    </KeycloakProvider>
  ) : (
    <AppContent />
  );
}

export default App;