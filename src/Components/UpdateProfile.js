import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const profile = location.state?.profileInput;
    const userId = location.state?.userID;

    return (
   <div className="min-h-screen bg-gray-900 text-gray-200">
    <div className="container mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-8">
              
        </div>
    </div>
   </div>
    );
}

export default UpdateProfile;