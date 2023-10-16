export default class GameStateManager {
  constructor() {
    this.entities = {};
  }

  addEntity(entity) {
    const type = entity.constructor.name;
    if (!this.entities[type]) {
      this.entities[type] = [];
    }
    this.entities[type].push(entity);
  }

  getEntities(classType) {
    return this.entities[classType.name] || [];
  }
}
