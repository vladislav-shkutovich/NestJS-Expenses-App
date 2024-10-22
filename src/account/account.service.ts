import { Injectable } from '@nestjs/common'

import { AccountDatabaseService } from './account.database.service'

@Injectable()
export class AccountService {
  constructor(
    private readonly accountDatabaseService: AccountDatabaseService,
  ) {}
}
