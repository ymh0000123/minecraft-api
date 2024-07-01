const net = require("net");
const url = require("url");

function getData(address, port, callback) {
    const start_time = new Date();
    let latency;
    const client = net.connect(port, address, () => {
        latency = Math.round(new Date() - start_time);
        client.write(Buffer.from([0xfe, 0x01]));
    });

    client.setTimeout(5000);

    client.on("data", (data) => {
        if (data != null && data != "") {
            const server_info = data.toString().split("\x00\x00\x00");
            if (server_info != null && server_info.length >= 6) {
                const version = server_info[2].replace(/\u0000/g, "");
                const motd = server_info[3].replace(/\u0000/g, "");
                const current_players = server_info[4].replace(/\u0000/g, "");
                const max_players = server_info[5].replace(/\u0000/g, "");
                callback({
                    address,
                    port,
                    isOnline: true,
                    latency,
                    version,
                    motd,
                    current_players,
                    max_players
                });
            } else {
                callback({
                    address,
                    port,
                    isOnline: false
                });
            }
        }
        client.end();
    });

    client.on("timeout", () => {
        callback({
            error: { message: "Timed out" }
        });
        client.end();
    });

    client.on("end", () => {});

    client.on("error", (err) => {
        callback({ error: err });
    });
}

exports.handler = async function (event, context) {
    try {
        const { ip, port } = url.parse(event.rawUrl, true).query;
        if (!ip || !port) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: { message: "IP or PORT invalid!" }
                })
            };
        }

        const address = ip;
        const portNumber = parseInt(port, 10);

        return new Promise((resolve, reject) => {
            getData(address, portNumber, (response) => {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify(response)
                });
            });
        });
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: { message: "An error occurred!" }
            })
        };
    }
};
