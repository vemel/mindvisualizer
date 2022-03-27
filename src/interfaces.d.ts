import Coords from './coords.js'
import Color from './color.js'
import {
  TextsParameter,
  NumberParameter,
  BooleanParameter,
} from './parameters.js'
import UISlider from './controls/uiSlider.js'
import UICheckbox from './controls/uiCheckbox.js'

export interface ICoordsData {
  coords: Coords
  color: Color
}

export interface IClickEvent {
  clientX: number
  clientY: number
}

export interface IRawCoordsData {
  coords: [number, number]
  color: [number, number, number, number]
}

export interface IOptionsState {
  textQuery: string
  maxThoughts: number
  speed: number
  shuffle: boolean
  demo: boolean
  hideUI: boolean
}

export interface IParameters {
  textQuery: TextsParameter
  maxThoughts: NumberParameter
  speed: NumberParameter
  shuffle: BooleanParameter
  demo: BooleanParameter
  hideUI: BooleanParameter
}

export interface IUIInputs {
  maxThoughts: UISlider
  speed: UISlider
  shuffle: UICheckbox
  demo: UICheckbox
}
