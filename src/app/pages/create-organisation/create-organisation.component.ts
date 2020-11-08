// Angular Imports
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, ValidationErrors } from "@angular/forms";

// Router
import { Router } from "@angular/router";

// Services
import { OrganisationsService } from "@app/services/organisations.service";
import { SnackbarService } from "@app/services/snackbar.service"

// Util
import { categoryListCustom } from "@app/util/categories";
import { locationList } from '@app/util/locations';

// Interfaces
import { CreateOrganisationForm, CreateOrganisation } from "@app/interfaces/organisation";
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';

declare var $: any;

@Component({
  selector: "app-create-organisation",
  templateUrl: "./create-organisation.component.html",
  styleUrls: ["./create-organisation.component.scss"],
})

export class CreateOrganisationComponent implements OnInit {
  
  typeGroup: Array<CategoryFilter>;
  locationGroup: Array<LocationFilter>;
  organisationForm: FormGroup;
  organisationData: CreateOrganisation;
  organisationId: string;
  headerPhoto: File;
  headerPhotoDisplay: string;
  displayPhoto: File;
  displayPhotoDisplay: string;
  additionalPhotos: File[];
  additionalPhotosDisplay: string[];

  constructor(
    private fb: FormBuilder,
    public OrganisationsService: OrganisationsService,
    private router: Router,
    public SnackbarService: SnackbarService,
  ) {}

  ngOnInit() {

    //initialize variable
    this.typeGroup = categoryListCustom;
    this.locationGroup = locationList;
    this.organisationForm = this.fb.group(CreateOrganisationForm);
    this.organisationData = null;
    this.organisationId = "";
    this.headerPhoto = null;
    this.headerPhotoDisplay = "";
    this.displayPhoto = null;
    this.displayPhotoDisplay = "";
    this.additionalPhotos = [];
    this.additionalPhotosDisplay = [];

    // CMS
    $(".action-container .action-btn").on("click", function () {
      let cmd = $(this).data("command");
      console.log(cmd);
      if (cmd == "createlink") {
        let url = prompt("Enter the link here: ", "https://");
        document.execCommand(cmd, false, url);
      } else if (cmd == "formatBlock") {
        let size = $(this).data("size");
        document.execCommand(cmd, false, size);
      } else {
        document.execCommand(cmd, false, null);
      }
    });
  }

  getFormValidationErrors(): boolean {

    Object.keys(this.organisationForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.organisationForm.get(key).errors;
      if (controlErrors != null) {
        return true;
      }
    });

    if (
      this.organisationForm.value.organisation_type == "Create a Category" &&
      this.organisationForm.value.customType == ""
    ) {
      return true;
    }
    return false;
  }

  uploadHeaderPhoto(event: Event): void {
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.headerPhotoDisplay = reader.result.toString();
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.headerPhoto = <File>(event.target as HTMLInputElement).files[0];
  }

  removeHeaderPhoto(): void {
    this.headerPhoto = null;
    this.headerPhotoDisplay = "";
  }

  uploadDisplayPhoto(event: Event): void {
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.displayPhotoDisplay = reader.result.toString();
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.displayPhoto = <File>(event.target as HTMLInputElement).files[0];
  }

  removeDisplayPhoto(): void {
    this.displayPhoto = null;
    this.displayPhotoDisplay = "";
  }

  uploadAdditionalPhoto(event: Event): void {
    if (this.additionalPhotos.length === 5 && this.additionalPhotosDisplay.length === 5) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.additionalPhotosDisplay.push(reader.result.toString());
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.additionalPhotos.push(<File>(event.target as HTMLInputElement).files[0]);
  }

  removeAdditionalPhoto(i: number): void {
    this.additionalPhotos.splice(i, 1);
    this.additionalPhotosDisplay.splice(i, 1);
  }

  createOrganisation(): void {
    if (this.getFormValidationErrors()) {
      this.SnackbarService.openSnackBar("Please complete the form", false);
      return;
    }

    const name: string = this.organisationForm.value.name;
    const organisation_type: string = this.organisationForm.value.organisation_type === "Create a Category" 
      ? this.organisationForm.value.customType
      : this.organisationForm.value.organisation_type;
    const about: string = this.organisationForm.value.about;
    const website_url: string = this.organisationForm.value.website_url;
    const phone: string = this.organisationForm.value.handphone;
    const email: string = this.organisationForm.value.email;
    const locations: string[] = this.organisationForm.value.locations;
    const story: string = $("#output").html();

    this.organisationData = {
      name,
      organisation_type,
      about,
      website_url,
      phone,
      email,
      locations,
      story
    };

    this.OrganisationsService.createOrganisation(this.organisationData).subscribe(
      (res) => {
        this.organisationId = res["data"]["organisation_id"];
      },
      (err) => {
        console.log(err);
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.create_organisation.error,
          false
        );
      },
      () => {
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.create_organisation.success,
          true
        );
        this.organisationForm.reset();
        this.router.navigate(["/organisation/" + this.organisationId])
      } 
    )

  }

}
