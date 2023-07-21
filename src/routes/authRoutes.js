
// User Authentication Routes
// ==========================
// Create a new user account
router.post("/api/signup", controller.registerUser);
// Log in an existing user and obtain an authentication token (JWT)
router.post("/api/login", controller.loginUser);
// Log out the currently logged-in user
router.get("api/logout", controller.logoutUser);