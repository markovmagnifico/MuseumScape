import GameLoader from './GameLoader';

export default class GameStateManager {
  constructor(scene) {
    this.scene = scene;
    this.entities = {};
    this.loader = new GameLoader(true);
  }

  loadConfig(config) {
    const walls = this.loader.initWalls(config.walls, this.scene);
    const walls2 = this.loader.initRooms(config.rooms, this.scene);
    const spotlights = this.loader.initSpotlights(
      config.spotlights,
      this.scene
    );
    const paintings = this.loader.initPaintings(config.paintings, this.scene);

    this.addEntities(walls);
    this.addEntities(walls2);
    this.addEntities(spotlights);
    this.addEntities(paintings);
  }

  addEntity(entity) {
    const type = entity.constructor.name;
    if (!this.entities[type]) {
      this.entities[type] = [];
    }
    this.entities[type].push(entity);
  }

  addEntities(entities) {
    const type = entities[0].constructor.name;
    if (!this.entities[type]) {
      this.entities[type] = [];
    }
    this.entities[type].push(...entities);
  }

  getEntities(classType) {
    return this.entities[classType.name] || [];
  }
}
