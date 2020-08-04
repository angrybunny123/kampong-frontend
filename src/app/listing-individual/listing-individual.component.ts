import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "../services/listings.service";
import { ProfileService } from "../services/profile.service";

// Interface
import {
  Listing,
  DefaultListing,
  ListingFAQ,
  ListingSkills,
} from "../interfaces/listing";
import { Profile } from "../interfaces/profile";

declare var $: any;

@Component({
  selector: "app-listing-individual",
  templateUrl: "./listing-individual.component.html",
  styleUrls: ["./listing-individual.component.scss"],
})
export class ListingIndividualComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ListingsService: ListingsService,
    private ProfileService: ProfileService
  ) {}

  listingId;
  ListingData: Listing[];
  SliderImageArr = [];
  FAQList: ListingFAQ[];
  SkillsList: ListingSkills[];
  ProfileInfo: Profile[];

  ngOnInit() {
    this.listingId = this.route.snapshot.params["id"];
    console.log(this.listingId);
    window.scroll(0, 0);

    // Get Listing Info
    this.ListingsService.getSelectedListing(this.listingId).subscribe(
      (data) => {
        this.ListingData = data["data"];
        // console.log(this.ListingData);

        this.SliderImageArr.push(
          this.ListingData["pic1"],
          this.ListingData["pic2"],
          this.ListingData["pic3"],
          this.ListingData["pic4"],
          this.ListingData["pic5"]
        );
        this.ProfileService.getUserProfile(
          this.ListingData["created_by"]
        ).subscribe((profile) => {
          this.ProfileInfo = profile["data"];
          console.log(this.ProfileInfo);
        });
      }
    );
    // Get FAQ Info
    this.ListingsService.getSelectedListingFAQ(this.listingId).subscribe(
      (data) => {
        this.FAQList = data["data"];
      }
    );

    // Get Skills
    this.ListingsService.getSelectedListingSkills(this.listingId).subscribe(
      (data) => {
        this.SkillsList = data["data"];
      }
    );

    // End of Data Retrive

    // UI Components
    $(".navigation-tabs li").on("click", function () {
      $(".navigation-tabs li").removeClass("active");
      $(this).addClass("active");
    });
    this.tabs_selected("story");
  }

  UpdateSlicked = false;
  // UI Components
  initiateSlick() {
    if (this.UpdateSlicked) {
      return;
    } else {
      this.UpdateSlicked = true;
      $(".update-image-slider").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        infinite: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
    }
  }

  liked_clicked() {
    // console.log("liked");
  }

  tabs_selected(selected) {
    $(".tabs-content").hide();
    $("#" + selected).show();
    if (selected == "updates") {
      this.initiateSlick();
    }
  }

  selectedProfile(user_id) {
    this.router.navigate(["/profile/" + user_id]);
  }
}
