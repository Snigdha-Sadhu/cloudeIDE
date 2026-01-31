/*export const buildFileTree = (files) => {
  const tree = {};

  files.forEach((file) => {
    const parts = file.path ? file.path.split("/") : [];

    // 🔑 If it's a file, remove last part (filename) from path
    const folderParts = file.isFolder ? parts : parts.slice(0, -1);

    let currentLevel = tree;

    // 1️⃣ Create folder structure
    folderParts.forEach((folder) => {
      if (!currentLevel[folder]) {
        currentLevel[folder] = {
          isFolder: true,
          children: {},
        };
      }
      currentLevel = currentLevel[folder].children;
    });

    // 2️⃣ Add leaf node
    currentLevel[file.fileName] = {
      ...file,
      children: file.isFolder ? {} : undefined,
    };
  });

  return tree;
};
*/
export const buildFileTree = (files) => {
  const tree = {};

  for (const file of files) {
    const parts = file.path.split("/"); // ["hello","compo"]
    let current = tree;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;

      // Create node if not exists
      if (!current[part]) {
        current[part] = {
          isFolder: isLast ? file.isFolder : true,
          children: {}
        };
      }

      // 🔥 Attach DB data ONLY at the LAST segment
      if (isLast) {
        Object.assign(current[part], {
          ...file,
          children: current[part].children || {}
        });
      }

      // Move down ONLY if folder
      if (current[part].isFolder) {
        current = current[part].children;
      }
    });
  }

  return tree;
};
