export default function handler(req, res) {
  const { password } = req.body;

  // Hardcoded password check (replace with your actual logic)
  if (password === "your_secret_password") {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
}
