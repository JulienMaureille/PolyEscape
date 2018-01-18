# Serveur Poly'Escape
Notre serveur est un serveur NodeJS qui permet :
* de jouer le rôle d'API pour manipuler les scénarios et parties du jeu
* de gérer la communication entre les joueurs

## Installation

```bash
$ npm install
```

## Utilisation

```bash
$ npm start
```

## Requêtes utilisables

* Pour récupérer tous les scénarios du jeu
```
/getAllScenarios
```

* Pour créer une nouvelle partie
```
/addGame/:name/:user
```

* Pour récupérer une partie
```
/getGame/:name
```

* Pour récupérer l'inventaire d'une partie
```
/getInventory/:game
```

* Pour ajouter un item à l'inventaire d'une partie
```
/addItem/:game/:item
```

* Pour ajouter une indication de localisation à une partie
```
/addIndication/:gameName/:indication
```

* Pour récupérer toutes les indications de localisation d'une partie
```
/getIndications/:gameName
```


## Tests
Il est possible de tester les différentes requêtes du serveur avec la commande :

```bash
$ npm test
```

Penser à bien lancer le serveur au préalable.