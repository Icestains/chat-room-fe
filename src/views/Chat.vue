<template>
  <div class="chat">
    <div class="chatbox flex">
      <div class="msglist left">
        <input class="username" type="text" v-model="username" maxlength="16" />
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
        </ul>
      </div>
      <div class="right">
        <div ref="log" id="log">
          <div class="messages" v-for="item in messages" :key="item.t">
            <div>
              {{ " U:" + item.u }}
            </div>
            <p class="contant">
              {{ item.m }}
            </p>
            <div>
              {{ "T:" + parseInt(item.t, 36) }} {{ " ip:" + showIP(item.ip) }}
            </div>
            <hr />
          </div>
        </div>
        <div id="form">
          <textarea
            ref="webchat"
            id="webchat"
            v-model="msg"
            autofocus
            placeholder="enter 发送消息"
            @keypress.enter.exact="sendMsg"
            @keypress.ctrl.enter="addEnter"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data() {
    return {
      // message: {
      msg: "",
      username: "",
      ip: "",
      // },

      ws: null,
      wsHeart: null,
      wsHeartflag: false,
      reconnectTime: 0,

      messages: [],
    };
  },

  watch: {
    messages() {},
  },

  mounted() {
    this.axios.get("http://192.168.31.177:8000/ip").then((response) => {
      console.log(response.data);
      let res = "";
      response.data.split(".").forEach((ele) => {
        res += (+ele).toString(16);
      });
      this.ip = res;

      this.username = response.data;
    });

    this.initWebsocket();

    // window.addEventListener
    // this.$refs["log"].addEventListener("scroll", this.doScroll);
  },

  methods: {
    sendMsg() {
      this.$refs["webchat"].blur();
      if (!this.msg) {
        return;
      }

      if (!this.ws) {
        console.log("连接失败");
        return;
      }

      let sendMsgObj = JSON.stringify({
        m: this.msg,
        u: this.username,
        t: new Date().valueOf().toString(36),
        ip: this.ip,
      });
      if (sendMsgObj.length > 1048576) {
        alert("字数过多！");
      }

      this.ws.send(sendMsgObj);
    },

    addEnter() {
      this.msg += "\n";
    },

    initWebsocket() {
      if (window["WebSocket"]) {
        this.ws = new WebSocket("ws://192.168.31.177:8000/ws");
        this.ws.onmessage = this.onMessage;
        this.ws.onopen = this.onOpen;
        this.ws.onerror = this.onError;
        this.ws.onclose = this.onClose;
      }
    },

    onOpen() {
      if (this.ws.readyState === 1) {
        //- readyState 等于1 的时候建立链接成功
        this.wsHeartflag = true;
        this.reconnectTime = 0;
      }
    },
    timingHeart() {
      // 心跳检测  每4.5分钟发送一次
      if (this.wsHeartflag) {
        this.ws.send("ping");
      }
      this.wsHeart = setTimeout(() => {
        this.timingHeart();
      }, 30 * 1000); // 100s心跳
    },
    onMessage(evt) {
      let receivedMsg = evt && JSON.parse(evt.data);
      console.log(receivedMsg);
      this.msg = "";
      this.messages.push(receivedMsg);
      this.$nextTick(() => {
        this.doScroll();
        this.$refs["webchat"].focus();
      });
      // if (receivedMsg.code === "1") {
      //   // this.onClose();
      // } else {
      // }
    },
    onError() {
      // 链接失败，进行重连
      clearTimeout(this.wsHeart);
      this.wsHeartflag = false;
      if (this.reconnectTime <= 100) {
        setTimeout(() => {
          this.onOpen();
          this.reconnectTime += 1;
        }, 5000);
      } else {
        this.$toast("抱歉，暂时无法连接到聊天服务器，请稍后再试");
        this.onClose();
      }
    },
    onClose() {
      this.wsHeartflag = false;
      this.ws && this.ws.close && this.ws.close();
    },

    doScroll() {
      let logDiv = this.$refs["log"];
      const needScroll = logDiv.scrollHeight - logDiv.clientHeight - 1;
      if (needScroll) {
        logDiv.scrollTop = logDiv.scrollHeight - logDiv.clientHeight;
      }
    },

    showIP(ip) {
      let res = [];
      for (let i = 0; i < 8; i += 2) {
        res.push(parseInt(ip.slice(i, i + 2), 16));
      }
      return res.join(".");
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  flex-flow: row nowrap;
}

.chat {
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  top: 0;
  bottom: 0;
  padding-top: 0;
  width: 1150px;
  height: 100%;
  border-radius: 5px;
  align-items: center;
}

.chatbox {
  position: absolute;
  margin: auto;
  align-items: center;
  top: 10px;
  bottom: 10px;
  right: 0;
  left: 0;
}

.username {
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  margin: 10px auto;
  width: 200px;
  position: relative;
  display: block;
  /* top: 20px; */
}

.msglist {
  position: relative;
  width: 320px;
  height: 100%;
  background: #33353a;
  border-radius: 5px 0 0 5px;
  right: auto;
  bottom: 0;
  justify-self: start;
}

.right {
  width: 830px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 320px;
  background: #eee;
  border-radius: 0 5px 5px 0;

  display: flex;
  flex-direction: column;
}

#log {
  background: #fdfdfd;
  margin: 0;
  padding: 10px;
  width: calc(100% - 20px);
  font-size: 1.2rem;
  overflow: auto;

  flex-grow: 1;
  /* position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 155px; */
}

#form {
  padding: 0;
  margin: 0;
  /* position: absolute;
  top: 0;
  bottom: 0;
  left: 0; */
  width: 100%;
  height: 155px;
  min-height: 155px;

  /* min-width: 700px; */
  overflow: hidden;
  border-top: 1px solid #33353a;
}

.messages {
  margin: 10px;
}

.contant {
  word-break: break-word;
  white-space: pre-wrap;
  background-color: #d3ebdd;
  display: inline-block;
  max-width: 80%;
  font-size: 14px;
  line-height: 22px;
  padding: 10px;
  border-radius: 5px;
}

#webchat {
  /* position: absolute;
  bottom: 0;
  left: 0;
  right: 0; */
  width: 100%;
  height: 100%;
  display: block;
  padding: 8px 8px 0 17px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 22px;
  background-color: #eee;
  overflow: auto;
  resize: none;
}
</style>
