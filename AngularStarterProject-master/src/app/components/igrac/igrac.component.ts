import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Igrac } from 'src/app/models/igrac';
import { Tim } from 'src/app/models/tim';
import { IgracService } from 'src/app/services/igrac.service';
import { IgracDialogComponent } from '../dialogs/igrac-dialog/igrac-dialog.component';

@Component({
  selector: 'app-igrac',
  templateUrl: './igrac.component.html',
  styleUrls: ['./igrac.component.css']
})
export class IgracComponent implements OnInit, OnDestroy, OnChanges {

  displayedColumns = ['id', 'ime', 'prezime', 'brojReg', 'datumRodjenja', 'nacionalnost','tim', 'actions'];
  dataSource: MatTableDataSource<Igrac>;
  subscription : Subscription;
  @Input() selektovanTim: Tim;
  constructor(private igracService: IgracService,
              private dialog: MatDialog) { }


  ngOnChanges(): void {
    if(this.selektovanTim.id) {
      this.loadData();
      
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    //this.loadData();
  }

  loadData() {
    this.subscription = this.igracService.getIgraciZaTim(this.selektovanTim.id).subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
    
    }),
    (error: Error) => {
      console.log(error.name + ' ' + error.message)
    }
  }

  openDialog(flag: number, id?:number, ime?:String, prezime?:String, brojReg?:String,
              datumRodjenja?:Date, nacionalnost?:number, tim?:number) {
    const dialogRef = this.dialog.open(IgracDialogComponent, { data: {id, ime, prezime, brojReg,
      datumRodjenja, nacionalnost, tim}});
      dialogRef.componentInstance.flag = flag;
      if(flag===1){
        dialogRef.componentInstance.data.tim = this.selektovanTim.id;
      }
      dialogRef.afterClosed().subscribe( res => {
        if( res === 1){
          this.loadData();
        }});
  }
}
