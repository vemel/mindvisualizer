import Coords from "./coords.js";
import Color from "./color.js";

export interface ICoordsData {
  coords: Coords;
  color: Color;
}

export interface IClickEvent {
  clientX: number;
  clientY: number;
}
