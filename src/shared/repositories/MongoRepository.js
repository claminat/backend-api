class MongoRepository {
  constructor(connection, modelName, schema) {
    if (!connection || !modelName || !schema) {
      throw new Error('MongoRepository requires connection, modelName, and schema');
    }

    this.model = connection.model(modelName, schema);
  }

  async findById(id) {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      console.error('Error finding record by ID:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await this.model.deleteOne({ _id: id }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }

  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 }, select = null } = options;
    const skip = (page - 1) * limit;

    try {
      const q = this.model.find(query).skip(skip).limit(limit).sort(sort);
      if (select) q.select(select);
      return await q.exec();
    } catch (error) {
      console.error('Error finding records:', error);
      throw error;
    }
  }

  async findOneByFilter(filter) {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error) {
      console.error('Error finding one record by filter:', error);
      throw error;
    }
  }

  async count(query = {}) {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (error) {
      console.error('Error counting records:', error);
      throw error;
    }
  }

  async softDelete(id) {
    try {
      const updated = await this.model.findByIdAndUpdate(id, {
        $set: { status: 'inactive', deletedAt: new Date() }
      }).exec();
      return !!updated;
    } catch (error) {
      console.error('Error soft deleting:', error);
      return false;
    }
  }

  async hardDelete(id) {
    try {
      const deleted = await this.model.findByIdAndDelete(id).exec();
      return !!deleted;
    } catch (error) {
      console.error('Error hard deleting:', error);
      return false;
    }
  }
}

module.exports = MongoRepository;
