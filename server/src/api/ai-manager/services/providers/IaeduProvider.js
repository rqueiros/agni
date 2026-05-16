const BaseProvider = require('./BaseProvider');

const axios = require('axios');

class IaeduProvider extends BaseProvider {
  async generate(prompt) {
    const formData = new FormData();
    formData.append("channel_id", "cmhi8dq9t34ebgt01mg4jwz3k");
    formData.append("thread_id", generateRandomString());
    formData.append("user_info", "{}"); 
    formData.append("message", prompt);

    try {
      const response = await axios.post("https://api.iaedu.pt/agent-chat//api/v1/agent/cmamvd3n40000c801qeacoad2/stream", formData, { headers: { "Content-Type": "multipart/form-data", 'x-api-key': this.apiKey }, maxContentLength: Infinity, maxBodyLength: Infinity });
      const lines = response.data.split('\n\n');
      lines.pop();
      let parsedResponse;

      for (const line of lines) {
        const parsedLine = JSON.parse(line);
        if (parsedLine.type === 'message') {
          parsedResponse = this.safeParse(parsedLine.content.content.replace(/```json\n?|```/g, ''));
          break;
        }

        if (parsedLine.type === 'error') {
            break;
        }
      }

      return parsedResponse;
    } catch (err) {
        throw err;
    }
  }
}

function generateRandomString(length = 21) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  const charsLength = chars.length;

  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}


module.exports = IaeduProvider;