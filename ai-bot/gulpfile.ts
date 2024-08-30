//components
require("esbuild-register");
const gulp = require("gulp");
const replace = require("gulp-replace");
const prettier = require("gulp-prettier").default;
const insert = require("gulp-insert");
const gulpIf = require("gulp-if");
const { exec } = require("child_process");
const fs = require("fs");

//tsconfig
const tsConfigPath = "../../../tsconfig.json";
const tsConfig = require(tsConfigPath);

//tailwind config
const tailwindPath = "../../../tailwind.config.ts";
const tailwindConfig = require(tailwindPath);

//next ai bot config
const nextAiBotConfig = require("./config");

gulp.task("tailwind", async () => {
  return (
    gulp
      .src(tailwindPath)
      //remove ai config import
      .pipe(
        replace(
          'import { Config as ConfigAi } from "./src/app/ai-bot/config";\n',
          ""
        )
      )
      .pipe(
        replace(
          'import {Config as ConfigAi} from "./src/app/ai-bot/config";\n',
          ""
        )
      )
      //remove ai colors
      .pipe(replace("...ConfigAi.colors.dark,\n", ""))
      //remove ai width
      .pipe(replace("...ConfigAi.width,\n", ""))
      //remove ai height
      .pipe(replace("...ConfigAi.height,\n", ""))
      //remove ai bottom
      .pipe(replace("...(ConfigAi?.bottom || {}),\n", ""))
      //remove ai top
      .pipe(replace("...(ConfigAi?.top || {}),\n", ""))
      //remove ai left
      .pipe(replace("...(ConfigAi?.left || {}),\n", ""))
      //remove ai right
      .pipe(replace("...(ConfigAi?.right || {}),\n", ""))
      //add import
      .pipe(
        insert.prepend(
          'import { Config as ConfigAi } from "./src/app/ai-bot/config";\n'
        )
      )
      //add colors
      .pipe(
        gulpIf(
          //if existis the color object inside tailwind config file
          !!tailwindConfig?.default?.theme?.colors,
          //then add ai config colors
          replace("colors: {", "colors: { \n...ConfigAi.colors.dark,\n"),

          //else if there is no colors object, check if theme object exists
          gulpIf(
            !!tailwindConfig?.default?.theme,
            //if theme object exists, add colors inside it
            replace(
              "theme: {",
              "theme: {\ncolors: { ...ConfigAi.colors.dark, },"
            )
          )
        )
      )
      //verifies if exists the extend object on tailwind config
      .pipe(
        gulpIf(
          !tailwindConfig?.default?.theme?.extend,
          //if it donts exists, then create it
          replace("theme: {", "theme: {\nextend: { },")
        )
      )
      //verifies if exists the width object on tailwind config
      .pipe(
        gulpIf(
          !!tailwindConfig?.default?.theme?.extend?.width,
          //then add ai config witdh
          replace("width: {", "width: { ...ConfigAi.width,"),
          //else if don´t exists, then create it and add ai config width
          replace("extend: {", "extend: { \n width: { ...ConfigAi.width, },")
        )
      )
      //verifies if exists the height object on tailwind config
      .pipe(
        gulpIf(
          !!tailwindConfig?.default?.theme?.extend?.height,
          //then add ai config height
          replace("height: {", "height: { ...ConfigAi.height,"),
          //else if don´t exists, then create it and add ai config height
          replace("extend: {", "extend: { \n height: { ...ConfigAi.height, },")
        )
      )
      //verifies if exists the inset object on tailwind config
      .pipe(
        gulpIf(
          !!tailwindConfig?.default?.theme?.extend?.inset,
          //then add ai config inset
          replace(
            "inset: {",
            `inset: { 
              ...(ConfigAi?.bottom || {}), 
              ...(ConfigAi?.top || {}), 
              ...(ConfigAi?.left || {}), 
              ...(ConfigAi?.right || {}),`
          ),
          //else if don´t exists, then create it and add ai config inset
          replace(
            "extend: {",
            `extend: { \n inset: { 
              ...(ConfigAi?.bottom || {}), 
              ...(ConfigAi?.top || {}), 
              ...(ConfigAi?.left || {}), 
              ...(ConfigAi?.right || {}),},`
          )
        )
      )
      .pipe(gulp.dest((file: any) => file.base))
      //format file and save again
      .pipe(prettier({ singleQuote: true }))
      .pipe(gulp.dest((file: any) => file.base))
      .on("end", () => {
        console.log(
          "\x1b[32m%s\x1b[0m",
          `\n\n🎨 Tailwind config was updated on tailwind.config.ts\n\n`
        );
      })
  );
});

