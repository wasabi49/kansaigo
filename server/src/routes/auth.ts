import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();
const FRONT_URL = process.env.FRONT_URL || "http://localhost:3000";

// Googleログイン認証のエンドポイント
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Googleコールバックのエンドポイント
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONT_URL}/login`,
    successRedirect: `${FRONT_URL}/`,
  })
);

// ログアウト
router.get("/logout", (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect(`${FRONT_URL}/login`);
  });
});

// 認証状態の確認
router.get("/verify", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user,
    });
  } else {
    res.json({
      authenticated: false,
    });
  }
});

export default router;
