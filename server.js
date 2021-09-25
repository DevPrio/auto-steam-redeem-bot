const express = require("express"), 
  app = express(),
  puppeteer = require("puppeteer"),
  failed_owned =
    "This Steam account already owns the product(s) contained in this offer. To access them, visit your library in the Steam client.",
  failed_used =
    "The product code you've entered has already been activated by a different Steam account. This code cannot be used again. Please contact the retailer or online seller where the code was purchased for assistance.",
  failed_invalid =
    "The product code you've entered is not valid. Please double check to see if you've mistyped your key. I, L, and 1 can look alike, as can V and Y, and 0 and O.",
  failed_spam =
    "There have been too many recent activation attempts from this account or Internet address. Please wait and try your product code again later.",
  failed_dlc =
    "The product code you've entered requires ownership of another product before activation.If you are trying to activate an expansion pack or downloadable content, please first activate the original game, then activate this additional content.";
const Discord = require("discord.js");
const http = require("http");

app.get("/", (request, response) => {
  // console.log(Date.now() + " Ping Received");
  response.sendStatus(200); /// example how to keep your bot 24/7
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 2800);
const bot = new Discord.Client({ disableEveryone: true });
let page;
let text;
let browser;
let ready;
let prioq;

const prefix = ">";
bot.on("ready", async () => {
  prioq = bot.users.get("my_id");
});

bot.on("message", async message => {
  let codes_channels = [
    "265502746776567809",
    "707702175828017234",
    "606136978307678225",
    "642348895610994689",
    "524299646072520735",
    "490430969820741633",
    "653216576606306314",
    "683995759116681222"
  ];
  if (message.author.id === bot.user.id) return;
  let msg = message.content;

  let filter = msg.match(
    /((?![^0-9]{12,}|[^A-z]{12,})([A-z0-9]{4,5}-?[A-z0-9]{4,5}-?[A-z0-9]{4,5}(-?[A-z0-9]{4,5}(-?[A-z0-9]{4,5})?)?))/g
  );
  if (filter && filter[0].split("-").length === 3) {
    console.log("test");

    let collected_codes = message.content.match(
      /((?![^0-9]{12,}|[^A-z]{12,})([A-z0-9]{4,5}-?[A-z0-9]{4,5}-?[A-z0-9]{4,5}(-?[A-z0-9]{4,5}(-?[A-z0-9]{4,5})?)?))/g
    );
    console.log(collected_codes);
    collected_codes.forEach(async code => {
      collected_codes = collected_codes.splice(
        collected_codes.indexOf(code),
        0 
      );

      var timer = setInterval(myFunction, 1000);

      async function myFunction() {
        if ((ready = true)) {
          ready = false;
          console.log("1 Setting Ready to: " + ready);
          clearInterval(timer);

          await redeemCode(code, message, page);
          return;
        }
      }
    });
  }

  else {
    if (
      message.content.startsWith(`${prefix}test`) &&
      message.author.id === prioq.id
    ) {
      message.channel.send("Working");
    }
  }
});


    await page.type("#input_username", "theprankielol")
    console.log("Logging in through steam....")
    await page.type("#input_password", "Medoaman1***")
    await page.evaluate(async () => {
        document.querySelector(".btnv6_blue_hoverfade.btn_medium").click()
    })
    await Promise.all([
        await page.waitForNavigation({ waitUntil: 'networkidle0' }),

        console.log("Opened the redeeming link...."),
    ]);
    if (page.url() === "https://store.steampowered.com/account/registerkey") {
        await page.type("#product_key", code)
        await page.click("#accept_ssa")
        await page.click("#register_btn")
        console.log("Inputting the code....")
        await page.waitFor(1000);

         text = await page.evaluate(() => document.querySelector('#error_display').textContent);
        if (text === failed_used) {
            console.log("The found code was already used.")

        } else if (text === failed_owned){
            console.log("Product already owned.")
        } else {
          console.log("No clue")
        }
        console.log(text)
        browser.close()


    }
  return 
  let logs = bot.channels.find(c=> c.id === "log_channel_id")
  let embed = new Discord.RichEmbed()
  .setAuthor(`${author.username} has sent a steam code in ${guild.name}`,author.URL)
  .setDescreption("**Code:**\n\n``"+code+"``"+
                 `**Output from steam:**\n\n${text}`+
                 `**Code Author:**\n\n${author}`)
  .setTimestamp()
  .setFooter("Prioq's steam codes observations",guild.iconURL)
  logs.send(embed)  

}*/


