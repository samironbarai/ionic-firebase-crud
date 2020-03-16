import { Component, OnInit } from "@angular/core";
import { User } from "../models/user.model";
import {
  ToastController,
  LoadingController,
  NavController,
  Platform
} from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  user = {} as User;
  subscription: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private platform: Platform
  ) {}

  ngOnInit() {}

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator["app"].exitApp();
    });
  }
  async login(user: User) {
    // console.log(user);

    if (this.formValidation()) {
      // console.log("ready to submit");

      // show loader
      let loader = await this.loadingCtrl.create({
        message: "Please wait..."
      });
      loader.present();

      try {
        // login user with email and password
        await this.afAuth.auth
          .signInWithEmailAndPassword(user.email, user.password)
          .then(data => {
            console.log(data);

            // redirect to home page
            this.navCtrl.navigateRoot("home");
          })
          .catch();
      } catch (e) {
        this.showToast(e);
      }

      // dismis loader
      loader.dismiss();
    }
  }

  formValidation() {
    if (!this.user.email) {
      // show toast message
      this.showToast("Enter email");
      return false;
    }

    if (!this.user.password) {
      // show toast message
      this.showToast("Enter password");
      return false;
    }

    return true;
  }

  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000
      })
      .then(toastData => toastData.present());
  }
}
