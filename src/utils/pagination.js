module.exports = (page = 1, limit = 10) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return {
    skip: (page - 1) * limit,
    limit,
  };
};
