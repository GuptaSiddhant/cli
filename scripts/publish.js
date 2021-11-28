const { npmPublish } = require("@jsdevtools/npm-publish");
const { readFileSync, writeFileSync } = require("fs");

const token = process.argv[2];
const manifestPath = "package.json";
const preId = "canary";

npmPublish({ token })
  .then((type) => {
    if (type === "none") {
      const manifestFile = readFileSync(manifestPath, "utf8");
      const manifest = JSON.parse(manifestFile);
      const canaryManifest = {
        ...manifest,
        version: `${manifest.version}-${preId}.${Date.now().valueOf()}`,
      };
      writeFileSync(manifestPath, JSON.stringify(canaryManifest, null, 2));

      return npmPublish({ token, tag: preId });
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
