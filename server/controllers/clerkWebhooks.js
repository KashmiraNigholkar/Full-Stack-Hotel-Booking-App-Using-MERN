const User = require("../models/User");
const { Webhook } = require("svix");

// Assuming your User schema has a 'clerkId' field to store Clerk user id
const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    
    // Svix requires raw body string to verify signature
    // So ensure you use raw body or use svix express middleware

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify the webhook signature using raw body string
    await whook.verify(req.rawBody, headers);

    const { data, type } = req.body;

    // Prepare user data to upsert
    const userData = {
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
    };

    switch (type) {
      case "user.created":
        // Create user only if not exists
        await User.findOneAndUpdate(
          { clerkId: data.id },
          userData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        break;

      case "user.updated":
        await User.findOneAndUpdate({ clerkId: data.id }, userData);
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        break;

      default:
        // Ignore other event types
        break;
    }

    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Clerk webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = clerkWebhooks;
