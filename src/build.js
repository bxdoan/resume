const handlebars = require("handlebars");
const fs = require("fs-extra");
const markdownHelper = require("./utils/helpers/markdown");
const templateData = require("./metadata/metadata");
const Puppeteer = require("puppeteer");
const getSlug = require("speakingurl");
const dayjs = require("dayjs");

const srcDir = __dirname;
const outputDir = __dirname + "/../dist";

// Clear dist dir
fs.emptyDirSync(outputDir);

// Copy assets
fs.copySync(srcDir + "/assets", outputDir);
// Build HTML
handlebars.registerHelper("markdown", markdownHelper);
const source = fs.readFileSync(srcDir + "/templates/index.html", "utf-8");
const template = handlebars.compile(source);
const pdfFileName = `${getSlug(templateData.name)}.${getSlug(
  templateData.title
)}.pdf`;
const html = template({
  ...templateData,
  pdfFileName,
  updated: dayjs().format("MMMM D, YYYY"),
});
fs.writeFileSync(outputDir + "/index.html", html);

let sync = true;
buildPdf = async function (inputFile, outputFile) {
  const browser = await Puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(`file://${inputFile}`, {
    waitUntil: "networkidle0",
  });

  await page.pdf({
    path: outputFile,
    format: "A4",
    border: 0,
    margin: {
      top: "2cm",
      right: "2cm",
      bottom: "2cm",
      left: "2.54cm",
    },
  });
  await browser.close();
  sync = false;
};

// Build PDF
buildPdf(`${outputDir}/index.html`, `${outputDir}/${pdfFileName}`).catch(
  console.error
);
while (sync) {
  require("deasync").sleep(100);
}
