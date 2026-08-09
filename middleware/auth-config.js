import path from "path";

const requireAuth = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.session.authenticated) return next();

  const acceptHeader = req.get("Accept") || "";
  const contentTypeHeader = req.get("Content-Type") || "";
  const expectsJson =
    req.method === "POST" ||
    acceptHeader.includes("application/json") ||
    contentTypeHeader.includes("application/json");

  if (expectsJson) {
    return res.status(401).json({ error: "not authenticated" });
  }

  res.sendFile(path.join(process.cwd(), "html", "auth.html"));
};

export default requireAuth;
