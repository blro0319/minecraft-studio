"use strict";

import canvas from "canvas";
import { readdirSync, writeFileSync } from "fs";
import path from "path";

/**
 * @typedef {{
 *   x: number;
 *   y: number;
 * }} Coords
 */

class IconSpriteBuilder {
  path = "";
  outputPath = {
    sprite: "",
    map: "",
  };
  /**@type {string[]} */
  files = [];
  size = 0;
  /**@type {import("canvas").Canvas} */
  canvas = null;
  /**@type {import("canvas").CanvasRenderingContext2D} */
  context = null;
  /**@type {Record<string, Coords>} */
  spriteMap = {};

  /**
   * @param {{
   *   path: string;
   *   output: {
   *     sprite: string;
   *     map: string;
   *   };
   * }} options
   */
  constructor(options) {
    this.path = options.path.replace(/\/?$/, "/");
    this.outputPath = { ...options.output };
  }

  async build() {
    this.getIconFiles();
    this.computeSize();
    this.initCanvas();
    await this.drawSprite();
    this.writeFiles();
  }

  getIconFiles() {
    const files = readdirSync(this.path);
    this.files = files.filter((fileName) => {
      return path.extname(fileName) === ".png";
    });
  }
  computeSize() {
    let col = 2;
    while (col * col < this.files.length) {
      col *= 2;
    }
    this.size = col * 16;
  }
  initCanvas() {
    this.canvas = canvas.createCanvas(this.size, this.size);
    this.context = this.canvas.getContext("2d");
  }
  async drawSprite() {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      /**@type {Coords} */
      const pos = {
        x: (i % (this.size / 16)) * 16,
        y: Math.floor(i / (this.size / 16)) * 16,
      };
      const image = await canvas.loadImage(this.path + file);
      this.context.drawImage(image, pos.x, pos.y);

      const name = path.basename(file, path.extname(file));
      this.spriteMap[name] = { ...pos };
    }
  }
  writeFiles() {
    writeFileSync(this.outputPath.sprite, this.canvas.toBuffer());
    writeFileSync(this.outputPath.map, JSON.stringify(this.spriteMap));
  }
}

new IconSpriteBuilder({
  path: "./assets/icons",
  output: {
    sprite: "./assets/icons.png",
    map: "./assets/icons.map.json",
  },
}).build();