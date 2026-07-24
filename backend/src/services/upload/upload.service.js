import Busboy from "busboy";
import { PassThrough } from "stream";
import { prisma } from "../../config/prisma.js";
import { chooseDestinationAccount } from "../router/router.service.js";
import { authedDrive } from "../google/google.service.js";

export function handleStreamingUpload(req, res, next) {
  const busboy = Busboy({ headers: req.headers });
  let folderId = null;
  const uploads = [];
  let responded = false;

  function fail(error) {
    if (responded) return;
    responded = true;
    next(error);
  }

  busboy.on("field", (name, value) => {
    if (name === "folderId") folderId = value || null;
  });

  busboy.on("file", (_field, file, info) => {
    uploads.push(
      uploadOne(req.user.id, file, info, folderId).then(
        (uploadedFile) => ({ uploadedFile }),
        (error) => ({ error })
      )
    );
  });

  busboy.on("finish", async () => {
    try {
      const results = await Promise.all(uploads);
      const failed = results.find((result) => result.error);
      if (failed) return fail(failed.error);
      if (responded) return;
      responded = true;
      res.status(201).json({ files: results.map((result) => result.uploadedFile) });
    } catch (error) {
      fail(error);
    }
  });

  busboy.on("error", fail);
  req.on("error", fail);
  req.pipe(busboy);
}

async function uploadOne(userId, fileStream, info, folderId) {
  const account = await chooseDestinationAccount(userId);
  const { drive } = await authedDrive(account.id, userId);
  const body = new PassThrough();
  fileStream.pipe(body);

  const { data } = await drive.files.create({
    requestBody: { name: info.filename, mimeType: info.mimeType },
    media: { mimeType: info.mimeType, body },
    fields: "id,name,mimeType,size,md5Checksum"
  });

  const saved = await prisma.file.create({
    data: {
      folderId,
      ownerId: userId,
      googleAccountId: account.id,
      remoteFileId: data.id,
      name: data.name,
      mime: data.mimeType || info.mimeType,
      size: BigInt(data.size || 0),
      checksum: data.md5Checksum
    },
    include: { googleAccount: { select: { email: true } } }
  });
  await prisma.activityLog.create({ data: { userId, action: "UPLOAD", fileId: saved.id } });
  return saved;
}
