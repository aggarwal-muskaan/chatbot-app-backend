const Recipes = require("../model/recipe");
const UserData = require("../model/userInfo");

exports.getAllRecipes = async (request, response) => {
  try {
    const { email } = request.user;
    const user = await UserData.findOne({ email });

    if (!user)
      return response.status(401).json({
        success: false,
        message: "Unauthorised user",
      });

    const allUserRecipes = await Recipes.find({
      _id: { $in: user.recipes },
    }).populate();

    return response.status(200).json({
      success: true,
      data: {
        allUserRecipes,
      },
    });
  } catch (error) {
    console.log("Error while fetching the recipes: ", error);
    return response.send(500).json({
      success: false,
      message: `error in fethcing recipes: ${error}`,
    });
  }
};
