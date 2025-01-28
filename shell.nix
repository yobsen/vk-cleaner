with import <nixpkgs> {};
  stdenv.mkDerivation {
    name = "node-env";
    buildInputs = [
      nodejs_22
      chromium
    ];
    shellHook = ''
      export PUPPETEER_EXECUTABLE_PATH=$(which chromium)
    '';
  }
