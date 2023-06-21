import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

import { switchMap } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})

export class NewPageComponent implements OnInit{

  public formHero = new FormGroup({
    id:         new FormControl<string>(''),
    superhero:  new FormControl<string>('', { nonNullable: true } ),
    publisher:  new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:  new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img:    new FormControl('')
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ]

  private readonly route = inject(Router);
  private readonly dialog = inject(MatDialog);

  constructor(
    private heroService: HeroesService,
    private activeRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    ){}

  ngOnInit(): void {
    if ( !this.route.url.includes('edit') ) return;

    this.activeRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroService.getHeroById( id ) ),
      ).subscribe( hero => {
        if ( !hero ) return this.route.navigateByUrl('/');

        this.formHero.reset( hero );
        return;
      })
  }

  get currentHero(): Hero {
    const hero =  this.formHero.value as Hero;

    return hero;
  }

  onSubmit():void {

    if ( this.currentHero.id ){
      this.heroService.updateHero(this.currentHero)
        .subscribe( hero => {
          this.showSnackBar("Se editó héroe correctamente");
          this.route.navigateByUrl('/');
        });
    }

    this.heroService.addHero( this.currentHero )
      .subscribe( hero => {
        this.showSnackBar("Se creó héroe correctamente");
        this.route.navigateByUrl('/');
      })
  }

  onConfirmDelet() {
    if ( !this.currentHero.id ) throw Error ('Id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.formHero.value,
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) return;

      this.heroService.deleteHeroById( this.currentHero.id )
        .subscribe( wasDeleted => {
          if ( wasDeleted ) this.route.navigateByUrl('/');
        });
    });
  }

  showSnackBar( msg:string ):void {
    this.snackbar.open( msg, 'done', {
      duration: 2500,
    });
  }
}
