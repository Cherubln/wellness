import User from "../models/User";
import Group from "../models/Group";
import sendEmail from "../utils/sendEmail";
import { ObjectId } from "mongoose";
import { Request, Response } from "express";

// Create Group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { groupName, members, admin } = req.body;
    // const userId = req.user!._id;

    let group = await Group.create({
      groupName,
      admin,
      members: [admin, ...members],
    });

    // const user = await User.findById(admin);
    // user?.groups.push(group._id as ObjectId);
    // await user?.save();
    // Send email to invited members
    members.forEach(async (memberId: string) => {
      const member = await User.findById(memberId);
      if (member) {
        member.groups.push(group._id as ObjectId);
        await member.save();
        // sendEmail(
        //   member.email,
        //   `You've been invited to join the group ${groupName}`
        // );
      }
    });
    const groups = await Group.find({
      $or: [{ admin }, { members: admin }],
    })
      .populate("members", "-password")
      .populate("admin", "-password");

    res.status(201).json({ groups });
  } catch (error) {
    console.log({ error });

    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Groups
export const getAllGroups = async (req: Request, res: Response) => {
  try {
    let query = {};
    if (req.query.user) {
      query = {
        $or: [{ admin: req.query.user }, { members: req.query.user }],
      };
    }
    const groups = await Group.find(query)
      .populate("members", "-password")
      .populate("admin", "-password");
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Single Group
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Group
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Group
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add Member to Group
export const addMember = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const memberId = req.body.memberId;
    if (!group.members.includes(memberId)) {
      group.members.push(memberId);
      await group.save();
      res.status(200).json(group);
    } else {
      res.status(400).json({ message: "Member already in group" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove Member from Group
export const removeMember = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const memberId = req.body.memberId;
    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
