const { execFileSync } = require("node:child_process");

exports.default = async function signMacApp(options) {
  execFileSync(
    "codesign",
    [
      "--force",
      "--deep",
      "--sign",
      "-",
      "--timestamp=none",
      options.app,
    ],
    { stdio: "inherit" },
  );
};
