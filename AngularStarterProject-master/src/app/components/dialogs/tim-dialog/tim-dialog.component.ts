import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'selenium-webdriver';
import { Tim } from 'src/app/models/tim';
import { TimService } from 'src/app/services/tim.service';

@Component({
  selector: 'app-tim-dialog',
  templateUrl: './tim-dialog.component.html',
  styleUrls: ['./tim-dialog.component.css']
})
export class TimDialogComponent implements OnInit {

  public flag: number;

  constructor(public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<TimDialogComponent>,
              @Inject (MAT_DIALOG_DATA) public data: Tim,
              public timService: TimService
              ) { }

  ngOnInit(): void {
  }

  public add() : void {
    this.timService.addTim(this.data).subscribe(() => {
      this.snackBar.open('Uspesno dodat tim: ' + this.data.naziv, 'OK', {
        duration: 25000
      })
    }),
      (error:Error) => {
        console.log(error.name + ' ' + error.message);
        this.snackBar.open('Doslo je do greske prilikom dodavanja', 'Zatvori', {
          duration: 25000
        })
      }
  }

  public update() : void{
    this.timService.updateTim(this.data).subscribe(()=>{
      this.snackBar.open('Uspesno azuriran tim: ' + this.data.naziv, 'OK', {
        duration: 2500
      })
    }),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Doslo je do greske prilikom azuriranja', 'Zatvori', {
        duration: 2500
      })
    }
  }

  public delete() : void{
    this.timService.deleteTim(this.data.id).subscribe(()=>{
      this.snackBar.open('Uspesno obrisan tim: ' + this.data.naziv, 'OK', {
        duration: 2500
      })
    }),
    (error:Error) => {
      console.log(error.name + ' ' + error.message);
      this.snackBar.open('Doslo je do greske prilikom brisanja', 'Zatvori', {
        duration: 1000
      })
    }
  }

  public cancel(): void {
    this.dialogRef.close();
     this.snackBar.open('Odustali ste', 'Zatvori',{
       duration: 1000
     })
  }


}