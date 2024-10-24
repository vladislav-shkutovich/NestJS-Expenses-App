import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { TRANSFER_MODEL } from '../common/constants/database.constants'
import type { Transfer } from './schemas/transfer.schema'

@Injectable()
export class TransferDatabaseService {
  constructor(
    @InjectModel(TRANSFER_MODEL) private transferModel: Model<Transfer>,
  ) {}
}
