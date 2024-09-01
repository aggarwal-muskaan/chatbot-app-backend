const UserChat = require("../model/chat");
const UserData = require("../model/userInfo");

exports.saveChatMessage = async (request, response) => {
  try {
    // fetching the message ID and user email from request
    const { messageID, save } = request.body;
    const { email } = request.user;

    if (!messageID) {
      return response.status(404).json({
        success: false,
        message: "Message Id is missing",
      });
    }

    if (!save) {
      return response.status(404).json({
        success: false,
        message: "Save parameter is missing",
      });
    }

    const user = await UserData.findOne({ email });

    // validate if the user exists
    if (!user) {
      return response.status(403).json({
        success: false,
        message: "User does not exist",
      });
    }

    // update the chat with given message ID to mark its 'isSaved' to true
    const savedChatMessage = await UserChat.findByIdAndUpdate(
      { _id: messageID },
      {
        isSaved: save,
      },
      { new: true }
    );

    if (!savedChatMessage) {
      return response.status(500).json({
        success: false,
        message: "There is some error. Please try again!",
      });
    }

    return response.status(200).json({
      success: true,
      data: savedChatMessage,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "There was some error: " + error + "\n Please Try Again!",
    });
  }
};
