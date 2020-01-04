var Discord = require("discord.js");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var config = require("./config.json");
const sql = require("sqlite");

// Initialize Discord client
var client = new Discord.Client();

//Database stuff
sql.open("./alohaDB.sqlite", {Promise});

//Initialize locals
var today  = new Date();
//var dcDate = "March 16th, 2019";
var last = 0;

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 * https://stackoverflow.com/a/1214753/18511
 * 
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
function dateAdd(date, interval, units) {
	var ret = new Date(date); //don't change original date
	var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
	switch(interval.toLowerCase()) {
	  case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
	  case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
	  case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
	  case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
	  case 'day'    :  ret.setDate(ret.getDate() + units);  break;
	  case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
	  case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
	  case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
	  default       :  ret = undefined;  break;
	}
	return ret;
}

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateSubtract(new Date(), 'minute', 30)  //returns 30 minutes ago.
 * https://stackoverflow.com/a/1214753/18511
 * 
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to subtract.
 */
function dateSubtract(date, interval, units) {
	var ret = new Date(date); //don't change original date
	var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
	switch(interval.toLowerCase()) {
	  case 'year'   :  ret.setFullYear(ret.getFullYear() - units); checkRollover();  break;
	  case 'quarter':  ret.setMonth(ret.getMonth() - 3*units); checkRollover();  break;
	  case 'month'  :  ret.setMonth(ret.getMonth() - units); checkRollover();  break;
	  case 'week'   :  ret.setDate(ret.getDate() - 7*units);  break;
	  case 'day'    :  ret.setDate(ret.getDate() - units);  break;
	  case 'hour'   :  ret.setTime(ret.getTime() - units*3600000);  break;
	  case 'minute' :  ret.setTime(ret.getTime() - units*60000);  break;
	  case 'second' :  ret.setTime(ret.getTime() - units*1000);  break;
	  default       :  ret = undefined;  break;
	}
	return ret;
}

/**
 * Gets the spawn time of the boss based on the given boss name.
 * 
 * @param bossName The name of the boss
 */
function getSpawnTime(bossName)
{
	var spawnTime = 0;
	
	switch (bossName)
	{
		case "mano":
			spawnTime = 1;
			break;
		case "stumpy":
			spawnTime = 1;
			break;
		case "deo":
			spawnTime = 1;
			break;
		case "kingclang":
			spawnTime = 2;
			break;
		case "seruf":
			spawnTime = 1;
			break;
		case "faust":
			spawnTime = 2;
			break;
		//case "centipede":
			//spawnTime = 3;
			//break;
		case "timer":
			spawnTime = 2;
			break;
		case "mm":
			spawnTime = 2;
			break;
		case "dyle":
			spawnTime = 2;
			break;
		case "zmm":
			spawnTime = 2;
			break;
		case "zeno":
			spawnTime = 2;
			break;
		case "gumiho":
			spawnTime = 3;
			break;
		case "taeroon":
			spawnTime = 3;
			break;
		case "kingsagecat":
			spawnTime = 3;
			break;
		case "rog":
			spawnTime = 3;
			break;
		case "eliza":
			spawnTime = 3;
			break;
		case "snackbar":
			spawnTime = 2;
			break;
		case "chimera":
			spawnTime = 3;
			break;
		case "bmm":
			spawnTime = 23;
			break;
		case "snowman":
			spawnTime = 3;
			break;
		case "hh":
			spawnTime = 6;
			break;
		case "manon":
			spawnTime = 4;
			break;
		case "griffey":
			spawnTime = 4;
			break;
		case "pianusL":
			spawnTime = 36;
			break;
		case "pianusR":
			spawnTime = 24;
			break;
		case "bf":
			spawnTime = 12;
			break;
		case "crow":
			spawnTime = 23;
			break;
		case "levi":
			spawnTime = 4;
			break;
		case "musha":
			spawnTime = 11;
			break;
		case "dodo":
			spawnTime = 4;
			break;
		case "anego":
			spawnTime = 5;
			break;
		case "lilynouch":
			spawnTime = 4;
			break;
		case "lyka":
			spawnTime = 4;
			break;
		default:
			spawnTime = "Please input a valid boss. Use !bosses to get a list.";
	}
	return spawnTime;
}

/**
 * Gets the full boss name based on the given abbreviated boss name.
 * 
 * @param bossName The abbreviated name of the boss
 */
