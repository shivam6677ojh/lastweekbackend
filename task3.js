const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

app.get("/visit", (req, res) => {
	const currentCount = Number.parseInt(req.cookies.visitCount || "0", 10);
	const nextCount = Number.isNaN(currentCount) ? 1 : currentCount + 1;

	res.cookie("visitCount", String(nextCount), { httpOnly: true });
	res.json({ message: `You have visited this page ${nextCount} times` });
});

app.get("/reset", (req, res) => {
	res.clearCookie("visitCount");
	res.json({ message: "Visit count reset" });
});

const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
