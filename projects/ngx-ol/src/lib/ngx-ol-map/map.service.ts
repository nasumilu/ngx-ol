import {Injectable} from '@angular/core';
import {NgxOlMapDirective} from './map.directive';
import {BehaviorSubject, map, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxOlMapService {

  readonly #maps: NgxOlMapDirective[];
  readonly #mapsSubject: Subject<NgxOlMapDirective[]>;

  constructor() {
    this.#maps = [];
    this.#mapsSubject = new BehaviorSubject<NgxOlMapDirective[]>(this.#maps);
  }

  addMap(map: NgxOlMapDirective): void {
    if (this.#maps.includes(map)) {
      return;
    }
    this.#maps.push(map);
    this.#mapsSubject.next(this.#maps);
  }

  findMapById(id: string): Observable<NgxOlMapDirective | undefined> {
      return this.#mapsSubject.pipe(
        map(maps => maps.find(map => map.id === id))
      );
  }
}
