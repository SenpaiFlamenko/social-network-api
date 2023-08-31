import { Router, Request, Response } from "express";

export const users = Router();

users.get("/:id", (req: Request, res: Response) => {
  res.send("User data obtained!");
});

users.put("/:id", (req: Request, res: Response) => {
  res.send("User updated!");
});

users.delete("/:id", (req: Request, res: Response) => {
  res.send("User deleted!");
});
