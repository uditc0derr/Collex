import { dashboard } from "../services/storage/storage.service.js";

export async function getDashboard(req, res, next) {
  try {
    res.json(await dashboard(req.user.id));
  } catch (error) {
    next(error);
  }
}
