import * as auth from "../services/auth/auth.service.js";

export async function register(req, res, next) {
  try {
    res.status(201).json(await auth.register(req.body));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    res.json(await auth.login(req.body));
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await auth.logout(req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
