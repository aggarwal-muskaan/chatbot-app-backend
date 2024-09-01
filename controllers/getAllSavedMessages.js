const UserChat = require("../model/chat");
const UserData = require("../model/userInfo");

exports.getAllSavedMessages = async (request, response) => {
  try {
    const { email } = request.user;

    const user = await UserData.findOne({ email });

    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Unauthrized user",
      });
    }

    const allSavedChats = await UserChat.find({
      $and: [{ _id: { $in: user.chats } }, { isSaved: true }],
    });

    console.log("allSavedChats: ", allSavedChats);

    if (!allSavedChats) {
      return response.status(404).json({
        success: false,
        message: "There are no saved messages",
      });
    }

    return response.status(200).json({
      success: true,
      message: "All saved messages retrieved successfully!",
      data: allSavedChats,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: `There is some error: ${error}. \nPlease try again!`,
    });
  }
};
