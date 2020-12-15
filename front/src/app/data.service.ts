import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private pseudoSource = new BehaviorSubject<string>('anonymous');
  currentPseudo = this.pseudoSource.asObservable();

  constructor() { }

  changePseudo(pseudo: string) {
    this.pseudoSource.next(pseudo);
  }
}
