import Finance from "../models/Finance.js";

// ================= ADD TRANSACTION =================
export const addTransaction = async (req, res) => {
  try {
    const { amount, category, type, note, date } = req.body;

    if (!amount || !category || !type) {
      return res.status(400).json({ msg: "Amount, category, and type are required ❌" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ msg: "Type must be 'income' or 'expense' ❌" });
    }

    const transaction = await Finance.create({
      userId: req.user.id,
      amount: Number(amount),
      category,
      type,
      note: note || "",
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({ msg: "Transaction added ✅", transaction });
  } catch (error) {
    console.error("Add Transaction Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= GET ALL TRANSACTIONS =================
export const getTransactions = async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;

    const filter = { userId: req.user.id };
    if (type && ["income", "expense"].includes(type)) {
      filter.type = type;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Finance.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Finance.countDocuments(filter),
    ]);

    // Summary calculations
    const allTransactions = await Finance.find({ userId: req.user.id });
    const totalIncome = allTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = allTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      transactions,
      total,
      page: Number(page),
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
    });
  } catch (error) {
    console.error("Get Transactions Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= DELETE TRANSACTION =================
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Finance.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found ❌" });
    }

    await transaction.deleteOne();
    res.status(200).json({ msg: "Transaction deleted ✅" });
  } catch (error) {
    console.error("Delete Transaction Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= GET CHART DATA (Monthly Cashflow) =================
export const getChartData = async (req, res) => {
  try {
    const transactions = await Finance.find({ userId: req.user.id });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();

    // Build last 7 months
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const year = d.getFullYear();
      const month = d.getMonth();

      const monthTx = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getFullYear() === year && td.getMonth() === month;
      });

      const income = monthTx
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expense = monthTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);

      chartData.push({ name: monthLabel, income, expense });
    }

    res.status(200).json({ chartData });
  } catch (error) {
    console.error("Chart Data Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};
