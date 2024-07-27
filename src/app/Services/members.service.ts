import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Member } from '../Model/member';
import { PaginatedResult } from '../Model/Pagination';
import { UserParams } from '../Model/userParams';
import { of } from 'rxjs';
import { AccountService } from './account.service';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  http = inject(HttpClient);
  accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null)
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user))

  resetUserParam(){
    this.userParams.set(new UserParams(this.user));
  }

  getMembers() {
    const response = this.memberCache.get(Object.values(this.userParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);;

    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize)

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);
    
    return this.http.get<Member[]>(this.baseUrl + 'users',{observe:'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.userParams()).join('-'),response);
      }
    });
  }

  getMember(username: string) {
    const member: Member = [... this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body),[])
      .find((m: Member) => m.username === username);
    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member);
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId,{});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