async function settleSteamPage() {
  ready = true;
  if (browser) {
    browser.close();
  }
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  }).catch(o_O=> console.error(o_O))
  page = await browser.newPage();


  await page.goto(
    "https://store.steampowered.com/login/?redir=account%2Fregisterkey&redir_ssl=1",
    { waitUntil: "networkidle0" }
  );
  await page.type("#input_username", "your_steam_username");
  console.log("Logging in through steam....");
  await page.type("#input_password", "your_steam_password");
  await page.evaluate(async () => {
    document.querySelector(".btnv6_blue_hoverfade.btn_medium").click();
  });
  await Promise.all([
    await page.waitForNavigation({ waitUntil: "networkidle0" }),
    console.log("Opened the redeeming link...."),
    await page.click("#accept_ssa")
  ]);
  console.log("Steam Redeeming page is ready.!");
  await page.click("#accept_ssa");
  let game = await getLatestGame();
  console.log(game);
}

async function redeemCode(code, message, page) {
  let author = message.author;
  let guild = message.guild;
  let channel = message.channel;
  let content = message.content;
  page = await browser.newPage();
  page
    .goto("https://store.steampowered.com/account/registerkey", {
      waitUntil: "networkidle0"
    })
    .then(async () => {
      if (page.url() === "https://store.steampowered.com/account/registerkey") {
        await page.click("#accept_ssa");
        await page.type("#product_key", code);

        console.log(code);
        await page.click("#register_btn");
        console.log("Inputting the code....");

        await page.waitFor(1000);
        text = await page.evaluate(
          () => document.querySelector("#error_display").textContent
        );
        await log(code, author, channel, guild, content, text);

        if (text === failed_used) {
          console.log("The found code was already used.");
        } else if (text === failed_owned) {
          console.log("Product already owned.");
        } else if (text === failed_invalid) {
          console.log("Invalid code.");
        } else {
          console.log("No clue");
        }
        console.log(text);
      } else {
        console.log("Resetting enviroment...");
        settleSteamPage().then(() => redeemCode(code));
      }
      //console.log(author.username)

      ready = true;

      console.log("2 Setting Ready to: " + ready);
      page.close();
    });
}

async function getLatestGame() {
  page = await browser.newPage();
  let game;

  await page.goto("https://store.steampowered.com/account/licenses/", {
    waitUntil: "networkidle2"
  });
  page.waitFor(1000);
  game = await page.evaluate(() =>
    document.querySelectorAll(".account_table td")[1].textContent.trim()
  );
  console.log(game);
  await page.close();
  return game;
}

async function log(code, author, channel, guild, content, text) {
  let logs = bot.channels.find(c => c.id === "606138272447463425");
  //prioq.send("test")
  let key = bot.emojis.find(emoji => emoji.name === "skey");
  let server = bot.emojis.find(emoji => emoji.name === "server");
  let eye = bot.emojis.find(emoji => emoji.name === "vision");
  let gameE = bot.emojis.find(emoji => emoji.name === "game");
  let arrow = bot.emojis.find(emoji => emoji.name === "__");
  let info = bot.emojis.find(emoji => emoji.name === "sinfo");
  let pic;

  let game = await getLatestGame();
  if (text === "") {
    pic =
      "https://cdn.glitch.com/4a62720a-efeb-4933-925f-449c694cd311%2Ficonfinder_ok_2639876.png?v=1589772536419";
  } else {
    pic =
      "https://cdn.glitch.com/4a62720a-efeb-4933-925f-449c694cd311%2Ficonfinder_cancel_2639904.png?v=1589772536653";
  }
  let embed = new Discord.RichEmbed();
  if (text === failed_owned || text === failed_dlc ){
    if (EyesDevice){
      let eyesembed = new Discord.RichEmbed()
      .setColor("000000")
      .addField(`Code:`, "``" + `${code}` + "``")
      .addField(`Author:`, author.tag)
      .addField(`Channel:`, channel)
      .addField(`Message Content:`, content)
      .setTimestamp()
      .setFooter(`Here you go boi`, guild.iconURL)
      EyesDevice.send(eyesembed)
      prioq.send("Sent a code to eyesdevice")
      console.log("Sent to EyesDevice")
    }
  }
  if (text === "") {
    text = "Product Approved and now in your steam library.";
    if (prioq) {
      prioq.send(`${game} added to your steam library.`);
    }
  }
  embed.setAuthor(
    `${author.username} has sent a steam code in ${guild.name}`,
    author.avatarURL
  );

  embed.setColor("#4169E1");
  embed.setThumbnail(pic);
  embed.addField(`${key} Code:`, "``" + `${code}` + "``");
  embed.addField(`${info} Output from steam:`, text);
  embed.addField(`${arrow} Author:`, author.tag);
  embed.addField(`${eye} Channel:`, channel);
    embed.addField(`${server} Message Content:`, content);
  embed.addField(`${gameE} Latest added game was:`, game);
  /*.setDescription(
      "**Code:**\n``" +
        code +
        "``\n" +
        `**Output from steam:**\n${text}` +
        `\n**Code Author:**\n${author}`
    )*/
  embed.setTimestamp();
  embed.setFooter(`Prioq's steam codes observations.`, guild.iconURL);

  logs.send(embed);
}

var listener = app.listen(process.env.PORT, function() {
  settleSteamPage();
  console.log("Launched");
});
bot.login("userbot-token");
