import configs from "../configs";
import app from "../app";

const port = configs.app.port;

app.listen(port, () => {
  console.log("Server is running at port:", port);
});
