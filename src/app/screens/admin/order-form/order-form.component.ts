import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order/order.service';
import { StatusService } from 'src/app/services/status/status.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  statuses$;
  id;
  order = {
    userName: "",
    totalPayment: 0,
    status: "",
  };
  pedido = []
  displayedColumns: string[] = ["cantidad", "nombre", "costo"]
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private statusService: StatusService,
    private orderService: OrderService) { 

    this.statuses$ = statusService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val() as any})))
    )

    this.id = this.route.snapshot.paramMap.getAll("id");
    if(this.id) {
      this.orderService.get(this.id).valueChanges().pipe(take(1))
      .subscribe(order => {
        let fullOrder = order['order'];
        this.order['userName'] = fullOrder['userName']
        this.order['totalPayment'] = fullOrder['totalPayment']
        this.order['status'] = fullOrder['status']
        fullOrder['pedido'].forEach(x => {
          if(x){
            this.pedido.push(x);
          }
          
        })
        this.dataSource = new MatTableDataSource(this.pedido)
        this.dataSource.paginator = this.paginator;
      })
    }
  }

  ngOnInit(): void {
  }

  save(form) {
    form['pedido'] = this.pedido;
    this.orderService.update(this.id, form);
    this.router.navigate(['admin/ordenes']);
  }

}
