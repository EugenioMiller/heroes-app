import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';

import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthServiceService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private http:HttpClient) { }

  get currentUser(): User|undefined {
    if ( !this.user ) return undefined;

    return structuredClone( this.user ); //Retorna un clon profundo de el usuario
  }

  login( email:string, password:string ): Observable<User>{

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap( user => this.user = user),
        tap( user => localStorage.setItem( 'token', 'AShfsjah.lzhlAJs.hdHAHdlAHdh' ))
      );
  }

  logOut() {
    this.user = undefined;
    localStorage.clear();
  }

  checkAuthentication(): Observable<boolean> {

    if ( !localStorage.getItem('token') ) return of(false);

    return this.http.get<User>( `${this.baseUrl}/users/1`)
      .pipe(
        tap ( user => this.user = user ),
        map ( user => !!user),
        catchError ( err => of(false) )
      )
  }
}
