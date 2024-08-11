const UserData = require("../model/userInfo");
const UserChat = require("../model/chat");

exports.getAllMessages = async (request, response) => {
  // destructure user email
  try {
    const { email } = request.user;
    const user = await UserData.findOne({ email });

    if (!user)
      return response.status(401).json({
        success: false,
        message: "Unauthorised user",
      });

    const allUserMessages = await UserChat.find({
      _id: { $in: user.chats },
    }).populate();
    // .exec();

    return response.status(200).json({
      success: true,
      data: {
        allUserMessages,
      },
    });
  } catch (error) {
    console.log("Error in fetching chats", error);
    return response
      .status(500)
      .json({ success: false, message: "Error in fetching chats", error });
  }
};
