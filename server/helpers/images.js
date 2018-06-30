const Multer = require("multer");
const Storage = require("@google-cloud/storage");

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

const storage = Storage({
  projectId: process.env.CLOUD_PROJECT,
  keyFilename: process.env.KEYFILE_PATH
});

const cloudBucket = process.env.CLOUD_BUCKET;
const bucket = storage.bucket(cloudBucket);

const uploadSingleFile = function(singleFile) {
  return new Promise((resolve, reject) => {
    const gcsname = Date.now() + "-" + singleFile.originalname;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: singleFile.mimetype
      }
    });

    stream.on("error", err => {
      singleFile.cloudStorageError = err;
      next(err);
    });

    stream.on("finish", () => {
      singleFile.cloudStorageObject = gcsname;
      file.makePublic().then(() => {
        singleFile.cloudStoragePublicUrl = getPublicUrl(gcsname);
        next();
      });
    });

    stream.end(singleFile.buffer);
  });
};

function sendUploadToGCS(req, res, next) {
  if (!req.file) {
    return next();
  }

  const gcsname = Date.now() + "-" + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on("error", err => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      next();
    });
  });

  stream.end(req.file.buffer);
}

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${cloudBucket}/${filename}`;
}

module.exports = {
  multer,
  sendUploadToGCS
};
