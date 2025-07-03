const z = require("zod");

const CreateUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string()
})

const SigninUserSchema = z.object({
    username: z.string(),
    password: z.string()
})

const CreateBlogSchema = z.object({
    title: z.string(),
    content: z.string()
})

module.exports = {
    CreateUserSchema,
    SigninUserSchema,
    CreateBlogSchema
}