const { npmPublish } = require("@jsdevtools/npm-publish");
const { readFileSync, writeFileSync } = require("fs");

const token = process.argv[2];
const manifestPath = "package.json";

(async () => {
  // const result = await npmPublish({ token });
  const result = { type: "none" };

  // If did not publish -> publish canary
  if (result.type === "none") {
    const manifestFile = readFileSync(manifestPath, "utf8");
    const manifest = JSON.parse(manifestFile);
    const canaryManifest = {
      ...manifest,
      version: `${manifest.version}-canary.${Date.now().valueOf()}`,
    };
    writeFileSync(manifestPath, JSON.stringify(canaryManifest, null, 2));
    await npmPublish({ token, tag: "canary" });
  }
})();
