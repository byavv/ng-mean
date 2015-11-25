
export default class ServerMessage implements mts.IServerMessageHandler {
    public static serviceId: string = "serverMessageHandler";
    public static $inject = ["config"];

    private serverData: any;

    constructor(private config: any) {
        this.serverData = config.serverData || {};
    }

    public handleMessage(message: mts.IError, allowArrayResult: boolean = false): string {
        if (!!message && _.has(this.serverData, message.key)) {
            if (message.message) {
                if (_.isString(message.message)) {
                    return message.message;
                }
                if (_.isArray(message.message)) {
                    if (allowArrayResult) {
                        return message.message;
                    } else {
                        return message.message[0];
                    }
                }
            } else {
                return this.serverData[message.key].default;
            }
        } else {
            return "Unexpected server error";
        }
    }
};
