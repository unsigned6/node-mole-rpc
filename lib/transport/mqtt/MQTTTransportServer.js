class MQTTTransportServer {
    constructor({mqttClient, inTopic, outTopic}) {
        this.mqttClient = mqttClient;
        this.inTopic  = inTopic;
        this.outTopic = outTopic;
    }

    async onMessage(callback) {
        await this.mqttClient.subscribe(this.inTopic);
        this.mqttClient.on('message', (topic, data) => { 
            console.log(`SERVER RECEIVES ${topic}`, data.toString());
            callback(data.toString(), (callbackData) => {
                const outTopic = 
                    typeof this.outTopic === "function" 
                    ? this.outTopic({inTopic: topic})
                    : this.outTopic;

                this._send(outTopic, callbackData)
            })
        });
    }

    _send(outTopic, data) {
        console.log('SERVER SENDS',outTopic, data);
        this.mqttClient.publish(outTopic, data);
    }
}

module.exports = MQTTTransportServer;
