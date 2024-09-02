import configs from "./src/configs";
import app from "./src/app";

const port = configs.app.port;

app.listen(port, () => {
  console.log("Server is running at port:", port);
});
