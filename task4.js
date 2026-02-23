const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const requireLogin = (req, res, next) => {
	const role = req.cookies.role;
	if (!role) {
		return res.status(401).json({ message: "Please login first." });
	}
	req.userRole = role;
	return next();
};

app.get("/loginAdmin", (req, res) => {
	res.cookie("role", "admin", { httpOnly: true });
	res.send("Admin LoggedIn");
});

app.get("/loginClient", (req, res) => {
	res.cookie("role", "client", { httpOnly: true });
	res.send("Client LoggedIn");
});

app.get("/dashboard", requireLogin, (req, res) => {
	if (req.userRole === "admin") {
		return res.send("Welcome Admin");
	}
	if (req.userRole === "client") {
		return res.send("Welcome Client");
	}
	return res.status(403).json({ message: "Invalid role." });
});

app.get("/logout", (req, res) => {
	res.clearCookie("role");
	res.json({ message: "Logged out" });
});

const PORT = process.env.PORT || 3099;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
