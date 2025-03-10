

import App from "../../App";
import BaseCommand from "../base/Command"
import { LobbyProxy }  from "./LobbyProxy";

export default class LobbyCommand extends BaseCommand{
    proxy:LobbyProxy;
}
