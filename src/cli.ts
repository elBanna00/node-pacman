import yargs from "yargs";
import pm from ".";

yargs
  .usage("tiny-pacman <command> [args]")
  .version()
  .alias("v", "version")
  .help()
  .alias("h", "help")
  .command(
    "install",
    "Install dependancies",
    (argv) => {
      argv.option("production", {
        type: "boolean",
        description: "Install production dependancies only",
      });

      argv.boolean("save-dev");
      argv.boolean("dev");
      argv.alias("D", "dev");

      return argv;
    },
    pm,
  )
  .command(
    "*",
    "Install the dependencies.",
    (argv) =>
      argv.option("production", {
        type: "boolean",
        description: "Install production dependencies only.",
      }),
    pm,
  )
  .parse();
