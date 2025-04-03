
import { _decorator, director, Component} from 'cc';

const {ccclass, property} = _decorator;

@ccclass("Splash")
export class Splash extends Component{
    // use this for initialization
    onLoad () {

    };

    onEnable () {

    };

    start () {
        director.loadScene("game", () => {

        });
    };

};
