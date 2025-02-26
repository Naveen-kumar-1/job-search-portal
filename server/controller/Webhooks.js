import { Webhook } from "svix";
import { buffer } from "micro";
import User from "../models/User.js";

// API Controller function to manage Clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    // Clerk webhook secret
    const WEBHOOK_SECRET = process.env.CLERWEB_HOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      return res.status(500).json({ error: "Webhook secret not set" });
    }

    const whook = new Webhook(WEBHOOK_SECRET);

    // Get raw payload
    const payload = (await buffer(req)).toString();

    // Verify webhook
    const evt = whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(payload);

    console.log("Webhook received:", type, data);

    // Handle different webhook events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url || "",
          resume: "",
        };
        await User.create(userData);
        res.status(201).json({ success: true });
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        res.status(200).json({ success: true });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.status(200).json({ success: true });
        break;
      }

      default:
        res.status(400).json({ success: false, message: "Unhandled event type" });
        break;
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ success: false, message: "Webhook error" });
  }
};
