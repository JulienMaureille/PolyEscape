import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { ScenarioPage } from "../scenario/scenario";
import { InventairePage} from "../inventaire/inventaire";
import { EquipePage} from "../equipe/equipe";
import { MapPage} from "../map/map";
import {JoueurModel} from "../../models/joueur-model";
import {TimerComponent} from "../../components/timer/timer";

/**
 * Generated class for the GamePage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {
  mapPage = MapPage;
  scenarioPage = ScenarioPage;
  inventairePage = InventairePage;
  equipePage = EquipePage;

  private players = [];

  private game;
  private user;
  private time;

  @ViewChild(TimerComponent) timer: TimerComponent;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.game = navParams.get('game');
    this.user = navParams.get('user');
    this.time = this.game["scenario"]["timeInMinuts"]*60;

    this.players.push(this.game["chief"]);

    for(let i =0; i<this.game["players"];i++)
      this.players.push(this.game["players"][i]);

    console.log(this.players);
  }



  ngOnInit() {
    setTimeout(() => {
      console.log("salut")
      this.timer.startTimer();
    }, 1000)
  }


}
