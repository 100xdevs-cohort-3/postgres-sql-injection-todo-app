const mongooose = require("mongoose");

const UserSchema = mongooose.Schema({
    username: String,
    password: String,
    name: String
})

const BlogSchema = mongooose.Schema({
    title: String,
    content: String,
    username: String,
})

const UserModel = mongooose.model("user", UserSchema);
const BlogModel = mongooose.model("blog", BlogSchema);

module.exports = {
    UserModel: UserModel,
    BlogModel: BlogModel
}
