import { Component, OnInit } from '@angular/core';
import { DriverService } from '../services/driver.service';
import { TransactionService } from '../services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { CURRENCY_SYMBOL } from "../../environments/environment.prod";
import { CommonService } from '../services/common.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  public records: any;
  public driver: any;
  currency: any = CURRENCY_SYMBOL;

  constructor(private transactionService: TransactionService,
    private translate: TranslateService,
    private driverService: DriverService,
    private common: CommonService,
    private alertCtrl: AlertController
  ) {
    // get transactions from service
    transactionService.getTransactions().valueChanges().subscribe(snapshot => {
      if (snapshot != null)
        this.records = snapshot.reverse();
    });
    this.driverService.getDriver().valueChanges().subscribe(snapshot => {
      this.driver = snapshot;
    });

  }

  withdraw() {

    this.alertCtrl.create({
      header: "Make a Withdraw",
      inputs: [
        { name: 'amount', placeholder: 'Amount' },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log(data);
            if (parseFloat(data.amount) > parseFloat(this.driver.balance)) {
              this.common.showAlert("Insufficient Balance");
            }
            else {
              this.transactionService.widthDraw(data.amount, this.driver.balance).then(() => {
                this.common.showToast('withdraw Requested');
              });
            }
          }
        }
      ]
    }).then(x => x.present());
  }

  ngOnInit() {
  }

}
