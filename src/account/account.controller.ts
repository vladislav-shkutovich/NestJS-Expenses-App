import { Controller } from '@nestjs/common'

import { ACCOUNTS_ROUTE } from '../common/constants/routing.constants'
import { AccountService } from './account.service'

@Controller(ACCOUNTS_ROUTE)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
}
