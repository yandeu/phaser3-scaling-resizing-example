import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

type scaleMode = 'FIT' | 'SMOOTH'

const DEFAULT_WIDTH: number = 1024
const DEFAULT_HEIGHT: number = 576
const MAX_WIDTH: number = 1536
const MAX_HEIGHT: number = 864
let SCALE_MODE: scaleMode = 'SMOOTH' // FIT OR SMOOTH

const config: GameConfig = {
  backgroundColor: '#ffffff',
  // please check if the parent matched the id in your index.html file
  parent: 'phaser-game',
  scale: {
    // we do scale the game manually in resize()
    mode: Phaser.Scale.NONE,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 600 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight

    let width = DEFAULT_WIDTH
    let height = DEFAULT_HEIGHT
    let maxWidth = MAX_WIDTH
    let maxHeight = MAX_HEIGHT
    let scaleMode = SCALE_MODE

    let scale = Math.min(w / width, h / height)
    let newWidth = Math.min(w / scale, maxWidth)
    let newHeight = Math.min(h / scale, maxHeight)

    let defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT
    let maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT
    let maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT

    // smooth scaling
    let smooth = 1
    if (scaleMode === 'SMOOTH') {
      const maxSmoothScale = 1.15
      const normalize = (value, min, max) => {
        return (value - min) / (max - min)
      }
      if (width / height < w / h) {
        smooth =
          -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) / (1 / (maxSmoothScale - 1)) + maxSmoothScale
      } else {
        smooth =
          -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) / (1 / (maxSmoothScale - 1)) + maxSmoothScale
      }
    }

    // resize the game
    game.scale.resize(newWidth * smooth, newHeight * smooth)

    // scale the width and height of the css
    game.canvas.style.width = newWidth * scale + 'px'
    game.canvas.style.height = newHeight * scale + 'px'

    // center the game with css margin
    game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`
    game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`
  }
  window.addEventListener('resize', event => {
    resize()
  })
  resize()
})
