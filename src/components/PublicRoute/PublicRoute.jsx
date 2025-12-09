import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}) => {
    const loggedIn = useAuth();
    return !loggedIn ? children : <Navigate to="/inbox" replace />;
};

export default PublicRoute;