gulp.task("tsconfig", async () => {
  let config = tsConfig;
  const dir = __dirname.split("/");
  let baseUrl = tsConfig?.compilerOptions?.baseUrl?.split("/");
  let path: string | null = null;

  if (!tsConfig?.compilerOptions?.baseUrl) {
    config = {
      ...tsConfig,
      compilerOptions: {
        ...(tsConfig?.compilerOptions || {}),
        baseUrl: "./src",
      },
    };

    baseUrl = config?.compilerOptions?.baseUrl?.split("/");
  }

  dir.forEach((folder) => {
    if (folder === baseUrl[baseUrl?.length - 1]?.replace("/", "") && !path) {
      path = folder;
    } else if (path) {
      if (path === baseUrl[baseUrl?.length - 1]?.replace("/", "")) {
        path = folder;
      } else {
        path = `${path}/${folder}`;
      }
    }
  });

  config = {
    ...config,
    compilerOptions: {
      ...config.compilerOptions,
      paths: {
        ...(config?.compilerOptions?.paths || {}),
        "@next-ai-bot/*": [`${path}/*`],
        "@next-ai-bot": [`${path}/index`],
      },
    },
  };

  fs.writeFileSync(tsConfigPath, JSON.stringify(config));

  console.log(
    "\x1b[32m%s\x1b[0m",
    `\n\n🔧 Paths were updated on tsconfig.json\n\n`
  );
});

gulp.task("next-ai-bot-api", async () => {
  fs.access("../api/next-ai-bot", fs.constants.R_OK, (err: object) => {
    //if dont exists api/next-ai-bot folder
    if (err) {
      fs.access("../api", fs.constants.R_OK, (err: object) => {
        //if dont exists api folder, move it
        if (err) {
          exec("mv ./api ../api", (err: object) => {
            if (err) {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `\n\n❌ ERROR: ${JSON.stringify(err)}.\n\n`
              );
            }
            //exclude api folder inside ai-bot folder
            else {
              exec("rm -rf api", (err: object) => {
                if (err) {
                  console.log(
                    "\x1b[31m%s\x1b[0m",
                    `\n\n❌ ERROR: ${JSON.stringify(err)}.\n\n`
                  );
                }
              });
            }
          });
        }
        //if existis move only /next-ai-bot folder
        else {
          exec("mv ./api/next-ai-bot ../api", (err: object) => {
            if (err) {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `\n\n❌ ERROR: ${JSON.stringify(err)}.\n\n`
              );
            }
            //exclude api folder inside ai-bot folder
            else {
              exec("rm -rf api", (err: object) => {
                if (err) {
                  console.log(
                    "\x1b[31m%s\x1b[0m",
                    `\n\n❌ ERROR: ${JSON.stringify(err)}.\n\n`
                  );
                }
              });
            }
          });
        }
      });
    }
  });
});

gulp.task("insert-context", async () => {
  let layoutPath: string;

  //try to find application layout on parent folder
  fs.access("../layout.tsx", fs.constants.R_OK, (err: object) => {
    //if error, try to find layout on [locale] folder
    if (err) {
      fs.access("../[locale]/layout.tsx", fs.constants.R_OK, (err: object) => {
        if (err) {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `\n\n❌ ERROR: Can´t find your application main layout.`
          );
        } else {
          layoutPath = "../[locale]/layout.tsx";
          wrap();
        }
      });
    } else {
      layoutPath = "../layout.tsx";
      wrap();
    }
  });

  const wrap = () => {
    return gulp
      .src(layoutPath)
      .pipe(replace('import { AIBotProvider } from "@next-ai-bot";\n', ""))
      .pipe(replace("<AIBotProvider>{children}</AIBotProvider>", "{children}"))
      .pipe(replace("{children}", "<AIBotProvider>{children}</AIBotProvider>"))
      .pipe(gulp.dest(layoutPath.replace("layout.tsx", "")))
      .pipe(insert.prepend('import { AIBotProvider } from "@next-ai-bot";\n'))
      .pipe(gulp.dest(layoutPath.replace("layout.tsx", "")))
      .on("end", () => {
        console.log(
          "\x1b[32m%s\x1b[0m",
          `\n\n📄 Your main layout file was updated with Next AI Bot context provider\n\n`
        );
      });
  };
});

//default gulp task
gulp.task(
  "default",
  gulp.series("tailwind", "tsconfig", "next-ai-bot-api", "insert-context")
);
