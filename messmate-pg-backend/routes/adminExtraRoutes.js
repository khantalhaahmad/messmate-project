import express from "express";
import Order from "../models/Order.js";
import Mess from "../models/Mess.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import MessRequest from "../models/MessRequest.js";
import { verifyToken } from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ============================================================
   🧾 0. MESS LIST (For Dropdown)
   ============================================================ */
router.get("/mess-list", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const messes = await Mess.find().select("name _id").sort({ name: 1 });
    res.json(messes);
  } catch (err) {
    console.error("💥 Mess List Error:", err);
    res.status(500).json({ message: "Failed to fetch mess list" });
  }
});

/* ============================================================
   🧮 1. ADMIN DAILY SUMMARY
   ============================================================ */
router.get("/daily-summary", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalOrders = await Order.countDocuments({
      status: "confirmed",
      createdAt: { $gte: startOfDay },
    });

    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: "confirmed", createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: "$total_price" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const totalOwners = await User.countDocuments({ role: "owner" });
    const totalStudents = await User.countDocuments({ role: "student" });

    res.json({ totalOrders, totalRevenue, totalOwners, totalStudents });
  } catch (err) {
    console.error("💥 Daily Summary Error:", err);
    res.status(500).json({ message: "Failed to fetch daily summary" });
  }
});

/* ============================================================
   📊 2. REVENUE TREND (Last 7 Days)
   ============================================================ */
router.get("/revenue-trends", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const result = await Order.aggregate([
      {
        $match: {
          status: "confirmed",
          createdAt: { $gte: sevenDaysAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$total_price" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(result);
  } catch (err) {
    console.error("💥 Revenue Trend Error:", err);
    res.status(500).json({ message: "Failed to fetch revenue trends" });
  }
});

/* ============================================================
   📅 3. REVENUE RANGE (From–To Dates, Optional Mess Filter)
   ============================================================ */
router.post("/revenue-range", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, messName } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const matchQuery = {
      status: "confirmed",
      createdAt: { $gte: start, $lte: end },
    };

    if (messName && messName !== "all") {
      matchQuery.mess_name = { $regex: new RegExp(`^${messName}$`, "i") };
    }

    const result = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id:
            messName && messName !== "all"
              ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
              : "$mess_name",
          totalOrders: { $sum: 1 },
          totalEarnings: { $sum: "$total_price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // For a specific mess — include ratings and reviews
    if (messName && messName !== "all") {
      const totalOrders = result.reduce((a, b) => a + b.totalOrders, 0);
      const totalRevenue = result.reduce((a, b) => a + b.totalEarnings, 0);

      const avgRatingAgg = await Review.aggregate([
        { $match: { mess_name: { $regex: new RegExp(`^${messName}$`, "i") } } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]);

      const avgRating = avgRatingAgg[0]?.avgRating?.toFixed(1) || "N/A";

      const reviews = await Review.find({
        mess_name: { $regex: new RegExp(`^${messName}$`, "i") },
      })
        .populate("user_id", "name email")
        .sort({ createdAt: -1 })
        .limit(10);

      return res.json({
        messName,
        trend: result,
        totalOrders,
        totalRevenue,
        avgRating,
        reviews,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("💥 Revenue Range Error:", err);
    res.status(500).json({ message: "Failed to fetch revenue range data" });
  }
});

/* ============================================================
   📨 4. PENDING MESS REQUESTS
   ============================================================ */
router.get("/mess-requests/pending", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const requests = await MessRequest.find({ status: "pending" })
      .populate("owner_id", "name email");
    res.json(requests);
  } catch (err) {
    console.error("💥 Pending Requests Error:", err);
    res.status(500).json({ message: "Failed to fetch pending requests" });
  }
});

/* ============================================================
   🥇 5. TOP PERFORMING MESSES (Today)
   ============================================================ */
router.get("/top-messes", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const top = await Order.aggregate([
      { $match: { status: "confirmed", createdAt: { $gte: start } } },
      {
        $group: {
          _id: "$mess_name",
          totalOrders: { $sum: 1 },
          totalEarnings: { $sum: "$total_price" },
        },
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 5 },
    ]);

    res.json(top);
  } catch (err) {
    console.error("💥 Top Messes Error:", err);
    res.status(500).json({ message: "Failed to fetch top messes" });
  }
});

/* ============================================================
   💸 6. OWNER PAYOUTS (This Month)
   ============================================================ */
router.get("/owner-payouts", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const payouts = await Order.aggregate([
      {
        $match: { status: "confirmed", createdAt: { $gte: start } },
      },
      {
        $group: {
          _id: "$mess_name",
          totalRevenue: { $sum: "$total_price" },
        },
      },
    ]);

    const payoutList = await Promise.all(
      payouts.map(async (p) => {
        const mess = await Mess.findOne({ name: p._id }).populate("owner_id", "name email");
        const commission = p.totalRevenue * 0.1;
        return {
          messName: p._id,
          ownerName: mess?.owner_id?.name || "Unknown",
          ownerEmail: mess?.owner_id?.email || "N/A",
          totalRevenue: p.totalRevenue,
          commission,
          payable: p.totalRevenue - commission,
          payoutStatus: mess?.payoutStatus || "Pending",
        };
      })
    );

    res.json(payoutList);
  } catch (err) {
    console.error("💥 Payout Error:", err);
    res.status(500).json({ message: "Failed to fetch payouts" });
  }
});

/* ============================================================
   ⭐ 7. RECENT REVIEWS
   ============================================================ */
router.get("/recent-reviews", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user_id", "name email")
      .populate("mess_id", "name")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(reviews);
  } catch (err) {
    console.error("💥 Fetch Reviews Error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

/* ============================================================
   👨‍🎓 8. FETCH ALL STUDENTS
   ============================================================ */
router.get("/students", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email createdAt")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("💥 Fetch Students Error:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

/* ============================================================
   🧑‍🍳 9. FETCH ALL MESS OWNERS
   ============================================================ */
router.get("/owners", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const owners = await User.find({ role: "owner" }).select("name email createdAt");
    const messes = await Mess.find().select("name owner_id");

    const ownerData = owners.map((o) => ({
      ownerName: o.name,
      email: o.email,
      messes: messes
        .filter((m) => m.owner_id?.toString() === o._id.toString())
        .map((m) => m.name),
    }));

    res.json(ownerData);
  } catch (err) {
    console.error("💥 Fetch Owners Error:", err);
    res.status(500).json({ message: "Failed to fetch owners" });
  }
});

export default router;
