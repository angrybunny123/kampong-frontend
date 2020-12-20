import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { environment } from "./../environments/environment";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Kampong-frontend";

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.checkCookieAndSetHeaders();
  }
}
