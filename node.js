import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

let simulationMode = false; // server remembers state

// API route to toggle simulation
app.post("/api/toggle", (req, res) => {
  simulationMode = req.body.simulation === true;
  console.log("Simulation mode:", simulationMode ? "ON" : "OFF");
  res.json({ simulation: simulationMode });
});

// Get BTC price (either live or simulated)
app.get("/api/price", async (req, res) => {
  if (simulationMode) {
    const base = 58000 + Math.random() * 1000 - 500;
    return res.json({
      price: +base.toFixed(2),
      change24: (Math.random() - 0.5) * 4,
      mode: "simulation"
    });
  }

  try {
    const result = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
    );
    const data = await result.json();
    res.json({
      price: data.bitcoin.usd,
      change24: data.bitcoin.usd_24h_change,
      mode: "live"
    });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);