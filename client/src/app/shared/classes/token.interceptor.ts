import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.services";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor{
    constructor(private auth: AuthService,
                private router: Router){

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if(this.auth.isAuthenticated()){
            req = req.clone({
                setHeaders: {
                    Authorization: this.auth.getToken()
                }
            })
        }
                
        return next.handle(req).pipe(
            catchError(
                (error: HttpErrorResponse) => this.handelAuthError(error)
            )
        )
    }


    private handelAuthError(error: HttpErrorResponse): Observable<any>{
        if(error.status === 401){
            this.router.navigate(['/login']), {
                queryParams:{
                    sessionFaild: true
                }
            }
        }
        return throwError(error)
    }
}