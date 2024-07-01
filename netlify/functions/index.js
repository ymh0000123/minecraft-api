const util = require('minecraft-server-util');

exports.handler = async (event, context) => {
    try {
        const server = {
            host: '2b2t.org', // Minecraft服务器的IP地址
            port: 25565 // Minecraft服务器的端口，默认为25565
        };

        const response = await util.status(server);
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch server status' })
        };
    }
};
