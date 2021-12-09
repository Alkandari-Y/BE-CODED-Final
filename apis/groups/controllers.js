const Group = require("../../db/models/Group");
const User = require("../../db/models/User");
const Poll = require('../../db/models/Poll');
const Message = require("../../db/models/Message");

// Fetch one group
exports.fetchGroupById = async (groupId, next) => {
  try {
    const group = await Group.findById(groupId);
    return group;
  } catch (error) {
    next(error);
  }
};

// Fetch all groups the user(s) is in
exports.fetchUserGroups = async (req, res, next) => {
  try {
    const groups = await Group.find().populate('polls').populate('chat')
    //   .populate({
    //   path: 'polls',
    //   options: {
    //     // limit: 2,
    //     sort: { createdAt: -1 }
    //   }
    // })
    //   .populate({
    //     path: 'chat',
    //     options: {
    //       // limit: 2,
    //       sort: { createdAt: -1 }
    //     }
    // });
    //check for bug 
    // await groups
    return res.json(groups);
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

// Add users to group as members
exports.addMembersToGroup = async (req, res, next) => {
  try {
    if (!req.user._id.equals(req.group.owner._id)) {
      return next({
        status: 401,
      });
    }

    const newMember = await User.findOne({ phoneNumber: req.body.phoneNumber });

    if (req.group.members.includes(req.body.phoneNumber)) {
      const updatedGroup = await Group.findByIdAndUpdate(req.params.groupId, {
        $push: { members: newMember._id }}, { new: true, runValidators: true }
      );
      return res.json(updatedGroup);
    } else {
      next({status: 500, message: 'Member already exits in the group'})
    }

  } catch (error) {
    next(error);
  }
};

exports.addMoviePoll = async (req, res, next) => {
  try {
    req.body.owner = req.user._id;
    req.body.group = req.group._id
    const newPoll = await Poll.create(req.body)
    
    await Group.findByIdAndUpdate(req.group._id, {
      $push: { polls: newPoll._id }
    })

    res.status(201).json(newPoll);
  } catch (error) {
    next(error)
  }
};

exports.addChat = async (req, res, next) => {
  try {
    const newMessage = await Message.create(req.body)
    const updatedGroup = await Group.findByIdAndUpdate(
      req.group._id,
      { $push: { chat: newMessage._id } },
      { new: true, runValidators: true }
    ).populate('chat');
    res.status(201).json(newMessage)
  } catch (error) {
    next(error)
  }
};