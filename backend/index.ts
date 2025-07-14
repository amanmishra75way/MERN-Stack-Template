import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import http from "http";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";
import { loadConfig } from "./app/common/helper/config.hepler";
loadConfig();
import limiter from "./app/common/middleware/rate-limiter.middleware";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import routes from "./app/routes";
import { type IUser } from "./app/user/user.dto";
import { initRedis } from "./app/common/services/redis.service";

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);

const initApp = async (): Promise<void> => {
  // init mongodb
  await initDB();

  //init RedisClient
  await initRedis();

  // passport init
  initPassport();

  // set base path to /api
  app.use("/api", routes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("Server is runnuing on port", port);
  });
};

void initApp();
