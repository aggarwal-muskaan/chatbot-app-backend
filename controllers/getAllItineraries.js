const Itineraries = require("../model//itinerary");
const UserData = require("../model/userInfo");

exports.getAllItineraries = async (request, response) => {
  try {
    const { email } = request.user;
    const user = await UserData.findOne({ email });

    if (!user)
      return response.status(401).json({
        success: false,
        message: "Unauthorised user",
      });

    const allUserItineraries = await Itineraries.find({
      _id: { $in: user.itineraries },
    }).populate();

    return response.status(200).json({
      success: true,
      data: {
        allUserItineraries,
      },
    });
  } catch (error) {
    console.log("Error while fetching the Itineraries: ", error);
    return response.send(500).json({
      success: false,
      message: `error in fethcing Itineraries: ${error}`,
    });
  }
};
