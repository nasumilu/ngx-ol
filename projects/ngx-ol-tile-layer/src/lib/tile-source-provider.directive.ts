import { Directive } from '@angular/core';
import TileSource from 'ol/source/Tile';
import {Options} from 'ol/source/Tile';
import {NgxOlSourceProviderDirective} from 'ngx-ol-layer';

@Directive({
  selector: 'ol-tile-source'
})
export class NgxOlTileSourceProviderDirective<S extends TileSource, O extends Options> extends NgxOlSourceProviderDirective<S, O>{

  constructor() {
    super();
  }

}
