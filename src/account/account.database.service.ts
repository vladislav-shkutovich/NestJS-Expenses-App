import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { ACCOUNT_MODEL } from '../common/constants/database.constants'
import type { Account } from './schemas/account.schema'

@Injectable()
export class AccountDatabaseService {
  constructor(
    @InjectModel(ACCOUNT_MODEL) private accountModel: Model<Account>,
  ) {}
}
