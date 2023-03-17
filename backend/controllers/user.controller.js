const {userService,} = require('../services');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser({
        _org: req.user._org,
        ...req.body
    });
    res.status(200).send(user);
});

module.exports = {
    createUser,
};