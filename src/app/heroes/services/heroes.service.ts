import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private readonly http = inject(HttpClient);
  private baseUrl: string = environments.baseUrl;

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById( id:string ): Observable<Hero|undefined>{
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError( error => of(undefined))
      )
  }

  getSuggestion( query:string ): Observable<Hero[]>{
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }&_limit6`);
  }

  addHero( hero:Hero ): Observable<Hero> {
    return this.http.post<Hero>( `${this.baseUrl}/heroes`, hero);
  }

  updateHero( hero:Hero ): Observable<Hero> {
    if( !hero.id ) throw Error( 'Id hero is required' );

    return this.http.patch<Hero>( `${ this.baseUrl }/heroes/${ hero.id }`, hero);
  }

  deleteHeroById ( id:string ): Observable<boolean> {
    return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( err => of(false)),
        map( resp => true )
      )
  }
}
