import * as PIXI from "pixi.js";
import { loadAssets } from "./common/assets";
import {
  addPlayer,
  getPlayer,
  playerShoots,
  playerTick,
} from "./sprites/player";
import { bulletTick, initBullets } from "./sprites/bullets";

const gameState = {
  stopped: false,
  moveLeftActive: false,
  moveRightActive: false,
};

const createScene = () => {
  const app = new PIXI.Application({
    background: "#000",
    resizeTo: window,
    autoDensity: true,
    antialias: true,
    resolution: window.devicePixelRatio,
  });

  globalThis.__PIXI_APP__ = app;

  document.body.appendChild(app.view);
  gameState.app = app;
  const rootContainer = app.stage;
  rootContainer.eventMode = "static";
  rootContainer.hitArea = app.screen;

  const bullets = initBullets(app, rootContainer);
  rootContainer.addChild(bullets);

  const player = addPlayer(app, rootContainer);
  rootContainer.addChild(player);

  return app;
};

const initInteraction = () => {
  gameState.mousePosition = getPlayer().position.x;

  gameState.app.stage.addEventListener("pointermove", (e) => {
    gameState.mousePosition = e.global.x;
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      playerShoots();
    }
  });

  gameState.app.ticker.add((delta) => {
    playerTick(gameState);
    bulletTick();
  });
};

export const initGame = () => {
  loadAssets((progress) => {
    if (progress === "all") {
      createScene();
      initInteraction();
    }
  });
};
