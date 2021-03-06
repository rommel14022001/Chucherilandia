import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import firebase from "firebase/app"

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  user;
  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
    ) { 
      this.auth.user$.subscribe(user => {
        if(user) this.user = user;
      })
    }

  create(order){
    let key = this.db.list("/users/" + this.user.uid + "/orders").push({order}).key;
    this.db.list("/orders").set(key, {order});
    return key;
  }

  getAll() {
    return this.db.list("/orders");
  }

  get(orderId) {
    return this.db.object("/orders/" + orderId);
  }

  async update(orderId, order) {
    let userId = await this.getOrderOwner(orderId);
    this.db.object("/users/" + userId + "/orders/" + orderId + "/order").update(order);
    return this.db.object("/orders/" + orderId + "/order").update(order);
  }

  async getOrderOwner(orderId) {
    let userId;
    await firebase.database().ref("/orders/" + orderId + "/order/userId").once("value").then(res => {
      userId = res.val();
    });
    return userId;
  }
}
