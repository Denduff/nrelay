import { Log, LogLevel } from './../services/logger';
import fs = require('fs');
import path = require('path');
import { ITile } from './../models/tile';
import { IObject } from './../models/object';
import { environment } from './../models/environment';

const dir = path.dirname(require.main.filename);

export class ResourceManager {

    static tiles: { [id: number]: ITile };
    static objects: { [id: number]: IObject };
    static items: { [id: number]: IObject };
    static enemies: { [id: number]: IObject };
    static pets: { [id: number]: IObject };

    static loadTileInfo(): void {
        this.tiles = {};
        const groundTypesPath = path.join(dir, 'resources', 'GroundTypes.json');
        let tileArray: any[];
        try {
            let contents = fs.readFileSync(groundTypesPath, 'utf8');
            tileArray = JSON.parse(contents)['Ground'];
            contents = null;
        } catch {
            Log('ResourceManager', 'Error reading GroundTypes.json', LogLevel.Warning);
            return;
        }
        for (let i = 0; i < tileArray.length; i++) {
            try {
                this.tiles[+tileArray[i].type] = {
                    type: +tileArray[i].type,
                    id: tileArray[i].id,
                    sink: (tileArray[i].Sink ? true : false),
                    speed: (+tileArray[i].Speed || 1),
                    noWalk: (tileArray[i].NoWalk ? true : false)
                };
            } catch {
                if (environment.debug) {
                    Log('ResourceManager', 'Failed to load tile: ' + tileArray[i].type, LogLevel.Warning);
                }
            }
        }
        Log('ResourceManager', 'Loaded ' + tileArray.length + ' tiles.', LogLevel.Info);
        tileArray = null;
    }

    static loadObjects(): void {
        this.objects = {};
        this.items = {};
        this.enemies = {};
        this.pets = {};
        const objectsPath = path.join(dir, 'resources', 'Objects.json');
        let objectsArray: any[];
        let itemCount = 0;
        let enemyCount = 0;
        let petCount = 0;
        try {
            let contents = fs.readFileSync(objectsPath, 'utf8');
            objectsArray = JSON.parse(contents)['Object'];
            contents = null;
        } catch {
            Log('ResourceManager', 'Error reading Objects.json', LogLevel.Warning);
        }
        for (let i = 0; i < objectsArray.length; i++) {
            try {
                this.objects[+objectsArray[i].type] = {
                    type: +objectsArray[i].type,
                    id: objectsArray[i].id,
                    enemy: (objectsArray[i].Enemy === '' ? true : false),
                    item: (objectsArray[i].Item === '' ? true : false),
                    god: (objectsArray[i].God === '' ? true : false),
                    pet: (objectsArray[i].Pet === '' ? true : false),
                    slotType: (+objectsArray[i].SlotType || -1),
                    bagType: (+objectsArray[i].BagType || -1),
                    class: objectsArray[i].Class,
                    maxHitPoints: (+objectsArray[i].MaxHitPoints || -1),
                    defense: (+objectsArray[i].Defense || -1),
                    xpMultiplier: (+objectsArray[i].XpMult || -1),
                    projectile: (objectsArray[i].Projectile ? {
                        id: +objectsArray[i].Projectile.id,
                        objectId: objectsArray[i].Projectile.ObjectId,
                        damage: (+objectsArray[i].Projectile.damage || -1),
                        minDamage: (+objectsArray[i].Projectile.MinDamage || -1),
                        maxDamage: (+objectsArray[i].Projectile.maxDamage || -1),
                        speed: +objectsArray[i].Projectile.Speed,
                        lifetimeMS: +objectsArray[i].Projectile.LifetimeMS
                    } : null),
                    rateOfFire: (+objectsArray[i].RateOfFire || -1),
                    fameBonus: (+objectsArray[i].FameBonus || -1),
                    feedPower: (+objectsArray[i].FeedPower || -1),
                    fullOccupy: (objectsArray[i].FullOccupy === '' ? true : false),
                    occupySquare: (objectsArray[i].OccupySquare === '' ? true : false),
                };
                // map items.
                if (this.objects[+objectsArray[i].type].item) {
                    this.items[+objectsArray[i].type] = this.objects[+objectsArray[i].type];
                    itemCount++;
                }
                // map enemies.
                if (this.objects[+objectsArray[i].type].enemy) {
                    this.enemies[+objectsArray[i].type] = this.objects[+objectsArray[i].type];
                    enemyCount++;
                }
                // map pets.
                if (this.objects[+objectsArray[i].type].pet) {
                    this.pets[+objectsArray[i].type] = this.objects[+objectsArray[i].type];
                    petCount++;
                }
            } catch {
                if (environment.debug) {
                    Log('ResourceManager', 'Failed to load tile: ' + objectsArray[i].type, LogLevel.Warning);
                }
            }
        }
        Log('ResourceManager', 'Loaded ' + objectsArray.length + ' objects.', LogLevel.Info);
        Log('ResourceManager', 'Loaded ' + itemCount + ' items.', LogLevel.Info);
        Log('ResourceManager', 'Loaded ' + enemyCount + ' enemies.', LogLevel.Info);
        Log('ResourceManager', 'Loaded ' + petCount + ' pets.', LogLevel.Info);
        objectsArray = null;
    }
}
