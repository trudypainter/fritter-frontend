import type { NextFunction, Request, Response } from "express";
import express from "express";
import FreetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as util from "./util";
import { Freet } from "../freet/model";
import ConnectionCollection from "../connection/collection";
import SubscribeCollection from "../subscribe/collection";

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetResponse[]} - An array of freets created by user with username
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId !== undefined) {
      const freet = await FreetCollection.findOne(req.query.freetId.toString());
      const response = util.constructFreetResponse(freet);
      res.status(200).json(response);
      return;
    }

    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [userValidator.isAuthorExists],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(
      req.query.author as string
    );
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Get freets from users that signed in user subscribes to
 *
 * @name GET /api/freets/subscribed
 *
 * @return {FreetResponse[]} - An array of freets created by user with username
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/subscribed",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const userSubscribes = await SubscribeCollection.findAllByAuthorId(
      req.session.userId as string
    );

    let freets = await Promise.all(
      userSubscribes.map((subscribe: any) =>
        FreetCollection.findAllByUsername(
          subscribe.subscribingToId.username.toString()
        )
      )
    );

    let freetsFlat = freets.flat();
    freetsFlat.sort((a: Freet, b: Freet) => {
      return a.dateModified.getTime() - b.dateModified.getTime();
    });

    const response = freetsFlat.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, freetValidator.isValidFreetContent],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);

    res.status(201).json({
      message: "Your freet was created successfully.",
      freet: util.constructFreetResponse(freet),
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
  ],
  async (req: Request, res: Response) => {
    await ConnectionCollection.deleteForFreet(req.params.freetId);
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: "Your freet was deleted successfully.",
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent,
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(
      req.params.freetId,
      req.body.content
    );
    res.status(200).json({
      message: "Your freet was updated successfully.",
      freet: util.constructFreetResponse(freet),
    });
  }
);

export { router as freetRouter };
