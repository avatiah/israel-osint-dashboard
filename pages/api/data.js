export default function handler(req, res) {
  res.status(200).json({ 
    status: "ONLINE", 
    message: "Threat Engine API is working",
    index: 42,
    last_update: new Date().toISOString(),
    signals: []
  });
}
