// src/shared/adapters/googleSheets.adapter.js

const { google } = require('googleapis');

class GoogleSheetsAdapter {
  constructor(authConfig) {
    this.auth = new google.auth.GoogleAuth({
      keyFile: authConfig?.serviceAccountKeyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  async init() {
    this.client = await this.auth.getClient();
    this.sheets = google.sheets({ version: 'v4', auth: this.client });
  }

  /** ---------------- Spreadsheet Operations ---------------- **/
  async createSpreadsheet(title) {
    const res = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: { title },
      },
    });
    return res.data;
  }

  async deleteSpreadsheet(spreadsheetId) {
    // Not directly supported by Sheets API
    throw new Error('Google Sheets API does not support deleting spreadsheets directly. Use Drive API instead.');
  }

  async copySpreadsheet(spreadsheetId, title) {
    const drive = google.drive({ version: 'v3', auth: this.client });
    const res = await drive.files.copy({
      fileId: spreadsheetId,
      requestBody: { name: title },
    });
    return res.data;
  }

  async getSpreadsheetMetadata(spreadsheetId) {
    const res = await this.sheets.spreadsheets.get({ spreadsheetId });
    return res.data;
  }

  async updateSpreadsheetProperties(spreadsheetId, properties) {
    return this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ updateSpreadsheetProperties: { properties, fields: '*' } }],
      },
    });
  }

  /** ---------------- Worksheet Operations ---------------- **/
  async addSheet(spreadsheetId, title) {
    return this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title } } }],
      },
    });
  }

  async deleteSheet(spreadsheetId, sheetId) {
    return this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ deleteSheet: { sheetId } }],
      },
    });
  }

  async renameSheet(spreadsheetId, sheetId, newTitle) {
    return this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ updateSheetProperties: { properties: { sheetId, title: newTitle }, fields: 'title' } }],
      },
    });
  }

  async clearSheet(spreadsheetId, sheetName) {
    return this.sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}`,
    });
  }

  /** ---------------- Data Operations ---------------- **/
  async getValues(spreadsheetId, range) {
    const res = await this.sheets.spreadsheets.values.get({ spreadsheetId, range });
    return res.data.values;
  }

  async setValues(spreadsheetId, range, values) {
    return this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  }

  async appendValues(spreadsheetId, range, values) {
    return this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });
  }

  async clearValues(spreadsheetId, range) {
    return this.sheets.spreadsheets.values.clear({ spreadsheetId, range });
  }

  async batchUpdate(spreadsheetId, requests) {
    return this.sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
  }

  /** ---------------- Cell Operations ---------------- **/
  async updateCell(spreadsheetId, range, value) {
    return this.setValues(spreadsheetId, range, [[value]]);
  }

  /** ---------------- Utility ---------------- **/
  parseA1Notation(row, col) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let colStr = '';
    while (col > 0) {
      col--;
      colStr = letters[col % 26] + colStr;
      col = Math.floor(col / 26);
    }
    return `${colStr}${row}`;
  }
}

module.exports = GoogleSheetsAdapter;
