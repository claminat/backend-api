// src/shared/adapters/storage/gdrive.adapter.js

const { google } = require('googleapis');
const fs = require('fs/promises');
const path = require('path');
const mime = require('mime-types');

class GoogleDriveAdapter {
  constructor(config) {
    this.folderIds = config?.folderIds || [];
    this.auth = new google.auth.GoogleAuth({
      keyFile: config?.serviceAccountKeyFile,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
  }

  async init() {
    this.client = await this.auth.getClient();
    this.drive = google.drive({ version: 'v3', auth: this.client });
  }

  /** --------------------------- File Operations --------------------------- **/
  async uploadFile(filePath, parentFolderId) {
    const fileName = path.basename(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    const media = { mimeType, body: await fs.readFile(filePath) };

    const res = await this.drive.files.create({
      requestBody: {
        name: fileName,
        parents: [parentFolderId],
      },
      media,
    });

    return res.data;
  }

  async downloadFile(fileId, destPath) {
    const res = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    const fileHandle = await fs.open(destPath, 'w');
    await new Promise((resolve, reject) => {
      res.data
        .on('end', resolve)
        .on('error', reject)
        .pipe(fileHandle.createWriteStream());
    });
  }

  async deleteFile(fileId) {
    await this.drive.files.delete({ fileId });
  }

  async copyFile(fileId, newName) {
    const res = await this.drive.files.copy({
      fileId,
      requestBody: { name: newName },
    });
    return res.data;
  }

  async moveFile(fileId, newParentId) {
    const file = await this.drive.files.get({ fileId, fields: 'parents' });
    const previousParents = file.data.parents.join(',');
    await this.drive.files.update({
      fileId,
      addParents: newParentId,
      removeParents: previousParents,
    });
  }

  async renameFile(fileId, newName) {
    await this.drive.files.update({
      fileId,
      requestBody: { name: newName },
    });
  }

  async getFileMetadata(fileId) {
    const res = await this.drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, modifiedTime',
    });
    return res.data;
  }

  async updateFileMetadata(fileId, metadata) {
    await this.drive.files.update({
      fileId,
      requestBody: metadata,
    });
  }

  async checkFileExists(fileId) {
    try {
      await this.getFileMetadata(fileId);
      return true;
    } catch {
      return false;
    }
  }

  /** --------------------------- Folder Operations --------------------------- **/
  async createFolder(name, parentId = null) {
    const res = await this.drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : [],
      },
    });
    return res.data;
  }

  async deleteFolder(folderId) {
    await this.deleteFile(folderId);
  }

  async listFolderContents(folderId) {
    const files = [];
    let pageToken = null;
    do {
      const res = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime)',
        pageToken,
      });
      files.push(...res.data.files);
      pageToken = res.data.nextPageToken;
    } while (pageToken);

    return files;
  }

  async getFolderMetadata(folderId) {
    return this.getFileMetadata(folderId);
  }

  async moveFolder(folderId, newParentId) {
    return this.moveFile(folderId, newParentId);
  }

  async copyFolder(folderId, newName) {
    return this.copyFile(folderId, newName);
  }

  /** --------------------------- Search & Query --------------------------- **/
  async searchByName(name) {
    const res = await this.drive.files.list({
      q: `name contains '${name}' and trashed = false`,
      fields: 'files(id, name, mimeType, size, modifiedTime)',
    });
    return res.data.files;
  }

  async advancedQuery(queryString) {
    const res = await this.drive.files.list({
      q: queryString,
      fields: 'files(id, name, mimeType, size, modifiedTime)',
    });
    return res.data.files;
  }

  /** --------------------------- Permissions & Sharing --------------------------- **/
  async addPermission(fileId, permission) {
    return this.drive.permissions.create({
      fileId,
      requestBody: permission,
    });
  }

  async listPermissions(fileId) {
    const res = await this.drive.permissions.list({ fileId });
    return res.data.permissions;
  }

  async createShareableLink(fileId) {
    await this.addPermission(fileId, {
      role: 'reader',
      type: 'anyone',
    });

    const file = await this.getFileMetadata(fileId);
    return `https://drive.google.com/file/d/${file.id}/view`;
  }

  /** --------------------------- Utility --------------------------- **/
  async getQuota() {
    const res = await this.drive.about.get({ fields: 'storageQuota' });
    return res.data.storageQuota;
  }

  /** --------------------------- Internal --------------------------- **/
  _buildFileInfo(file) {
    return {
      id: file.id,
      name: file.name,
      type: file.mimeType,
      size: Number(file.size || 0),
      modifiedTime: file.modifiedTime,
      path: file.id,
    };
  }
}

module.exports = GoogleDriveAdapter;
