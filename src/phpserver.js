const PHPServer = require("php-server-manager");
const path = require("path");

const phpPath = path.resolve(__dirname, "..", "server", "php", "php.exe");
const publicPath = path.resolve(__dirname, "..", "server", "public");
function randPort(min = 3000, max = 9000) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const php = new PHPServer({
  php: phpPath,
  port: randPort(),
  directory: publicPath,
  stdio: "inherit",
  directives: {
    display_errors: 1,
    expose_php: 0,
  },
});
export {
    php, path
};