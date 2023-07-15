import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {map, Observable, of, switchMap} from 'rxjs';
import {applyTransform, Extent} from 'ol/extent';
import {get, getTransform, Projection, ProjectionLike, transformExtent} from 'ol/proj';

export abstract class NgxOlProjectionLookupProvider {
  abstract findByEPSGCode(code: string): Observable<NgxOlProjectionDefinition>;
}

export type NgxOlProjectionDefinition = {
  code: string,
  text: string,
  worldExtent?: Extent
};

export const NGX_OL_PROJECTION_DEF = new InjectionToken<NgxOlProjectionDefinition>('NgxOlProjectionDefToken');

@Injectable({
  providedIn: 'root'
})
export class NgxOlProjectionService {

  constructor(
    @Optional() @Inject(NgxOlProjectionLookupProvider) private readonly projectionLookupProvider?: NgxOlProjectionLookupProvider,
    @Optional() @Inject(NGX_OL_PROJECTION_DEF) projectionDefs?: NgxOlProjectionDefinition[]) {

    register(proj4);
    if (projectionDefs) {
      proj4.defs(projectionDefs.map(projectionDef => [projectionDef.code, projectionDef.text]));
      register(proj4);
      projectionDefs.filter(def => def.worldExtent)
        .forEach(def => {
          const projection = get(def.code);
          projection?.setWorldExtent(<Extent>def.worldExtent);
          projection?.setExtent(transformExtent(<Extent>def.worldExtent,'EPSG:4326', projection));
        });
    }
  }

  #epsgLookup(code: string): Observable<Projection | null> {

    return of(code).pipe(
      map(value => {
        return get(value);
      }),
      switchMap(value => {
        if (null != value) {
          return of(value);
        }

        if (!this.projectionLookupProvider) {
          return of(null);
        }

        return this.projectionLookupProvider?.findByEPSGCode(code).pipe(
          map(def => {
            proj4.defs(def.code, def.text);
            register(proj4);
            const projection = get(def.code);
            if (projection && def?.worldExtent) {
              projection.setWorldExtent(def.worldExtent);
              const fromLatLng = getTransform('EPSG:4326', projection);
              projection.setExtent(applyTransform(def.worldExtent, fromLatLng, undefined, 8));
            }
            return projection;
          })
        );
      })
    );
  }

  findByCode(code: ProjectionLike): Observable<Projection | null> {
    if (undefined == code || code instanceof Projection) {
      return of(code ?? null);
    }
    return this.#epsgLookup(code);
  }

  getRegistered(): string[] {
    return Object.keys(proj4.defs);
  }
}
