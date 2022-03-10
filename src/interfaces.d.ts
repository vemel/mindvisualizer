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

export interface IRawCoordsData {
  coords: [number, number];
  color: [number, number, number, number];
}
