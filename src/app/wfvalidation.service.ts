import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WfvalidationService {

  constructor(private http: HttpClient) { }

  private getHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };
    return httpOptions;
  }

  validateGrantWorkflow(grantId: number, userId: number, fromStateId: number, toStateId: number): Promise<any> {
    return this.http.get('/api/user/' + userId + '/grant/' + grantId + '/workflow/validate/' + fromStateId + '/' + toStateId, this.getHeader())
      .toPromise().then((result: any) => {

        let canMove = result.canMove;
        const infoMessages = result.messages.filter(m => m.type === 'INFO');
        const errorMessages = result.messages.filter(m => m.type === 'WARN');
        if (!canMove && errorMessages.length === 0) {
          canMove = true;
        }

        return { canMove: canMove, info: infoMessages, error: errorMessages };

      });
  }
}