function getFullBossName(bossName)
{
	var fullBossName = "";
	
	switch (bossName)
	{
		case "mano":
			fullBossName = "Mano";
			break;
		case "stumpy":
			fullBossName = "Stumpy";
			break;
		case "deo":
			fullBossName = "Deo";
			break;
		case "kingclang":
			fullBossName = "King Clang";
			break;
		case "seruf":
			fullBossName = "Seruf";
			break;
		case "faust":
			fullBossName = "Faust";
			break;
		//case "centipede":
			//fullBossName = 3;
			//break;
		case "timer":
			fullBossName = "Timer";
			break;
		case "mm":
			fullBossName = "Mushmom";
			break;
		case "dyle":
			fullBossName = "Dyle";
			break;
		case "zmm":
			fullBossName = "Zombie Mushmom";
			break;
		case "zeno":
			fullBossName = "Zeno";
			break;
		case "gumiho":
			fullBossName = "Nine-Tailed Fox";
			break;
		case "taeroon":
			fullBossName = "Tae Roon";
			break;
		case "kingsagecat":
			fullBossName = "King Sage Cat";
			break;
		case "rog":
			fullBossName = "Jr. Balrog";
			break;
		case "eliza":
			fullBossName = "Eliza";
			break;
		case "snackbar":
			fullBossName = "Snack Bar";
			break;
		case "chimera":
			fullBossName = "Chimera";
			break;
		case "bmm":
			fullBossName = "Blue Mushmom";
			break;
		case "snowman":
			fullBossName = "Snowman";
			break;
		case "hh":
			fullBossName = "Headless Horseman";
			break;
		case "manon":
			fullBossName = "Manon";
			break;
		case "griffey":
			fullBossName = "Griffey";
			break;
		case "pianusL":
			fullBossName = "Left Pianus";
			break;
		case "pianusR":
			fullBossName = "Right Pianus";
			break;
		case "bf":
			fullBossName = "Bigfoot";
			break;
		case "crow":
			fullBossName = "Crow";
			break;
		case "levi":
			fullBossName = "Leviathan";
			break;
		case "musha":
			fullBossName = "Kacchuu Musha";
			break;
		case "dodo":
			fullBossName = "Dodo";
			break;
		case "anego":
			fullBossName = "Female Boss";
			break;
		case "lilynouch":
			fullBossName = "Lilynouch";
			break;
		case "lyka":
			fullBossName = "Lyka";
			break;
		default:
			fullBossName = "Please input a valid boss. Use !bosses to get a list.";
	}
	return fullBossName;
}

/**
 * Gets the full map name based on the given abberviated map name.
 * 
 * @param mapName The abbreviated name of the map
 */
function getFullMapName(mapName)
{
	var fullMapName = "";
	
	switch (mapName)
	{
		case "tp1":
			fullMapName = "Twisted Paths 1";
			break;
		case "tp2":
			fullMapName = "Twisted Paths 2";
			break;
		case "tp3":
			fullMapName = "Twisted Paths 3";
			break;
		case "tp4":
			fullMapName = "Twisted Paths 4";
			break;
		case "tp5":
			fullMapName = "Twisted Paths 5";
			break;
		case "cr1":
			fullMapName = "Crossroads 1";
			break;
		case "cr2":
			fullMapName = "Crossroads 2";
			break;
		case "cr3":
			fullMapName = "Crossroads 3";
			break;
		case "fp":
			fullMapName = "Forgotten Path";
			break;
		case "er":
			fullMapName = "Evil Rising";
			break;
		case "ed":
			fullMapName = "The Evil Dead";
			break;
		case "he":
			fullMapName = "Hidden Evil";
			break;
		case "ce":
			fullMapName = "Creeping Evil";
			break;
		case "hg":
			fullMapName = "Hollowed Ground";
			break;
		default:
			fullMapName = "Please input a valid map. Use !maps to get a list.";
	}
	return fullMapName;
}

/**
 * Returns true if BF spawns in the map, otherwise false
 * 
 * @param mapName The abbreviated name of the map
 */
function getValidBFMaps(mapName)
{
	switch (mapName)
	{
		case "tp1":
			return true;
		case "tp2":
			return true;
		case "tp3":
			return true;
		case "tp4":
			return true;
		case "tp5":
			return true;
		case "fp":
			return true;
		case "er":
			return true;
		case "ed":
			return true;
		default:
			return false;
	}
}

/**
 * Returns true if HH spawns in the map, otherwise false
 * 
 * @param mapName The abbreviated name of the map
 */
function getValidHHMaps(mapName)
{
	switch (mapName)
	{
		case "cr1":
			return true;
		case "cr2":
			return true;
		case "cr3":
			return true;
		case "fp":
			return true;
		case "he":
			return true;
		case "ce":
			return true;
		case "ed":
			return true;
		case "hg":
			return true;
		default:
			return false;
	}
}

