import Player from '../objects/player'

export default class MainScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text
  cursors: Phaser.Input.Keyboard.CursorKeys
  player: Player

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    const world = {
      width: 1600, // the width of 2 ground platforms
      height: 800 // the hight of the game
    }

    // the width and height of the world map
    this.cameras.main.setBounds(0, 0, world.width, world.height)
    this.physics.world.setBounds(0, 0, world.width, world.height)

    // draw safe area
    let safeArea = this.add
      .rectangle(
        this.cameras.main.width / 2 - +this.game.config.width / 2,
        this.cameras.main.height - +this.game.config.height,
        +this.game.config.width,
        +this.game.config.height,
        0xff00ff,
        0.08
      )
      .setStrokeStyle(4, 0xff00ff, 0.25)
      .setOrigin(0)
      .setDepth(2)
      .setScrollFactor(0)

    // draw the sky
    let sky = this.add
      .tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'sky')
      .setOrigin(0)
      // take the full height
      .setScale(Math.max(this.cameras.main.height / 600, 1))
      .setScrollFactor(0)

    // add all platforms
    let platforms = this.physics.add.staticGroup()
    platforms
      .create(400, 800, 'ground')
      .setScale(2)
      .refreshBody()
      .setOrigin(0.5, 1)
    platforms
      .create(1200, 800, 'ground')
      .setScale(2)
      .refreshBody()
      .setOrigin(0.5, 1)
    platforms.create(600, 632, 'ground')
    platforms.create(50, 482, 'ground')
    platforms.create(750, 453, 'ground')
    platforms.create(1150, 312, 'ground')
    platforms.refresh()

    // add the player
    this.player = new Player(this, 450, 450)

    // add the stars
    let stars = this.physics.add.group({
      key: 'star',
      repeat: 22,
      setXY: { x: 12, y: 0, stepX: 70 }
    })
    // @ts-ignore
    stars.children.iterate((child: Phaser.GameObjects.Sprite) => {
      // @ts-ignore
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
      child.setInteractive().on('pointerdown', () => {
        console.log('star body', child.body)
        console.log('you hit a star')
      })
    })

    // add the score text
    let score = 0
    // this is fixed to the safeArea
    let scoreTextSafeArea = this.add
      .text(safeArea.x + 16, safeArea.y + 16, 'score: 0', { fontSize: '32px', fill: '#000' })
      .setOrigin(0)
      .setScrollFactor(0)
    // this is fixed to the safeArea
    let scoreText = this.add
      .text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
      .setOrigin(0)
      .setScrollFactor(0)

    // collect a star
    const collectStar = (player, star) => {
      star.disableBody(true, true)
      score += 10
      scoreText.setText('Score: ' + score)
      scoreTextSafeArea.setText('Score: ' + score)
    }

    // add collider and overlap
    this.physics.add.collider(this.player, platforms)
    this.physics.add.collider(stars, platforms)
    this.physics.add.overlap(this.player, stars, collectStar)

    // add cursors
    this.cursors = this.input.keyboard.createCursorKeys()

    // camera should follow the player
    this.cameras.main.startFollow(this.player, true)

    // the resize function
    const resize = () => {
      // update position of safe area
      safeArea.x = this.cameras.main.width / 2 - +this.game.config.width / 2
      safeArea.y = this.cameras.main.height - +this.game.config.height

      // adjust the score text
      scoreTextSafeArea.x = safeArea.x + 16
      scoreTextSafeArea.y = safeArea.y + 16
      scoreText.x = 16
      scoreText.y = 16

      // adjust sky
      sky.width = this.cameras.main.width
      sky.height = this.cameras.main.height
      sky.setScale(Math.max(this.cameras.main.height / 600, 1))
    }

    this.scale.on('resize', (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height)
      resize()
    })
    resize()
  }

  update() {
    this.player.update(this.cursors)
  }
}
