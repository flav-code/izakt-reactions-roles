# izakt-reactions-roles


Tou will have to install the dependencies:
```
npm i
```


The config with details
```js
{
    "token": "", // Token of your bot
    "guilds": [
        {
            "id": "975666753214484490", // ID of your server
            "messages": [
                {
                    "name": "Test", // Unique name for your message (Must be unique)
                    "channel_id": "1057782285937676378", // The channel ID whe the message will be sended
                    "id": "", // The ID will be automaticaly added
                    "message": {
                        "content": null,
                        "embeds": [
                            {
                                "color": "0x947cea", // Color in hexa
                                "title": "Reaction role", // Title of the embed
                                "description": "Description of the message" // Description of the embed
                            }
                        ]
                    },
                    "reactions": [
                        {
                            "emoji": "flavibotnewmanager:1057784650170380378", // Emoji name+id
                            "role_id": "1057793610344575106" // Role to add/remove
                        }
                    ]
                }
            ]
        }
    ]
}
```

Developed by [flav#2200](https://github.com/flav28) with ❤️
