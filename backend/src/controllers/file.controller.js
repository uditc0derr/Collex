import * as files from "../services/file/file.service.js";

export async function list(req, res, next) {
  try {
    const favorite = req.query.favorite === undefined ? undefined : req.query.favorite === "true";
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const folderId = req.query.folderId === undefined ? undefined : req.query.folderId || null;
    res.json(
      await files.listFiles(req.user.id, {
        folderId,
        status: req.query.status || "ACTIVE",
        favorite,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        limit
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function get(req, res, next) {
  try {
    res.json(await files.getFile(req.user.id, req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    res.json(await files.updateFile(req.user.id, req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

export async function move(req, res, next) {
  try {
    res.json(await files.moveFile(req.user.id, req.body.fileId, req.body.folderId));
  } catch (error) {
    next(error);
  }
}

export async function trash(req, res, next) {
  try {
    res.json(await files.trashFile(req.user.id, req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    await files.permanentlyDeleteFile(req.user.id, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function download(req, res, next) {
  try {
    await files.downloadFile(req.user.id, req.params.id, res);
  } catch (error) {
    next(error);
  }
}
