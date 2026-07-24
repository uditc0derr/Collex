import * as folders from "../services/folder/folder.service.js";

export async function list(req, res, next) {
  try {
    const flat = req.query.flat === "true" || req.query.flat === "1";
    const favorite = req.query.favorite === undefined ? undefined : req.query.favorite === "true";
    res.json(
      await folders.listFolders(req.user.id, {
        parentId: req.query.parentId || null,
        flat,
        favorite,
        status: req.query.status || "ACTIVE",
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    res.status(201).json(await folders.createFolder(req.user.id, req.body));
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    res.json(await folders.updateFolder(req.user.id, req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await folders.deleteFolder(req.user.id, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function removePermanent(req, res, next) {
  try {
    await folders.permanentlyDeleteFolder(req.user.id, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
