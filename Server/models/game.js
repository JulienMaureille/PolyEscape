/**
 * Created by Julien on 14/01/2018.
 */
"use strict";
let Player = require("./player.js");
let HelpRequest = require("./help-request");
let SkillList = require("./skillList.js");

const GameState = {
    WAITING_SCENARIO: Symbol("En attente d'un scénario"),
    WAITING_PLAYERS: Symbol("En attente de joueurs"),
    RUNNING: Symbol("En cours"),
    FINISHED: Symbol("Terminée")
};

module.exports = class Game {

    constructor(id, name) {
        this.id = id;
        this.name = name.toLowerCase();
        this.chief;
        this.helpRequest = {};
        this.state = GameState.WAITING_SCENARIO;
        this.players = [];
        this.users = [];
        this.scenario;
        this.inventory = [];
        this.missions = [];
        this.indications = [];
        this.skills = new SkillList();

    }

    getName() {
        return this.name;
    }

    addPlayer(play){
        this.players.push(play);
        this.users.push(new Player(play));
    }

    getUser(name){
        let index = this.users.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
        return this.users[index];
    }

    acceptsPlayerNamed(name){
        return (this.state === GameState.WAITING_PLAYERS && (this.players.length < this.scenario["nbPlayers"]) && !this.hasPlayerNamed(name));
    }

    getScenario(){
        return this.scenario;
    }



    removePlayer(play){
        let index = this.players.findIndex(i => i.toLowerCase() === play.toLowerCase());
        this.players.splice(index, 1);
        index = this.users.findIndex(i => i.name.toLowerCase() === play.toLowerCase());
        this.users.splice(index, 1);
    }

    mapPlayersToMissions(){
        let nbMissions = this.scenario["missions"].length;
        let nbPlayers = this.users.length;
        let tmpMissions =[];
        let tmpPlayers = [];
        for(let i=0; i<nbMissions; i++){
            tmpMissions.push(this.scenario["missions"][i]);
        }
        for(let i=0; i<nbPlayers; i++){
            tmpPlayers.push(this.users[i]);
        }

        while(tmpMissions.length !== 0){
            if(tmpPlayers.length === 0)
                tmpPlayers = this.users;
            let i =0;
            while(tmpPlayers[i].skill !== tmpMissions[0]["skill"] && i<tmpPlayers.length-1) {
                i++;
                if (i === tmpPlayers.length)
                    break;
            }

            if(i === tmpPlayers.length){
                i = 0;
                while(tmpPlayers[i].skill !== "None" && i<tmpPlayers.length-1){
                    i++;
                }
            }

            this.missions.push({mission: tmpMissions[0], player:tmpPlayers[i].name});
            tmpMissions.splice(0, 1);
            tmpPlayers.splice(i, 1);
        }

        // if(nbMissions === nbPlayers){
        //     for(let i=0; i< nbPlayers;i++)
        //         this.missions.push({mission:this.scenario["missions"][i], player:this.players[i]});
        // }
    }



    setGameSkills(scenario){
        for(let i=0; i< scenario['skills'].length;i++){
            this.skills.list.push({name: scenario['skills'][i].name, skillImg: scenario['skills'][i].img, users: [""]})
        }
    }

    pickSkill(skillName, user){
        this.skills.pickSkill(skillName, user);
        this.getUser(user).setSkill(skillName);
    }


    rejectSkill(skillName, user){
        this.skills.pop(skillName, user);
        this.getUser(user).resetSkill();
    }


    hasPlayerNamed(name){
        return (this.players.findIndex(i => i.toLowerCase() === name.toLowerCase()) != -1);
    }

    getTimeInMinuts(){
        return this.scenario.timeInMinuts;
    }

    isRunnableBy(name){
        return (name === this.chief);
    }

    setScenario(scenar){
        this.scenario = scenar;
        this.state = GameState.WAITING_PLAYERS;
    }

    setChief(ch){
        this.addPlayer(ch);
        this.chief = ch;
    }

    getChief() {
        return this.chief;
    }

    getPlayers(){
        return this.players;
    }

    getInventory(){
        return this.inventory;
    }

    run(){
        this.state = GameState.RUNNING;
    }

    isRunning(){
        return (this.state === GameState.RUNNING);
    }

    isWaitingForPlayers(){
        return (this.state === GameState.WAITING_PLAYERS);
    }

    isWaitingForScenario(){
        return (this.state === GameState.WAITING_SCENARIO);
    }


    finish(){
        this.state = GameState.FINISHED;
    }

    createHelpRequest(user,question){
        this.helpRequest = new HelpRequest(user,question,this.players.length - 1);

    }


    answerHelpRequest(answer){
        this.helpRequest.addAnswer(answer);
    }

    findPathItem(item){
        for(let i=0; i<this.scenario['missions'].length; i++){
            if(this.scenario['missions'][i]['item'] === parseInt(item.valueOf())){
                return this.scenario['missions'][i].img;
            }
        }
    }
};
