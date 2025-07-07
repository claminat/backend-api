const MediaRepository = require('../repositories/media.repository');

exports.search = async (query = {}) => {
  const page = parseInt(query.page || 1);
  const limit = parseInt(query.limit || 10);
  const skip = (page - 1) * limit;

  const filters = {};
  if (query.search) {
    filters.filename = { $regex: query.search, $options: 'i' };
  }

  const [items, total] = await Promise.all([
    MediaRepository.findAll(filters, { page, limit, sort: { created_at: -1 } }),
    MediaRepository.count(filters)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};


exports.getAll = async () => {
  return MediaRepository.findAll();
};

exports.findDuplicates = async () => {
  return MediaRepository.findDuplicates();
};

exports.getById = async (id) => {
  return MediaRepository.findById(id);
};

exports.create = async (data) => {
  return MediaRepository.create(data);
};

exports.update = async (id, data) => {
  return MediaRepository.update(id, data);
};

exports.delete = async (id) => {
  return MediaRepository.delete(id);
};


