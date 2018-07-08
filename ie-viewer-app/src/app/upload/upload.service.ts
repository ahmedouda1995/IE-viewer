import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UploadService {

  private sharedResource = new BehaviorSubject<any>(null);
  currentResource = this.sharedResource.asObservable();
  constructor() {}

  share(resource: any) {
    this.sharedResource.next(resource);
  }
}
