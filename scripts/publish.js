const { npmPublish } = require("@jsdevtools/npm-publish");
const { readFileSync, writeFileSync } = require("fs");

const token = process.argv[2];
const manifestPath = "package.json";
const preId = "canary";

publishToNpm().then(console.log);

async function publishToNpm() {
  try {
    const result = await npmPublish({ token });

    // If did not publish -> publish canary
    if (result.type === "none") {
      const manifestFile = readFileSync(manifestPath, "utf8");
      const manifest = JSON.parse(manifestFile);
      const canaryManifest = {
        ...manifest,
        version: `${manifest.version}-${preId}.${Date.now().valueOf()}`,
      };
      writeFileSync(manifestPath, JSON.stringify(canaryManifest, null, 2));

      return await npmPublish({ token, tag: preId });
    }

    return result;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
