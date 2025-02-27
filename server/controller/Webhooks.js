import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Entered into webhook try block");

    // Create an SVIX instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERWEB_HOOK_SECRET);

    // Verify headers
    const payload = JSON.stringify(req.body);
    await whook.verify(payload, { 
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting data from req body
    const { data, type } = req.body;
    console.log("Event Type:", type);

    // Switch case for different events
    switch (type) {
      case "user.created": {
        const userData = { 
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: ''
        };
        console.log("Creating User:", userData);
        await User.create(userData);
        return res.status(201).json({ success: true, message: "User Created" });
      }
      case "user.updated": {
        const userData = { 
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };
        console.log("Updating User:", userData);
        await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
        return res.status(200).json({ success: true, message: "User Updated" });
      }
      case "user.deleted": {
        console.log("Deleting User:", data.id);
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true, message: "User Deleted" });
      }
      default:
        console.log("Unhandled Event Type:", type);
        return res.status(400).json({ success: false, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ success: false, message: "Webhook error", error: error.message });
  }
};
