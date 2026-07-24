import { search } from "../services/search/search.service.js";

export async function run(req, res, next) {
  try {
    res.json(await search(req.user.id, req.query.q || ""));
  } catch (error) {
    next(error);
  }
}
