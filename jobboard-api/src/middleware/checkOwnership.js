// middlewares/ownership.js
export const checkOwnership = (getResourceFn, resourceIdParam = "id", ownerField = "user_id") => {
  /**
   * getResourceFn: async function(id) => returns the resource from DB
   * resourceIdParam: route param that contains the resource ID (default "id")
   * ownerField: field in the resource that stores the owner's user ID (default "user_id")
   */
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await getResourceFn(resourceId);

      if (!resource) return res.status(404).json({ message: "Resource not found" });

      // Admins bypass ownership check
      if (req.user.role === "admin" || resource[ownerField] === req.user.id) {
        req.resource = resource; // attach resource for controller if needed
        return next();
      }

      return res.status(403).json({ error: "Access denied" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
};
