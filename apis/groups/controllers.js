const Group = require("../../db/models/Groups");

// Fetch one group
exports.fetchGroupById = async (groupId, next) => {
  try {
    const group = await Group.findById(groupId);
    return group;
  } catch (error) {
    next(error);
  }
};

// YOUSEF: Fetch all groups the user(s) is in
exports.fetchUserGroups = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// Create group
exports.createGroup = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/${req.file.path}`;
      req.body.image = req.body.image.replace("\\", "/");
    }
    req.body.owner = req.user._id;
    req.body.members = [req.user._id];

    const newGroup = await Group.create(req.body);

    res.status(201).json(newGroup);
  } catch (error) {
    next(error);
  }
};

// Update Group
exports.updateGroup = async (req, res, next) => {
  try {
    if (req.group.owner.toString() === req.user._id.toString()) {
      if (req.file) {
        req.body.image = `/media/${req.file.filename}`;
        req.body.image = req.body.image.replace("\\", "/");
      }

      const foundGroup = await Group.findByIdAndUpdate(
        req.group._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(201).json(foundGroup);
    } else {
      next({ status: 401, message: "You are not the Owner" });
    }
  } catch (error) {
    next(error);
  }
};

// Delete Group
exports.deleteGroup = async (req, res, next) => {
  try {
    if (req.group.owner.toString() === req.user._id.toString()) {
      await req.group.remove();
      res.status(204).end();
    } else {
      next({ status: 401, message: "You are not the Owner" });
    }
  } catch (error) {
    next(error);
  }
};

// Add members to group
exports.addMembersToGroup = async (req, res, next) => {};
