// Filename: mysql.adapter.js

const mysql = require('mysql2/promise');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class MySQLAdapter {
  constructor(config) {
    this.config = config;
    this.pool = null;
  }

  // Connection Management
  async createConnection() {
    return mysql.createConnection(this.config);
  }

  async createConnectionPool() {
    this.pool = mysql.createPool(this.config);
    return this.pool;
  }

  async closeConnection(connection) {
    return connection.end();
  }

  async closePool() {
    return this.pool.end();
  }

  async testConnection() {
    const connection = await this.createConnection();
    await connection.ping();
    await connection.end();
    return true;
  }

  async getConnectionStatus() {
    return this.pool ? 'Connected' : 'Not connected';
  }

  // Basic CRUD
  async select(query, params = []) {
    const [rows] = await this.pool.execute(query, params);
    return rows;
  }

  async insert(query, params = []) {
    const [result] = await this.pool.execute(query, params);
    return result.insertId;
  }

  async update(query, params = []) {
    const [result] = await this.pool.execute(query, params);
    return result.affectedRows;
  }

  async delete(query, params = []) {
    const [result] = await this.pool.execute(query, params);
    return result.affectedRows;
  }

  async bulkInsert(query, list) {
    const [result] = await this.pool.query(query, [list]);
    return result.affectedRows;
  }

  // Query Operations
  async executeQuery(query, params = []) {
    const [result] = await this.pool.query(query, params);
    return result;
  }

  async executeRawQuery(query) {
    return this.executeQuery(query);
  }

  async queryWithPagination(baseQuery, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const paginatedQuery = `${baseQuery} LIMIT ${limit} OFFSET ${offset}`;
    return this.executeQuery(paginatedQuery);
  }

  // Transaction Management
  async beginTransaction(connection) {
    return connection.beginTransaction();
  }

  async commitTransaction(connection) {
    return connection.commit();
  }

  async rollbackTransaction(connection) {
    return connection.rollback();
  }

  async autoCommit(connection, mode) {
    return connection.query(`SET autocommit = ${mode ? 1 : 0}`);
  }

  // Database Operations
  async createDatabase(name) {
    return this.executeRawQuery(`CREATE DATABASE \`${name}\``);
  }

  async dropDatabase(name) {
    return this.executeRawQuery(`DROP DATABASE \`${name}\``);
  }

  async listDatabases() {
    return this.executeRawQuery('SHOW DATABASES');
  }

  async useDatabase(name) {
    return this.executeRawQuery(`USE \`${name}\``);
  }

  // Table Operations
  async listTables() {
    return this.executeRawQuery('SHOW TABLES');
  }

  async getTableSchema(table) {
    return this.executeRawQuery(`DESCRIBE \`${table}\``);
  }

  async truncateTable(table) {
    return this.executeRawQuery(`TRUNCATE TABLE \`${table}\``);
  }

  // Data Import/Export
  async importFromCSV(table, filePath) {
    const query = `LOAD DATA LOCAL INFILE '${filePath}' INTO TABLE \`${table}\` FIELDS TERMINATED BY ',' LINES TERMINATED BY '\\n'`;
    return this.executeRawQuery(query);
  }

  async exportToCSV(query, filePath) {
    const rows = await this.executeQuery(query);
    const headers = Object.keys(rows[0] || {}).join(',');
    const lines = rows.map(row => Object.values(row).join(','));
    fs.writeFileSync(filePath, [headers, ...lines].join('\n'));
    return filePath;
  }

  // Utilities
  escapeString(str) {
    return mysql.escape(str);
  }

  generateUUID() {
    return uuidv4();
  }

  formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
}

module.exports = MySQLAdapter;
