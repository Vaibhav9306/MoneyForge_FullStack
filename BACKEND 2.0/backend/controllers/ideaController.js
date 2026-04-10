import Idea from "../models/Idea.js";

// ================= SAVE IDEA =================
export const saveIdea = async (req, res) => {
  try {
    const { title, description, marketValidation, riskAnalysis, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description are required ❌" });
    }

    const idea = await Idea.create({
      userId: req.user.id,
      title,
      description,
      marketValidation: marketValidation || "",
      riskAnalysis: riskAnalysis || "",
      tags: tags || [],
    });

    res.status(201).json({ msg: "Idea saved ✅", idea });
  } catch (error) {
    console.error("Save Idea Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= GET ALL IDEAS =================
export const getIdeas = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const ideas = await Idea.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ ideas, count: ideas.length });
  } catch (error) {
    console.error("Get Ideas Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= GET SINGLE IDEA =================
export const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, userId: req.user.id });
    if (!idea) {
      return res.status(404).json({ msg: "Idea not found ❌" });
    }
    res.status(200).json({ idea });
  } catch (error) {
    console.error("Get Idea Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= UPDATE IDEA STATUS =================
export const updateIdeaStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["draft", "active", "archived"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status ❌" });
    }

    const idea = await Idea.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { status } },
      { new: true }
    );

    if (!idea) {
      return res.status(404).json({ msg: "Idea not found ❌" });
    }

    res.status(200).json({ msg: "Idea updated ✅", idea });
  } catch (error) {
    console.error("Update Idea Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= DELETE IDEA =================
export const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, userId: req.user.id });
    if (!idea) {
      return res.status(404).json({ msg: "Idea not found ❌" });
    }

    await idea.deleteOne();
    res.status(200).json({ msg: "Idea deleted ✅" });
  } catch (error) {
    console.error("Delete Idea Error:", error.message);
    res.status(500).json({ msg: "Server error ❌" });
  }
};
