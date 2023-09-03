import { Router, Request, Response } from "express";

export const posts = Router();

posts.post("/", (req: Request, res: Response) => {
  res.send("Post successfully created!");
});

posts.get("/:id", (req: Request, res: Response) => {
  res.send("Post is here!");
});

posts.put("/:id", (req: Request, res: Response) => {
  res.send("Post successfully updated!");
});

posts.delete("/:id", (req: Request, res: Response) => {
  res.send("Post successfully deleted!");
});
