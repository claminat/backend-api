
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');
const util = require('util');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);

const FileHelper = {
  read: readFile,
  write: writeFile,
  append: appendFile,
  delete: unlink,
  copy: (src, dest) => fs.promises.copyFile(src, dest),
  move: rename,
  rename: rename,
  exists: (filePath) => fs.existsSync(filePath),
  stats: stat,
  touch: async (filePath) => writeFile(filePath, ''),

  createDir: mkdir,
  removeDir: rmdir,
  listDir: readdir,
  dirExists: (dirPath) => fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory(),
  dirStats: stat,
  emptyDir: async (dir) => {
    const files = await readdir(dir);
    await Promise.all(files.map(file => unlink(path.join(dir, file))));
  },
  copyDir: async (src, dest) => {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await FileHelper.copyDir(srcPath, destPath);
      } else {
        await FileHelper.copy(srcPath, destPath);
      }
    }
  },
  moveDir: rename,

  readStream: (filePath) => fs.createReadStream(filePath),
  writeStream: (filePath) => fs.createWriteStream(filePath),
  readLines: async (filePath) => (await readFile(filePath)).toString().split('\n'),
  readChunks: async (filePath, size) => {
    const buffer = Buffer.alloc(size);
    const fd = await fs.promises.open(filePath, 'r');
    await fd.read(buffer, 0, size, 0);
    await fd.close();
    return buffer;
  },
  insertContent: async (filePath, content, position = 0) => {
    const data = await readFile(filePath);
    const updated = Buffer.concat([Buffer.from(content), data]);
    await writeFile(filePath, updated);
  },
  replaceContent: async (filePath, search, replace) => {
    const content = (await readFile(filePath)).toString().replace(search, replace);
    await writeFile(filePath, content);
  },
  truncate: async (filePath) => fs.promises.truncate(filePath, 0),
  fileSize: async (filePath) => (await stat(filePath)).size,

  findByPattern: async (dir, pattern) => {
    const files = await readdir(dir);
    return files.filter(f => pattern.test(f));
  },
  findByExtension: async (dir, ext) => {
    const files = await readdir(dir);
    return files.filter(f => f.endsWith(ext));
  },
  findBySize: async (dir, size) => {
    const files = await readdir(dir);
    return (await Promise.all(files.map(async f => {
      const s = await stat(path.join(dir, f));
      return s.size === size ? f : null;
    }))).filter(Boolean);
  },
  findByDate: async (dir, date) => {
    const files = await readdir(dir);
    return (await Promise.all(files.map(async f => {
      const s = await stat(path.join(dir, f));
      return s.mtime.toDateString() === date.toDateString() ? f : null;
    }))).filter(Boolean);
  },
  searchContent: async (filePath, keyword) => {
    const content = (await readFile(filePath)).toString();
    return content.includes(keyword);
  },

  permissions: async (filePath) => (await stat(filePath)).mode,
  setPermissions: async (filePath, mode) => fs.promises.chmod(filePath, mode),
  timestamps: async (filePath) => {
    const stats = await stat(filePath);
    return { atime: stats.atime, mtime: stats.mtime };
  },
  setTimestamps: async (filePath, atime, mtime) => fs.promises.utimes(filePath, atime, mtime),
  encoding: async (filePath) => 'utf-8',
  mimeType: (filePath) => mime.lookup(filePath),
  checksum: async (filePath, algo = 'md5') => {
    const hash = crypto.createHash(algo);
    const data = fs.createReadStream(filePath);
    return new Promise((resolve, reject) => {
      data.on('data', chunk => hash.update(chunk));
      data.on('end', () => resolve(hash.digest('hex')));
      data.on('error', reject);
    });
  },

  listAllFilesRecursively: async function listAllFilesRecursively(dir, recursive = true, maxDepth = Infinity, currentDepth = 0) {
    let results = [];
    try {
      const exists = await fs.promises.stat(dir).then(stats => stats.isDirectory()).catch(() => false);
      if (!exists) {
        console.warn(`⚠️  Thư mục không tồn tại hoặc không phải thư mục: ${dir}`);
        return [];
      }


      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;

        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (recursive && currentDepth < maxDepth) {
            const subFiles = await listAllFilesRecursively(fullPath, recursive, maxDepth, currentDepth + 1);
            results.push(...subFiles);
          }
        } else {
          results.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`❌ Lỗi đọc thư mục: ${dir}`, error.message);
      throw error;
    }
    return results;
  },

  getFileStats: async (filePath) => {
    try {
      return await stat(filePath);
    } catch (error) {
      console.error(`❌ Không thể lấy stats của file: ${filePath}`, error);
      throw error;
    }
  }
};

module.exports = FileHelper;
