import User from "../models/User.js";
import Notification from "../models/Notification.js";
import cloudinary from "../config/cloudinary.js";

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!req.user) return;

    let userQuery = User.findOne({ username })
      .select("-password")
      .populate({ path: "followings", select: "profileImage username _id" })
      .populate({ path: "followers", select: "profileImage username _id" })
      .populate({
        path: "posts",
        populate: [{ path: "photos", select: "url" }],
      });

    if (username === req.user.username) {
      userQuery = userQuery
        .populate({
          path: "notifications",
          options: { sort: { createdAt: -1 }, limit: 10 },
          populate: [
            {
              path: "post",
              populate: [{ path: "photos", select: "url" }],
            },
            {
              path: "comment",
              select: "author",
              populate: [
                {
                  path: "post",
                  populate: [{ path: "photos", select: "url" }],
                },
              ],
            },
            {
              path: "actionMaker",
              select: "username profileImage",
            },
          ],
        })
        .populate("searchResults", "username profileImage");
    }

    const user = await userQuery;

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching a user: ", error);
    res.status(500).send("Error fetching a user");
  }
};

export const searchUsers = async (_req, res) => {
  try {
    const users = await User.find({}, "username profileImage");
    res.status(200).send(users);
  } catch (error) {
    console.error("Error searching users: ", error);
    res.status(500).send("Error searching users");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).send("User not found");
    }

    const { bio, website, newUsername } = req.body;

    if (newUsername && newUsername !== username) {
      const newUsernameUser = await User.findOne({ username: newUsername });
      if (newUsernameUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      user.username = newUsername;
    }

    if (website && website.length <= 120) {
      user.website = website;
    }
    if (bio && bio.length <= 150) {
      user.bio = bio;
    }

    if (req.file) {
      const uploadedImage = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profiles",
              public_id: `${username}-profile`,
              overwrite: true,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          )
          .end(req.file.buffer);
      });

      if (user.profileImage !== uploadedImage) {
        user.profileImage = uploadedImage;
      }
    }

    const updatedUser = await user.save();
    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating a user profile: ", error);
    res.status(500).send("Error updating a user profile");
  }
};

export const followUser = async (req, res) => {
  try {
    const { profile, userProfile, followed } = req;

    if (followed) {
      return res.status(404).send("Already followed");
    }

    profile.followers.push(userProfile._id);
    userProfile.followings.push(profile._id);

    const newNotification = await Notification.create({
      user: profile._id,
      actionMaker: userProfile._id,
      type: "started following you",
    });

    profile.notifications.push(newNotification._id);
    await profile.save();
    await userProfile.save();

    res.status(201).send({
      _id: profile._id,
      profile_image: profile.profileImage,
      username: profile.username,
    });
  } catch (error) {
    console.error("Error following a user: ", error);
    res.status(500).send("Error following a user");
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { profile, userProfile, followed } = req;

    if (!followed) {
      return res.status(404).send("Following not found");
    }

    profile.followers = profile.followers.filter(
      (f) => !f.equals(userProfile._id)
    );
    userProfile.followings = userProfile.followings.filter(
      (f) => !f.equals(profile._id)
    );

    await profile.save();
    await userProfile.save();

    res.status(200).send({
      _id: profile._id,
      profile_image: profile.profileImage,
      username: profile.username,
    });
  } catch (error) {
    console.error("Error deleting a following: ", error);
    res.status(500).send("Error deleting a following");
  }
};

export const addUserToSearchResults = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !req.user) {
      return res.status(400).send("Users must be provided");
    }

    const user = await User.findById(req.user.id);
    const searchedUser = await User.findOne({ username });

    if (!user || !searchedUser) {
      return res.status(404).send("User not found");
    }

    user.searchResults.push(searchedUser._id);
    await user.save();

    res.status(200).send("User added to search results");
  } catch (error) {
    console.error("Error adding user to search results");
    res.status(500).send("Error adding user to search results");
  }
};
