import { app } from "./app";
import { conn } from "./db/config";

async function main() {
  await app();
  conn
    .sync()
    .then(() => console.log("DB conectada con exito"))
    .catch((error) => console.log(error));
}

main();
