


const createUser = async (userBody) => {
    const user = await User.isEmailTaken(userBody.email)
    if (await User.isEmailTaken(userBody.email)) {
        const email = { email: userBody.email }
        const user = await User.findOne(email)
        if (user.status == 'Inactive') {
            Object.assign(user, { ...userBody, status: 'Active' });
            await user.save();
            return user
        } else {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `User already exists with this email: ${userBody.email}`
            )
        }
    }
    return User.create(userBody);
};
module.exports = {
    createUser
}