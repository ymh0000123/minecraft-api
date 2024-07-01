// 在 Cloudflare Pages Functions 中使用 TCP 连接到 Minecraft 服务器并获取信息
async function handleRequest(request) {
    const { socket } = new WebSocket("tcp://2b2t.org:25565");
  
    try {
      await socket.open();
      await socket.write("status\n"); // 发送获取服务器状态的命令
  
      let responseData = "";
      while (true) {
        const data = await socket.read();
        if (data === null) break;
        responseData += data;
      }
  
      return new Response(responseData, { status: 200 });
    } catch (e) {
      return new Response("Error fetching Minecraft server status.", { status: 500 });
    } finally {
      await socket.close();
    }
  }
  
  addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });
  