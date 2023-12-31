import GameLoader from './GameLoader';
import DynamicSpotlight from './Spotlight';
import AbilityUnlocker from './abilityUnlocker';

export default class GameStateManager {
  constructor(scene) {
    this.scene = scene;
    this.entities = {};
    this.loader = new GameLoader(false);

    // this.state = {
    //   walls: [],
    //   rooms: [],
    //   lights: [],
    //   paintings: [],
    // };
  }

  loadConfig(config) {
    const floors = this.loader.initFloors(config.floors, this.scene);
    const rooms = this.loader.initRooms(config.rooms, this.scene);
    const paintings = this.loader.initPaintings(config.paintings, this.scene);
    const spotlights = this.loader.initSpotlights(
      config.spotlights,
      this.scene
    );
    const abilityChecks = this.loader.initAbilityChecks(this.scene);

    this.addEntities(abilityChecks);
    this.addEntities(floors);
    rooms.forEach((room) => {
      this.addEntity(room);
      this.addEntities(room.walls);
      this.addEntities(room.paintings);
      this.addEntities(paintings);
      this.addEntities(room.spotlights);
      this.addEntities(spotlights);
    });
  }

  addEntity(entity) {
    const type = entity.constructor.name;
    if (!this.entities[type]) {
      this.entities[type] = [];
    }
    this.entities[type].push(entity);
  }

  addEntities(entities) {
    if (entities.length > 0) {
      const type = entities[0].constructor.name;
      if (!this.entities[type]) {
        this.entities[type] = [];
      }
      this.entities[type].push(...entities);
    }
  }

  getEntities(classType) {
    return this.entities[classType.name] || [];
  }

  updateLights(player) {
    const lights = this.getEntities(DynamicSpotlight);
    lights.forEach((light) => {
      light.update(player);
    });
  }

  updateAbilities(player) {
    const abilityUnlockers = this.getEntities(AbilityUnlocker);
    abilityUnlockers.forEach((unlocker) => {
      unlocker.update(player);
    });
  }
}
