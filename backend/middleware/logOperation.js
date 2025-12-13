import Operation from "../models/Operation.js";

export const logOperation = (type) => {
  return async (req, res, next) => {
    try {
      // Store the original send function
      const originalSend = res.send;

      res.send = async function (body) {
        // Determine status: success if 2xx, fail otherwise
        const success = res.statusCode >= 200 && res.statusCode < 300 ? "success" : "fail";

        await Operation.create({
          type,
          status: success,
          userId: req.user?._id, // if you use authentication
          details: `${req.method} ${req.originalUrl}`
        });

        originalSend.call(this, body);
      };

      next();
    } catch (err) {
      console.error("Operation logging failed:", err);
      next();
    }
  };
};