client.on("ready", () => 
{
	console.log("Starting Shootz bot...");
	console.log("Creating tables if needed...");

	sql.run('CREATE TABLE IF NOT EXISTS shop (userID VARCHAR(30) PRIMARY KEY, expireTime VARCHAR(30), notified BIT)');
	sql.run('CREATE TABLE IF NOT EXISTS roll (lastID VARCHAR (30))');
	sql.run('CREATE TABLE IF NOT EXISTS timers (timerID INTEGER PRIMARY KEY, channel INTEGER, boss VARCHAR(20), time VARCHAR(40), map VARCHAR(20))');
	sql.run('CREATE TABLE IF NOT EXISTS curry (ch INTEGER)');
	sql.run('CREATE TABLE IF NOT EXISTS prefix (guildID VARCHAR(25) PRIMARY KEY, pref VARCHAR(10))');

	setInterval(() => {
		today = new Date();

		//loop through all discords the bot is in
		client.guilds.forEach(guild => 
		{
			let voters = guild.roles.find(r => r.name.includes("Voter"));
			let voteCH = guild.channels.find(c => c.name.includes("reminders"));
			if (voters != null && voteCH != null)
			{
				if (today.toLocaleString("en-US", {timeZone: "Pacific/Honolulu", hour: '2-digit', minute: '2-digit'}) == "2:00 PM")
				{
					voteCH.send("<@&" + voters.id + "> voting has reset! https://padoru.net/vote");
				}
			}

			let shopCH = guild.channels.find(c => c.name.includes("reminders"));
			if (shopCH != null)
			{
				sql.all('SELECT * FROM shop').then(rows =>
				{
					rows.forEach((row) =>
					{
						let diffMs = new Date(row.expireTime) - today;
						let diffHrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
	
						if (diffHrs == "0" && row.notified != 1)
						{
							shopCH.send("<@" + row.userID + ">'s shop will expire in 1 hour!");
							sql.run('UPDATE shop SET notified = 1');
						}
	
						if (diffMs <= 0)
						{
							shopCH.send("<@" + row.userID + ">'s shop has expired!");
							sql.run('DELETE FROM shop WHERE userID = \"' + row.userID + '\"');
						}
					});
				});
			}
		});
	}, 60000);
});

