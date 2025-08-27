// const fs = require("fs");
// const path = require("path");

// const basePath = path.join(__dirname,  "../packages/shared/src");
// console.log('basePath: ', basePath);
// function traverseAndMove(dir) {
//   const entries = fs.readdirSync(dir, { withFileTypes: true });

//   for (const entry of entries) {
//     const fullPath = path.join(dir, entry.name);
//     if (entry.isDirectory()) {
//       traverseAndMove(fullPath); // keep going inside
//     } else if (entry.isFile() && entry.name.endsWith(".ts")) {
// console.log('fullPath: ', fullPath);
//       moveFile(fullPath);
//     }
//   }
// }

// function moveFile(filePath) {
//   const fileName = path.basename(filePath);

//   // decide whether it's DTO or Entity
//   let type = null;
//   if (fileName.endsWith(".dto.ts")) {
//     type = "dtos";
//   } else if (fileName.endsWith(".entity.ts")) {
//     type = "entities";
//   } else {
//     return; // ignore other TS files
//   }

//   const moduleName = path.basename(path.dirname(filePath));
//   const targetDir = path.join(basePath, type, moduleName);
//   console.log('moduleName: ', moduleName);
// console.log('targetDir: ', targetDir);
//   if (!fs.existsSync(targetDir)) {
//     fs.mkdirSync(targetDir, { recursive: true });
//   }

//   const targetPath = path.join(targetDir, fileName);

//   if (filePath === targetPath) {
//     console.log(`Skipped (already in place): ${fileName}`);
//     return;
//   }

//   fs.renameSync(filePath, targetPath);
//   console.log(`Moved: ${fileName} → ${type}/${moduleName}`);
// }

// // Start from src root
// traverseAndMove(basePath);
