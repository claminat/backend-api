/**
 * SQLiteAdapter.js
 * Comprehensive adapter for interacting with SQLite databases
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class SQLiteAdapter {
  constructor(databasePath) {
    this.databasePath = databasePath;
    this.db = null;
  }

  // Database Management
  openDatabase() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.databasePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  closeDatabase() {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve();
      this.db.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  checkDatabaseExists() {
    return fs.existsSync(this.databasePath);
  }

  getDatabaseInfo() {
    return {
      path: this.databasePath,
      exists: this.checkDatabaseExists(),
    };
  }

  vacuumDatabase() {
    return this.executeRawQuery('VACUUM');
  }

  // Basic CRUD
  select(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  insert(sql, params = []) {
    return this.run(sql, params);
  }

  update(sql, params = []) {
    return this.run(sql, params);
  }

  delete(sql, params = []) {
    return this.run(sql, params);
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve(this);
      });
    });
  }

  executeRawQuery(sql) {
    return this.run(sql);
  }

  beginTransaction() {
    return this.run('BEGIN TRANSACTION');
  }

  commitTransaction() {
    return this.run('COMMIT');
  }

  rollbackTransaction() {
    return this.run('ROLLBACK');
  }

  // Table & Schema operations
  listTables() {
    const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`;
    return this.select(sql);
  }

  getTableInfo(table) {
    return this.select(`PRAGMA table_info(${table})`);
  }

  pragma(key) {
    return this.select(`PRAGMA ${key}`);
  }

  enableForeignKeys() {
    return this.run('PRAGMA foreign_keys = ON');
  }

  disableForeignKeys() {
    return this.run('PRAGMA foreign_keys = OFF');
  }
}

module.exports = SQLiteAdapter;