client.on("message", (message) => 
{
	var guildID = "0";
	if (message.guild != null)
	{
		guildID = message.guild.id;
	}
	sql.get('SELECT * FROM prefix WHERE guildID = \"' + guildID + '\"').then(prefRow =>
	{
		var prefix = "!";
		if (prefRow == null)
		{
			sql.run("INSERT INTO prefix(guildID, pref) VALUES (\"" + message.guild.id + "\", \"!\")");
		}
		else 
		{
			prefix = prefRow.pref;
		}

		if (!message.content.startsWith(prefix))
		{
			return;
		}

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		let voteRole = null;

		if (message.guild != null)
		{
			voteRole = message.guild.roles.find(r => r.name.includes("Voter"));
		}

		switch (command)
		{
			case "help":
				message.channel.send("**How to use: Type a command with \"" + prefix + "\" before it. You can change the prefix using the prefix command.**\n\n" +

				"**__Commands__**\n\n" + 

				"**prefix _<prefix>_:** Sets the new prefix for commands.\n" +
				"**roll _<max>_ :** Rolls a number from 1 to _<max>_.\n" + 
				"**bosses _<bossName>_ :** Displays the boss codename for _<bossName>_.\n" +
				"**maps _<mapName>_ :** Displays the map codename for _<mapName>_.\n" +
				"**timer _<bossName>_ :** Displays the timers for all spawns of _<bossName>_.\n" +
				"**timer _<bossName>_ _<channel>_ :** Sets the timer for _<bossName>_ in _<channel>_.\n" + 
				"**timer _<bossName>_ _<channel>_ _<mapName>_ :** Sets the timer for _<bossName>_ in _<channel>_ in _<mapName>_ (For HH and BF ONLY).\n" + 
				"**time:** Displays the current time in major/relevant timezones.\n" + 
				"**vote+:** Opt-in to vote reminders (assigns Voter role).\n" +
				"**vote-:** Opt-out of vote reminders (removes Voter role).\n" +
				"**shop+:** Sets a 1 hour reminder for your shop.\n" +
				"**shop:** Checks when your shop will expire.\n" +
				"**splits _<total>_ _<people>_:** Splits the total among people, includes optimal store tax evasion etc. outputs.\n" +
				"**aussie:** Says a random aussie phrase.\n\n" +

				"*Note: You will need a text channel with the word \"reminder\" in it, and a role with the word \"Voter\" to use vote/shop commands.*");
				break;

			case "prefix":
				let pref = args[0];
				var select = 'SELECT * FROM prefix WHERE guildID = \"' + message.guild.id + "\"";
				console.log(select);

				sql.get(select).then(row =>
				{
					if (row != null)
					{
						var update = "UPDATE prefix SET pref = \"" + pref + "\" WHERE guildID = \"" + message.guild.id + "\"";
						sql.run(update);
						console.log(update);
					}
					else {
						var insert = "INSERT INTO prefix(guildID, pref) VALUES (\"" + message.guild.id + "\", \"" + pref + "\")";
						sql.run(insert);
						console.log(insert);
					}
				});
				message.channel.send("Shootz's command prefix updated to \'" + pref + "\'");
				break;

			case "roll":
				sql.get('SELECT * FROM roll').then(row =>
				{
					//if last member to message is the same, don't roll
					if (row.lastID == message.member.id)
					{
						message.channel.send("No consecutive rolls " + message.author);
					}
					else
					{
						let max = args[0];
						if (max == "blunt")
						{
							message.channel.send("Rolling a blunt, " + message.author + " rolled a **420**!");
						}
						else if (max < 1 || isNaN(max))
						{
							message.channel.send("Please pick a number greater than 0.");
						}
						else
						{
							sql.run('UPDATE roll SET lastID = ' + message.member.id);

							var num = Math.floor(Math.random() * ((max - 1) + 1) + 1);
							if (num == 69)
							{
								message.channel.send("Rolling a " + max + "-sided dice, " + message.author + " rolled a **" + num + "**! nice");
							}
							else if (num == 100)
							{
								message.channel.send("Rolling a " + max + "-sided dice, " + message.author + " rolled a **" + num + "**!");
								
								var role100 = message.guild.roles.find(r => r.name === "💯");

								if (role100 != null)
								{
									role100.members.forEach(function (member)
									{
										member.removeRole(role100);
									});
									message.member.addRole(role100);
									message.channel.send(message.author + " is the new high roller!");
								}
							}
							else 
							{
								message.channel.send("Rolling a " + max + "-sided dice, " + message.author + " rolled a **" + num + "**!");
							}
						}
					}
				}).catch(e =>
				{
					console.log("Error: " + e.message);
				});
				break;
			case "randon":
				sql.get('SELECT * FROM roll').then(row =>
				{
					//if last member to message is the same, don't roll
					if (row.lastID == message.member.id)
					{
						message.channel.send("No consecutive rolls " + message.author);
					}
					else
					{
						sql.run('UPDATE roll SET lastID = ' + message.member.id);
						
						var num2 = Math.floor(Math.random() * ((100 - 1) + 1) + 1);
						if (num2 == 69)
						{
							message.channel.send("Rolling a " + 100 + "-sided dice, " + message.author + " rolled a **" + num2 + "**! nice");
						}
						else if (num2 == 100)
						{
							message.channel.send("Rolling a " + 100 + "-sided dice, " + message.author + " rolled a **" + num2 + "**!");
							
							var role100 = message.guild.roles.find(r => r.id === "💯");
							role100.members.forEach(function (member)
							{
								member.removeRole(role100);
							});
							message.member.addRole(role100);
							message.channel.send(message.author + " is the new high roller!");
						}
						else 
						{
							message.channel.send("Rolling a " + 100 + "-sided dice, " + message.author + " rolled a **" + num2 + "**!");
						}
					}
				}).catch(e =>
				{
					console.log("Error: " + e.message);
				});
				break;
			case "time":
				message.channel.send("Here is the current time in:" + 
									"\n**HST:** " + today.toLocaleString("en-US", {timeZone: "Pacific/Honolulu", weekday: 'short', hour: '2-digit', minute: '2-digit'}) + 
									"\n**PST/PDT:** " + today.toLocaleString("en-US", {timeZone: "America/Los_Angeles", weekday: 'short', hour: '2-digit', minute: '2-digit'}) + 
									"\n**MST:** " + today.toLocaleString("en-US", {timeZone: "America/Phoenix", weekday: 'short', hour: '2-digit', minute: '2-digit'}) + 
									"\n**MDT:** " + today.toLocaleString("en-US", {timeZone: "America/Denver", weekday: 'short', hour: '2-digit', minute: '2-digit'}) + 
									"\n**CDT:** " + today.toLocaleString("en-US", {timeZone: "America/Chicago", weekday: 'short', hour: '2-digit', minute: '2-digit'}) + 
									"\n**EDT:** " + today.toLocaleString("en-US", {timeZone: "America/New_York", weekday: 'short', hour: '2-digit', minute: '2-digit'}) +
									"\n**UTC (Server Time):** " + today.toLocaleString("en-US", {timeZone: "UTC", weekday: 'short', hour: '2-digit', minute: '2-digit'}) +
									"\n**GMT:** " + today.toLocaleString("en-US", {timeZone: "Europe/London", weekday: 'short', hour: '2-digit', minute: '2-digit'}) +
									"\n**AEST:** " + today.toLocaleString("en-US", {timeZone: "Australia/Queensland", weekday: 'short', hour: '2-digit', minute: '2-digit'})
									);
			break;

			case "bosses":
				message.channel.send("Here is a list of boss names to input into timer command:\n" + 
									"**Mano** - \"mano\"\n" +
									"**Stumpy** - \"stumpy\"\n" +
									"**Deo** - \"deo\"\n" +
									"**King Clang** - \"kingclang\"\n" +
									"**Seruf** - \"seruf\"\n" +
									"**Faust** - \"faust\"\n" +
									"**Timer** - \"timer\"\n" + 
									"**Mushmom** - \"mm\"\n" +
									"**Dyle** - \"dyle\"\n" + 
									"**Zombie Mushmom** - \"zmm\"\n" + 
									"**Zeno** - \"zeno\"\n" + 
									"**Nine-Tailed Fox** - \"gumiho\"\n" +
									"**Tae Roon** - \"taeroon\"\n" +
									"**King Sage Cat** - \"kingsagecat\"\n" + 
									"**Jr. Balrog** - \"rog\"\n" + 
									"**Eliza** - \"eliza\"\n" + 
									"**Snack Bar** - \"snackbar\"\n" + 
									"**Chimera** - \"chimera\"\n" + 
									"**Blue Mushmom** - \"bmm\"\n" +
									"**Snowman** - \"snowman\"\n" +
									"**Headless Horseman** - \"hh\"\n" + 
									"**Manon** - \"manon\"\n" + 
									"**Griffey** - \"griffey\"\n" + 
									"**Left Pianus** - \"pianusL\"\n" + 
									"**Right Pianus** - \"pianusR\"\n" + 
									"**Bigfoot** - \"bf\"\n" + 
									"**Black Crow** - \"crow\"\n" + 
									"**Leviathan** - \"levi\"\n" + 
									"**Kacchuu Musha** - \"musha\"\n" + 
									"**Dodo** - \"dodo\"\n" + 
									"**Female Boss** - \"anego\"\n" + 
									"**Lilynouch** - \"lilynouch\"\n" + 
									"**Lyka** - \"lyka\""
									);
				break;

				case "maps":
				message.channel.send("Here is a list of map names to input into timer command:\n" + 
									"**Twisted Paths 1** - \"tp1\"\n" +
									"**Twisted Paths 2** - \"tp2\"\n" +
									"**Twisted Paths 3** - \"tp3\"\n" +
									"**Twisted Paths 4** - \"tp4\"\n" +
									"**Twisted Paths 5** - \"tp5\"\n" +
									"**Crossroads 1** - \"cr1\"\n" +
									"**Crossroads 2** - \"cr2\"\n" + 
									"**Crossroads 3** - \"cr3\"\n" +
									"**Forgotten Path** - \"fp\"\n" + 
									"**Evil Rising** - \"er\"\n" + 
									"**The Evil Dead** - \"ed\"\n" + 
									"**Hidden Evil** - \"he\"\n" +
									"**Creeping Evil** - \"ce\"\n" +
									"**Hollowed Ground** - \"hg\""
									);
				break;

			case "timer":
				if (args.length == 3)
				{
					var boss = args[0];
					if (boss == "bf" || boss == "hh")
					{
						var channel = args[1];
						var map = args[2];
						
						if (boss == "bf" && !getValidBFMaps(map))
						{
							message.channel.send("Please enter a map that Bigfoot spawns at.");
							break;
						}
						else if (boss == "hh" && !getValidHHMaps(map))
						{
							message.channel.send("Please enter a map that Headless Horseman spawns at.");
							break;
						}

						var spawnTime = getSpawnTime(boss);
						var spawnsAt = dateAdd(today, 'hour', spawnTime);
						var spawnMin = dateSubtract(spawnsAt, 'hour', spawnTime*0.15).toLocaleString("en-US", {timeZone: "UTC", weekday: 'short', hour: '2-digit', minute: '2-digit'});
						var spawnMax = dateAdd(spawnsAt, 'hour', spawnTime*0.15).toLocaleString("en-US", {timeZone: "UTC", weekday: 'short', hour: '2-digit', minute: '2-digit'});
		
						var spawnRange = spawnMin + ' - ' + spawnMax;

						var select = 'SELECT * FROM timers WHERE channel = ' + channel + ' AND boss = \"' + boss + '\" AND map = \"' + map + '\"';
						console.log(select);

						sql.get(select).then(row =>
						{
							if (row != null)
							{
								var update = "UPDATE timers SET time = \"" + spawnsAt + "\" WHERE channel = " + channel + " AND boss = \"" + boss + "\" AND map = \"" + map + "\"";
								sql.run(update);
								console.log(update);
							}
							else {
								var insert = "INSERT INTO timers(channel, boss, time, map) VALUES (" + channel + ",\"" + boss + "\",\"" + spawnsAt + "\",\"" + map + "\")";
								sql.run(insert);
								console.log(insert);
							}
							
							boss = getFullBossName(boss);
							map = getFullMapName(map);

							if (boss.startsWith("Please"))
							{
								message.channel.send(boss);
							}
							else if (map.startsWith("Please"))
							{
								message.channel.send(map);
							}
							else
							{
								message.channel.send(boss + " will spawn in CH" + channel + " " + map + " within **" + spawnRange + "** UTC (server time).");
							}

						}).catch((e) =>
						{
							console.log("Error: " + e.message);
						});
					}
					else
					{
						message.channel.send("Only Bigfoot and Headless Horseman spawn in multiple maps, so map is not needed.")
						break;
					}
				}
				else if (args.length == 2)
				{
					var boss = args[0];

					if (boss == "bf" || boss == "hh")
					{
						message.channel.send("Bigfoot and Headless Horseman spawn in multiple maps, please specify map.");
						break;
					}

					var channel = args[1];
					var spawnTime = getSpawnTime(boss);
					var spawnsAt = dateAdd(today, 'hour', spawnTime);
					var spawnMin = dateSubtract(spawnsAt, 'hour', spawnTime*0.15).toLocaleString("en-US", {timeZone: "UTC", weekday: 'short', hour: '2-digit', minute: '2-digit'});
					var spawnMax = dateAdd(spawnsAt, 'hour', spawnTime*0.15).toLocaleString("en-US", {timeZone: "UTC", weekday: 'short', hour: '2-digit', minute: '2-digit'});

					var spawnRange = spawnMin + ' - ' + spawnMax;

					var select = 'SELECT * FROM timers WHERE channel = ' + channel + ' AND boss = \"' + boss + '\"';
					console.log(select);

					sql.get(select).then(row =>
					{
						if (row != null)
						{
							var update = "UPDATE timers SET time = \"" + spawnsAt + "\" WHERE channel = " + channel + " AND boss = \"" + boss + "\"";
							sql.run(update);
							console.log(update);
						}
						else {
							var insert = "INSERT INTO timers(channel, boss, time) VALUES (" + channel + ", " + "\"" + boss + "\"" + ", " + "\"" + spawnsAt + "\")";
							sql.run(insert);
							console.log(insert);
						}
						boss = getFullBossName(boss);
						if (boss.startsWith("Please"))
						{
							message.channel.send(boss);
						}
						else 
						{
							message.channel.send(boss + " will spawn in CH" + channel + " within **" + spawnRange + "** UTC (server time).");
						}
					}).catch((e) =>
					{
						console.log("Error: " + e.message);
					});
				}
				else if (args.length == 1)
				{
					var boss = args[0];
					var msg = "";

					var bossTemp = getFullBossName(boss);
					if (bossTemp.startsWith("Please"))
					{
						message.channel.send(bossTemp);
					}
					else
					{
						var select = 'SELECT * FROM timers WHERE boss = \"' + boss + '\" ORDER BY map, channel ASC';
						console.log(select);
		
						sql.all(select).then(rows =>
						{
							console.log(rows);
							if (rows.length == 0)
							{
								message.channel.send("This boss is uninitialized. Go kill pls ty");
								return;
							}
							msg += "**__" + getFullBossName(boss) + " (" + getSpawnTime(boss) + "h)__**\n";
							rows.forEach((row) =>
							{
								if (row != null)
								{
									var spawnTime = getSpawnTime(row.boss);
									var spawnMin = dateSubtract(row.time, 'hour', spawnTime*0.15);
									var spawnMax = dateAdd(row.time, 'hour', spawnTime*0.15);
									var spawnRange = spawnMin.toLocaleString("en-US", {timeZone: "UTC", weekday: 'short', hour: '2-digit', minute: '2-digit'}) + ' - ' + spawnMax.toLocaleString("en-US", {timeZone: "UTC", weekday: 'short', hour: '2-digit', minute: '2-digit'});;
									
									if (spawnMax < today || row.time == 0 || row.time == null)
									{
										sql.run('UPDATE timers set time = 0 WHERE timerID = ' + row.timerID);
										console.log(row.timerId + " updated.");
										if (row.map != null)
										{
											map = getFullMapName(row.map);
											msg += "**CH" + row.channel + " " + map + ":** up (maybe)\n";
										}
										else
										{
											msg += "**CH" + row.channel + ":** up (maybe)\n";
										}
									}
									else if (row.map != null)
									{
										map = getFullMapName(row.map);
										msg += "**CH" + row.channel + " " + map + ":** " + spawnRange + " UTC (server time).\n";
									}
									else
									{
										msg += "**CH" + row.channel + ":** " + spawnRange + " UTC (server time).\n";
									}
								}
							});
							message.channel.send(msg);
						}).catch((e) =>
						{
							console.log("Error: " + e.message);
						});
					}
				}
				else 
				{
					message.channel.send("Incorrect number of arguments. See !help for usage.");
				}
				break;
			
			// case "serge":
			// 	message.channel.send("<@149343308655755264> has been banned **three** times as of _" + today.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric' }) + "_.");
			// 	message.channel.send("1)", {files: ["https://i.imgur.com/sGUB1WN.png"]}).then(function(result1)
			// 	{
			// 		return message.channel.send("2)", {files: ["https://i.imgur.com/9E3llGo.png"]});
			// 	})
			// 	.then(function(result2)
			// 	{
			// 		return message.channel.send("3)", {files: ["https://i.imgur.com/aOkwkum.png"]});
			// 	})
			// 	.catch(error => console.log("Error: " + error.message));
			// 	break;

			case "splits":
				let total = args[0];
				let people = args[1];

				if (isNaN(total) || isNaN(people))
				{
					message.channel.send("Arguments must be two numbers.");
					return;
				}

				var splits = Math.round(total / people);
				var items = Math.floor(splits / 49999);
				var remain = (splits % 49999);

				message.channel.send("*Splitting " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " among " + people + " people..." + "*\n\n" + 
				"Even splits of **" + splits.toLocaleString() + "**\n" + 
				"**Put** " + items + " items in store for **49,999** and 1 item for **" + remain.toLocaleString() + "**.");
				break;

			// case "dchii":
			// 	sql.get('SELECT * FROM dchii').then(row =>
			// 	{
			// 		message.channel.send("Since " + dcDate + ", <@176499886001356802> has disconnected **" + row.dc + "** times.");
			// 	}).catch(() =>
			// 	{
			// 		sql.run('CREATE TABLE IF NOT EXISTS dchii (dc INTEGER)').then(() => 
			// 		{
			// 			sql.run('INSERT INTO dchii (dc) VALUES (0)');
			// 		}).catch(error =>
			// 		{
			// 			console.log("Error: " + error.message);
			// 		});
			// 	});
			// 	break;

			// case "dc+":
			// 	sql.get('SELECT * FROM dchii').then(row =>
			// 	{
			// 		sql.run('UPDATE dchii SET dc = dc + 1');
			// 		message.channel.send("<@176499886001356802> dced!");
			// 	}).catch(() =>
			// 	{
			// 		sql.run('CREATE TABLE IF NOT EXISTS dchii (dc INTEGER)').then(() => 
			// 		{
			// 			sql.run('INSERT INTO dchii (dc) VALUES (1)');
			// 		}).catch(error =>
			// 		{
			// 			console.log("Error: " + error.message);
			// 		});
			// 	});
			// 	break;

			case "curry":
				sql.get('SELECT * FROM curry').then(row =>
				{
					var curries = row.ch;
					if (curries == 0)
					{
						message.channel.send("The curry debt is clear.");
					}
					else if (curries > 0 && curries < 2)
					{
						message.channel.send("<@151267237418893312> owes <@174933036196954122> " + curries + " curry.");
					}
					else if (curries > 1)
					{
						message.channel.send("<@151267237418893312> owes <@174933036196954122> " + curries + " curries.");
					}
					else if (curries < 0 && curries > -2)
					{
						curries = -curries;
						message.channel.send("<@174933036196954122> owes <@151267237418893312> " + curries + " curry.");
					}
					else if (curries < 1)
					{
						curries = -curries;
						message.channel.send("<@174933036196954122> owes <@151267237418893312> " + curries + " curries.");
					}
				}).catch(() =>
				{
					console.log("Error: " + error.message);
				});
				break;

			case "curry+":
				sql.get('SELECT * FROM curry').then(row =>
				{
					sql.run('UPDATE curry SET ch = ch + 1');
					message.channel.send("<@151267237418893312> owes <@174933036196954122> a curry.");
				}).catch(() =>
				{
					console.log("Error: " + error.message);
				});
				break;

			case "curry-":
				sql.get('SELECT * FROM curry').then(row =>
				{
					sql.run('UPDATE curry SET ch = ch - 1');
					message.channel.send("<@174933036196954122> owes <@151267237418893312> a curry.");
				}).catch(() =>
				{
					console.log("Error: " + error.message);
				});
				break;

			case "vote+":
				if (voteRole != null)
				{
					message.member.addRole(voteRole);
					message.channel.send(message.author + " has been added to the list of voters.");
				}
				else 
				{
					message.channel.send("Vote reminders are not set up on this server.");
				}
				break;

			case "vote-":
				if (voteRole != null)
				{
					message.member.removeRole(voteRole);
					message.channel.send(message.author + " has been removed from the list of voters.");
				}
				else 
				{
					message.channel.send("Vote reminders are not set up on this server.");
				}
				break;

			case "aussie":
				var rng = Math.floor(Math.random() * (16 - 1) + 1) + 1;
				// if its the same as last time, reroll it
				if (rng == last)
				{
					rng = Math.floor(Math.random() * (16 - 1) + 1) + 1;
				}
				last = rng;
				switch (rng)
				{
					case 1:
						message.channel.send("G'day mate!");
						break;
					case 2:
						message.channel.send("Cheers top bloke");
						break;
					case 3:
						message.channel.send("Yeah nah");
						break;
					case 4:
						message.channel.send("She'll be right");
						break;
					case 5:
						message.channel.send("Ta");
						break;
					case 6:
						message.channel.send("Bloody ripper");
						break;
					case 7:
						message.channel.send("Carked it");
						break;
					case 8:
						message.channel.send("Oh, put a sock in it");
						break;
					case 9:
						message.channel.send("Crikey!!!");
						break;
					case 10:
						message.channel.send("Blimey!!!");
						break;
					case 11:
						message.channel.send("Good on ya, mate");
						break;
					case 12:
						message.channel.send("No drama, no worries");
						break;
					case 13:
						message.channel.send("Oi, who opened their lunch?");
						break;
					case 14:
						message.channel.send("Ya cunt");
						break;
					case 15:
						message.channel.send("Dogged it");
						break;
					case 16:
						message.channel.send("You mad cunt");
						break;
					default:
						break;
				}
				break;

			// case "rank":
			// 	let ign = args[0];
			// 	let avatar = new Discord.Attachment('https://lib.mapleunity.com/avatar/create.php?name=' + ign, 'avatar.png');
			// 	message.channel.send(avatar);
			// 	break;

			case "shop+":
				sql.get('SELECT * FROM shop').then(row =>
				{
					sql.run('REPLACE INTO shop (userID, expireTime, notified) VALUES (\"' + message.author.id + '\", \"' + dateAdd(today, 'hour', 24) + '\", 0)');
					message.channel.send(message.author + "'s shop will expire at **" + today.toLocaleString("en-US", {timeZone: "UTC", hour: '2-digit', minute: '2-digit'}) + "** UTC (server time).");
				});
				break;

			case "shop":
				sql.get('SELECT * FROM shop WHERE userID = \"' + message.author.id +'\"').then(row =>
				{
					let diffMs = new Date(row.expireTime) - today;
					let diffHrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
					let diffMins = Math.floor((diffMs / (1000 * 60)) % 60);
					
					let hourString = (diffHrs < 10) ? "hour" : "hours";
					let minString = (diffMins == 1) ? "minute" : "minutes";

					if (diffHrs != "0")
					{
						message.channel.send(message.author + "'s shop will expire in **" + diffHrs + " " + hourString + " and " + diffMins + " " + minString + "**");
					} 
					else
					{
						message.channel.send(message.author + "'s shop will expire in **" + diffMins + " " + minString + "**");
					}
				}).catch(() =>
				{
					message.channel.send("No store found.");
				});
				break;
			
			case "drop":
				sql.run('DROP TABLE ' + args[0]);
				console.log("Dropped table " + args[0]);
				break;
			// case "add":
			// 	sql.run("INSERT INTO prefix(guildID, pref) VALUES (\"0\", \"!\")");
			// case "remove":
			// 	sql.run('DELETE FROM shop WHERE userID = \"\"');
			// 	break;
			
		} //end switch
	//end prefix sql get
	}).catch(e =>
	{
		console.log("Error: " + e);
		sql.run('DROP TABLE prefix');
		console.log("Dropped prefix table");
		sql.run('CREATE TABLE IF NOT EXISTS prefix (guildID VARCHAR(25) PRIMARY KEY, pref VARCHAR(10))');
		sql.run("INSERT INTO prefix(guildID, pref) VALUES (\"0\", \"!\")");
		console.log("Created and initialized prefix table");
	});
}); //end clienton message

client.login(config.token);