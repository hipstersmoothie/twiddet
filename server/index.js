"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env = __importStar(require("dotenv"));
const twitter_1 = __importDefault(require("./routes/twitter"));
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next_1.default({ dev });
const handle = app.getRequestHandler();
async function startServer() {
    try {
        env.config();
        await app.prepare();
        const server = express_1.default();
        // enhance your app security with Helmet
        server.use(helmet_1.default());
        // use bodyParser to parse application/json content-type
        server.use(bodyParser.json());
        // enable all CORS requests
        server.use(cors_1.default());
        server.use('/api', twitter_1.default);
        server.get('*', (req, res) => handle(req, res));
        server.listen(PORT, (err) => {
            if (err) {
                throw err;
            }
            console.log(`> Ready on ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map