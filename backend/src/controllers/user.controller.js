import User from "../models/User.js";
import FriendRequest from "../models/FriendRequests.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;

    // Make sure to fetch full user with friends
    const currentUser = await User.findById(currentUserId).select("friends");

    const friendIds = currentUser?.friends || [];

    const recommendedUsers = await User.find({
      _id: { $ne: currentUserId, $nin: friendIds },
      isOnboarded: true, // ✅ match schema spelling exactly
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in recommend users", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

      res.status(200).json(user.friends)
  } catch (error) {
    console.log("Error in getmyFriends controller",error.message);
    res.status(500).json({message:"Internal server error"})
    
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId=req.user.id;
    const recipientId=req.params.id;

    if(myId===recipientId){
      res.status(400).json({message:"You cannot send request to yourself"})
    }

    const recipient=await User.findById(recipientId);
    if(!recipientId) {return res.status(404).json({message:"Recipient not found"})}

    if(recipient.friends.includes(myId)){ return res.status(400).json({message:"Yau are already friends with the user"})}

    const existingRequest=await FriendRequest.findOne({
      $or:[
        {sender:myId,recipient:recipientId},
        {sender:recipientId,recipient:myId}
      ],
    });

    if(existingRequest){
      res.status(400).json({message:"A friend request already exist between you and this user "})
    }

    const friendRequest=await FriendRequest.create({
      sender:myId,
      recipient:recipientId,
    })
    res.status(201).json(friendRequest)

  } catch (error) {
    console.error("Error in sendfriendrequest controller",error.message),
    res.status(500).json({message:"Internal server error"})
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const {id:requestId}=req.params;
    const friendRequest=await FriendRequest.findById(requestId)

    if(!friendRequest){
      return res.status(404).json({message:"Friend request not found"})
    }
        // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status="accepted";
    await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req,res) {
  try {
      const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
      }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

          const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });

  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
  
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}