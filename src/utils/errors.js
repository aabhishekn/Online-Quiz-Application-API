function error(message, code, status = 400) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  return err;
}

exports.BAD_REQUEST = (msg) => error(msg, 'BAD_REQUEST', 400);
exports.NOT_FOUND = (msg) => error(msg, 'NOT_FOUND', 404);
