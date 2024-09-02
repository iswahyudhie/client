import { ResolveFn } from '@angular/router';
import { MembersService } from '../Services/members.service';
import { inject } from '@angular/core';
import { Member } from '../Model/member';

export const memberDetailedResolver: ResolveFn<Member | null> = (route, state) => {  
  const memberService = inject(MembersService);
  const username = route.paramMap.get('username');
  if (!username) {
    return null
  }
  return memberService.getMember(username);
};
