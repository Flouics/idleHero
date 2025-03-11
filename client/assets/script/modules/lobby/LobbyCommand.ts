

import {App} from "../../App";
import {Command} from "../base/Command"
import { LobbyProxy }  from "./LobbyProxy";

export class LobbyCommand extends Command{
    proxy:LobbyProxy;
}
