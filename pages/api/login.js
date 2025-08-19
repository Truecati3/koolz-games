import crypto from "crypto";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body;

  // Hash the password provided by the user
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  // Compare against env variable (set in .env.local)
  if (hash === process.env.ACCESS_PASSWORD_SHA256) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: "Invalid password" });
  }
}
