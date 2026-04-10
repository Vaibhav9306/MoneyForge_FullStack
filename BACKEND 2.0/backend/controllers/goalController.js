import Goal from "../models/Goal.js";

// ================= CREATE GOAL =================
export const createGoal = async (req, res) => {
  try {
    const { title, description, targetAmount, deadline, category } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({ msg: "Title and target amount are required ❌" });
    }

    const goal = await Goal.create({
      userId: req.user.id,
      title,
      description: description || "",
      targetAmount: Number(targetAmount),
      deadline: deadline ? new Date(deadline) : undefined,
      category: category || "other",
    });

    res.status(201).json({ msg: "Goal created ✅", goal });
  } catch (error) {
    console.error("Create Goal Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= GET ALL GOALS =================
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ goals, count: goals.length });
  } catch (error) {
    console.error("Get Goals Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= UPDATE GOAL PROGRESS =================
export const updateGoal = async (req, res) => {
  try {
    const { currentAmount, title, description, status, deadline, category } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (currentAmount !== undefined) updates.currentAmount = Number(currentAmount);
    if (status !== undefined) updates.status = status;
    if (deadline !== undefined) updates.deadline = new Date(deadline);
    if (category !== undefined) updates.category = category;

    // Auto-complete if target reached
    if (updates.currentAmount !== undefined) {
      const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
      if (goal && updates.currentAmount >= goal.targetAmount) {
        updates.status = "completed";
      }
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ msg: "Goal not found ❌" });
    }

    res.status(200).json({ msg: "Goal updated ✅", goal });
  } catch (error) {
    console.error("Update Goal Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= DELETE GOAL =================
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ msg: "Goal not found ❌" });
    }

    await goal.deleteOne();
    res.status(200).json({ msg: "Goal deleted ✅" });
  } catch (error) {
    console.error("Delete Goal Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};
