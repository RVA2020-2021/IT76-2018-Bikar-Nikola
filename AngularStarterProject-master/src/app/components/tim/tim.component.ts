import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Tim } from 'src/app/models/tim';
import { TimService } from 'src/app/services/tim.service';
import { TimDialogComponent } from '../dialogs/tim-dialog/tim-dialog.component';

@Component({
  selector: 'app-tim',
  templateUrl: './tim.component.html',
  styleUrls: ['./tim.component.css']
})
export class TimComponent implements OnInit, OnDestroy {

  displayedColumns = ['id', 'naziv', 'osnovan','sediste', 'actions'];
  dataSource: MatTableDataSource<Tim>
  subscription: Subscription;
  constructor(private timService: TimService,
              private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(){
   this.subscription = this.timService.getAllTims().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data);
      }
    ),
    (error: Error) => {
      console.log(error.name + ' ' + error.message);
    }
  }

  public openDialog(flag: number, id?: number, naziv? : String, osnovan?:Date, sediste?: String) {
      const dialogRef = this.dialog.open(TimDialogComponent, {data: {id,naziv,osnovan,sediste}});
      dialogRef.componentInstance.flag = flag;
      dialogRef.afterClosed().subscribe(result => {
        if(result == 1){
          this.loadData();
        }
      })
  }



}
