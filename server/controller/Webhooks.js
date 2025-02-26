import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller function to manage clerk user with database

export const clerkWebhooks = async (req, res) => {
  try {
    // create s SVIX instance with clear webhook secret

    const whook = new Webhook(process.env.CLERWEB_HOOK_SECRET);

    //Verify headers
    await whook.verify(JSON.stringify(req, res), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    //Getting data fro req body

    const { data, type } = req.body;

    //Swich case for diffren events

    switch (type) {
      case "user.created": {
        const userData = { 
            _id: data.id,
            email:data.email_address[0].email_address,
            name: data.firstname + " " + data.last_name,
            image:data.image_url,
            resume:''
        };
        await User.create(userData);
        res.json({})
        break;
      }
      case "user.updated": {
        const userData = { 
        
            email:data.email_address[0].email_address,
            name: data.firstname + " " + data.last_name,
            image:data.image_url,
        
        };
        await user.findByIdAndUpdate(data.id,userData)
        res.json({});
        break

      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break
      }

      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:"Webhook errors"})
    
  }
};
