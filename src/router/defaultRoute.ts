import { Router, Request, Response, NextFunction } from "express";

export const defaultRoute = Router();

defaultRoute.get("/", (req: Request, res: Response, next: NextFunction) => {
  // const err = new CustomError("Some error", 404);
  // next(err);
  res.send("welcome to this page");
});
