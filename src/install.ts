import * as fs from "fs-extra";
import * as tar from "tar";
import axios from "axios";
import * as log from "./log";

export default async function (name: string, url: string, location = "") {
  // Prepare for the directory which is for installation
  const path = `${process.cwd()}${location}/node_modules/${name}`;

  // Create directories recursively.
  await fs.mkdirp(path);

  // Make the HTTP request using axios to fetch the tarball
  const response = await axios({
    method: "get",
    url,
    responseType: "stream", // Important: axios will return the response as a readable stream
  });

  /*
   * The response data is a readable stream
   * and `tar.extract` accepts a readable stream,
   * so we don't need to create a file to disk,
   * and just extract the stuff directly.
   */
  response.data
    .pipe(tar.extract({ cwd: path, strip: 1 }))
    .on("close", log.tickInstalling); // Update the progress bar
}
