import User from "../models/User.js";

// ================= GET PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found ❌" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const { name, phase } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phase) updates.phase = phase;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found ❌" });
    }

    res.status(200).json({ msg: "Profile updated ✅", user });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= GET DASHBOARD STATS =================
export const getDashboardStats = async (req, res) => {
  try {
    const [ideasCount, Finance, Goal] = await Promise.all([
      (await import("../models/Idea.js")).default.countDocuments({ userId: req.user.id }),
      (await import("../models/Finance.js")).default,
      (await import("../models/Goal.js")).default,
    ]);

    const transactions = await Finance.find({ userId: req.user.id });
    const goals = await Goal.find({ userId: req.user.id });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      ideasCount,
      transactionsCount: transactions.length,
      goalsCount: goals.length,
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};
