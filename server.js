import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3000;

// Load credentials from .env
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.REDACTED_TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

app.post("/notify", async (req, res) => {
  const { name, phone, dept, department } = req.body;
  const patientDept = department || dept;
  if (!name || !phone || !patientDept)
    return res.status(400).json({ success: false, error: "Missing parameters" });

  try {
    const messageBody = `Hello ${name}, it's your turn now in ${patientDept} department. Please proceed to the counter.`;
    const message = await client.messages.create({
      body: messageBody,
      from: twilioNumber,
      to: phone,
    });
    console.log("✅ Message sent:", message.sid);
    res.json({ success: true, message: "SMS sent successfully!" });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.json({ success: false, error: err.message });
  }
});

app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}`)
);
