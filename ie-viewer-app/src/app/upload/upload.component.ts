import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploadedFiles: Array<string>;

  constructor(private router: Router,
              private uploadService: UploadService) {
    this.uploadedFiles = [];
  }

  ngOnInit() {
  }

  detectFiles(event) {
    this.uploadedFiles = event.target.files;
    this.uploadService.share(this.uploadedFiles);
  }

  showExtraction() {
    this.router.navigate(['view']);
  }

}
