// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(" ")[1];
      
//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from token - INCLUDE ROLE
//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({ 
//           success: false,
//           message: "User not found" 
//         });
//       }

//       // CRITICAL FIX: Ensure role is set on req.user object
//       if (!req.user.role) {
//         req.user.role = 'user'; // Default role if not set
//       }

//       // Check if user is active (if you have status field)
//       if (req.user.status && req.user.status !== 'Active') {
//         return res.status(403).json({ 
//           success: false,
//           message: "User account is inactive" 
//         });
//       }

//       // Add decoded info to req.user for consistency
//       req.user.id = req.user._id;

//       next();
//     } catch (error) {
//       console.error("Auth middleware error:", error);
      
//       // More detailed error messages
//       if (error.name === 'JsonWebTokenError') {
//         return res.status(401).json({ 
//           success: false,
//           message: "Invalid token" 
//         });
//       }
//       if (error.name === 'TokenExpiredError') {
//         return res.status(401).json({ 
//           success: false,
//           message: "Token expired, please login again" 
//         });
//       }
      
//       return res.status(401).json({ 
//         success: false,
//         message: "Not authorized, token failed" 
//       });
//     }
//   } else {
//     return res.status(401).json({ 
//       success: false,
//       message: "Not authorized, no token provided" 
//     });
//   }
// };


// export const adminOnly = (req, res, next) => {
//   if (req.user?.role !== 'superadmin') {
//     return res.status(403).json({ message: 'Access denied. Admins only.' });
//   }
//   next();
// };

// export default protect;




import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      
      console.log('🔑 Token received:', token.substring(0, 20) + '...');
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded:', decoded);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.error('❌ User not found for ID:', decoded.id);
        return res.status(401).json({ 
          success: false,
          message: "User not found" 
        });
      }

      console.log('✅ User authenticated:', {
        _id: req.user._id,
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      });

      // CRITICAL: Ensure role is set
      if (!req.user.role) {
        req.user.role = 'user';
      }

      // Check if user is active
      if (req.user.status && req.user.status !== 'Active') {
        return res.status(403).json({ 
          success: false,
          message: "User account is inactive" 
        });
      }

      // CRITICAL: Set both _id and id for compatibility
      req.user.id = req.user._id.toString();

      next();
    } catch (error) {
      console.error("❌ Auth middleware error:", error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: "Invalid token" 
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: "Token expired, please login again" 
        });
      }
      
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, token failed" 
      });
    }
  } else {
    console.error('❌ No authorization header');
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, no token provided" 
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

export default protect;