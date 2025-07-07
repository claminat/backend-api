const MediaService = require('../services/media.service');

exports.getAllMedia = async (req, res) => {
  const media = await MediaService.getAll();
  res.json(media);
};

exports.getDuplicates = async (req, res) => {
  const duplicates = await MediaService.findDuplicates();
  res.json(duplicates);
};

exports.getMediaById = async (req, res) => {
  const media = await MediaService.getById(req.params.id);
  res.json(media);
};

exports.createMedia = async (req, res) => {
  const result = await MediaService.create(req.body);
  res.status(201).json(result);
};

exports.updateMedia = async (req, res) => {
  const result = await MediaService.update(req.params.id, req.body);
  res.json(result);
};

exports.deleteMedia = async (req, res) => {
  await MediaService.delete(req.params.id);
  res.sendStatus(204);
};



