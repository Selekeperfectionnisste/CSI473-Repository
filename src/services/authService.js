// src/services/authService.js

// Register user via PHP
const register = async (userData) => {
  console.log('🔵 STARTING REGISTRATION PROCESS');
  console.log('📨 User data received:', userData);
  
  try {
    const payload = {
      id: userData.userId, // User-entered ID
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      contact_number: userData.phone,
      password: userData.password,
      home_address: userData.address || '',
      user_type: userData.userType
    };

    console.log('📤 Payload being sent to server:', payload);

    // Validate required fields
    if (!payload.id) {
      return { 
        success: false, 
        message: 'User ID is required' 
      };
    }

    if (!payload.password) {
      return { 
        success: false, 
        message: 'Password is required' 
      };
    }

    const API_URL = "http://localhost/server/registration.php";
    
    console.log('🌐 Making request to:', API_URL);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Response status:', response.status);

    // Get the response text first
    const responseText = await response.text();
    console.log('📥 Raw response text:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed JSON data:', data);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      throw new Error('Server returned invalid JSON: ' + responseText);
    }

    if (data.status === "success") {
      return { 
        success: true, 
        message: data.message 
      };
    } else {
      return { 
        success: false, 
        message: data.message || "Registration failed", 
        errors: data.errors || {} 
      };
    }

  } catch (error) {
    console.error('💥 NETWORK ERROR:', error);
    
    return { 
      success: false, 
      message: `Registration error: ${error.message}` 
    };
  }
};

// Login function
// In authService.js - fix the login function
const login = async (email, password) => {
  console.log('🔵 STARTING LOGIN PROCESS');
  console.log('📨 Login credentials:', { email });
  
  try {
    const payload = { email, password };

    const response = await fetch("http://localhost/server/login.php", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Login response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('📥 Raw login response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed login data:', data);
    } catch (parseError) {
      throw new Error('Server returned invalid JSON');
    }

    if (data.status === "success") {
      // FIX: Ensure we have the correct user_type
      const userData = data.user;
      const userType = userData.user_type; // This should be 'security' or 'member'
      
      console.log('💾 Login - User data to store:', {
        userData,
        userType,
        hasUserType: !!userType
      });

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'user-authenticated');
      localStorage.setItem('userType', userType);
      
      return { 
        success: true, 
        message: data.message, 
        user: userData,
        redirectTo: data.redirect_to,
        userType: userType // Add this explicitly
      };
    } else {
      return { 
        success: false, 
        message: data.message || "Login failed" 
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      message: "Server connection failed" 
    };
  }
};

// Check if user is logged in
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get current user
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get user type
const getUserType = () => {
  return localStorage.getItem('userType');
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
};

export const authService = {
  register,
  login,
  isAuthenticated,
  getCurrentUser,
  getUserType,
  logout
};