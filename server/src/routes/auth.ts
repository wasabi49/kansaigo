import express, { Request, Response } from "express";
import passport from "passport";
import { getDb } from "../db";
import { UserAuth } from "../types/User";
import bcrypt from "bcrypt";
import { loginRateLimiter, resetLoginAttempts } from '../middleware/rateLimiter';

const router = express.Router();
const FRONT_URL = process.env.FRONT_URL || "http://localhost:3000";

// Googleログイン認証のエンドポイント
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ローカルログイン認証のエンドポイント
router.post("/local/login", loginRateLimiter, (req: Request, res: Response) => {
  passport.authenticate("local", (err: Error, user: UserAuth, info: any) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err: Error) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      // IPアドレスを取得して試行回数をリセット
      const ip = req.headers['x-forwarded-for'] as string ||
                req.socket.remoteAddress ||
                'unknown';
      resetLoginAttempts(ip);
      return res.json({ message: "Login successful" });
    });
  })(req, res);
});

// ローカルユーザー登録のエンドポイント
router.post(
  "/local/register",
  async (req: Request, res: Response) => {
    try {
      const { mail_address, password } = req.body;
    const db = await getDb();
    const user = await db.get<UserAuth>(`SELECT * FROM credentials WHERE mail_address = ?`, [mail_address]);
    if (user) {
      res.status(400).json({ message: "User already exists" });
    }else{
      const result = await db.run(`INSERT INTO users (mail_address) VALUES (?)`, [mail_address]);
      const password_hash = await bcrypt.hash(password, 10);
      const newUser = await db.run(`INSERT INTO credentials (user_id, mail_address, password_hash) VALUES (?, ?, ?)`, [result.lastID, mail_address, password_hash]);
      console.log(newUser);
      res.status(201).json({ message: "User created successfully" });
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create user" });
    }
  }
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
    const sendUser = {
      id: req.user.id,
      name: req.user.name,
      current_streak: req.user.current_streak,
      current_break: req.user.current_break,
    }
    res.json({
      authenticated: true,
      user: sendUser,
    });
  } else {
    res.json({
      authenticated: false,
    });
  }
});

export default router;
