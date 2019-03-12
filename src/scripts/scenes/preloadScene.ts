export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.crossOrigin = 'anonymous'
    this.load.baseURL = 'assets/img/'
    //this.load.baseURL = 'https://labs.phaser.io/src/games/firstgame/assets/'
    this.load.image('sky', 'sky.png')
    this.load.image('ground', 'platform.png')
    this.load.image('star', 'star.png')
    this.load.image('bomb', 'bomb.png')
    this.load.spritesheet('dude', 'dude.png', { frameWidth: 32, frameHeight: 48 })
  }

  create() {
    this.scene.start('MainScene')
  }
}
