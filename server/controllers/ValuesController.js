import express from "express";
import BaseController from "../utils/BaseController";
import { valuesService } from "../services/ValueService";
import auth0Provider from "@bcwdev/auth0Provider";

export class ValuesController extends BaseController {
  constructor() {
    super("api/values");
    this.router = express
      .Router()
      .use(auth0Provider.isAuthorized)
      .get("", this.getAll)
      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(auth0Provider.hasPermissions("create:blog"))
      .post("", this.create)
      .use(auth0Provider.hasPermissions("delete:blog"))
      .delete("/:id", this.deleteValue);
  }
  async getAll(_, res, next) {
    try {
      return res.send(["value1", "value2"]);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorId = req.user.sub;

      res.send({ user: req.user, userInfo: req.userInfo });
    } catch (error) {
      next(error);
    }
  }

  async deleteValue(req, res, next) {
    res.send(true);
  }
}
