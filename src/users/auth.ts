import { Router, Request, Response } from "express";

export const auth = Router();

auth.post("/register", (req: Request, res: Response) => {
  res.send("registration page");
});

auth.post("/login", (req: Request, res: Response) => {
  res.send("login page");
});
